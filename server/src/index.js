const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const crypto = require("crypto");

// Load .env from /server (explicit path so there's no doubt)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// DEBUG (safe): prints length, not the key itself
console.log("Prodigi key length:", (process.env.PRODIGI_API_KEY || "").length);
console.log("Prodigi base:", process.env.PRODIGI_API_BASE);

const { buildOrderPayload, submitOrder } = require("./prodigi");
const { recordOrder, recordWebhook, getOrder } = require("./orders");
const payments = require("./payments");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  express.json({
    limit: "2mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf; // keep raw body for webhook signature
    },
  })
);
app.use(cors());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/stripe/config", (_req, res) => {
  if (!payments.hasStripeConfig()) {
    return res.status(503).json({
      error: "Stripe is not configured on the server."
    });
  }
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
  });
});

app.post("/api/payments/create-intent", async (req, res) => {
  try {
    if (!payments.hasStripeConfig()) {
      return res.status(503).json({ error: "Stripe is not configured." });
    }
    const { amount, currency = "gbp", metadata } = req.body || {};
    const intent = await payments.createPaymentIntent({
      amount,
      currency,
      metadata: {
        origin: "artiq-storefront",
        ...(metadata || {})
      }
    });
    res.status(201).json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: intent.amount,
      currency: intent.currency
    });
  } catch (error) {
    console.error("Stripe create intent error:", error);
    res.status(error.statusCode || 500).json({
      error: error.message || "Unable to create payment intent",
      details: error.details || null
    });
  }
});

function validateCheckoutPayload(payload) {
  if (!payload) return "Checkout payload is missing.";
  const { customer, shipping, items, paymentIntentId } = payload;
  if (!customer?.name || !customer?.email) return "Customer name and email are required.";
  if (!shipping?.address1 || !shipping?.city || !shipping?.postcode) return "Shipping address, city and postcode are required.";
  if (!Array.isArray(items) || !items.length) return "At least one item must be present in the cart.";
  const bad = items.find((i) => !i.prodigiSku || !i.assetUrl || !i.price);
  if (bad) return "Each item must include a Prodigi SKU, asset URL and price.";
  if (!paymentIntentId) return "Payment intent reference is required.";
  return null;
}

app.post("/api/checkout", async (req, res) => {
  const error = validateCheckoutPayload(req.body);
  if (error) return res.status(400).json({ error });

  let paymentIntent;
  try {
    if (!payments.hasStripeConfig()) {
      return res.status(503).json({ error: "Stripe is not configured on the server." });
    }
    paymentIntent = await payments.retrievePaymentIntent(req.body.paymentIntentId);
    if (!["requires_capture", "succeeded"].includes(paymentIntent.status)) {
      return res.status(402).json({
        error: "Payment not completed",
        details: { status: paymentIntent.status }
      });
    }

    const payload = buildOrderPayload(req.body);
    const prodigiResp = await submitOrder(payload);
    if (paymentIntent.status === "requires_capture") {
      await payments.capturePaymentIntent(paymentIntent.id);
      paymentIntent.status = "succeeded";
    }
    const record = recordOrder(prodigiResp);
    res.status(201).json({
      orderId: record.id,
      status: record.status,
      prodigiResponse: prodigiResp,
    });
  } catch (e) {
    if (paymentIntent?.status === "requires_capture") {
      payments
        .cancelPaymentIntent(paymentIntent.id)
        .catch((cancelErr) => console.error("Stripe cancel failed:", cancelErr));
    } else if (paymentIntent?.status === "succeeded") {
      payments
        .refundPaymentIntent(paymentIntent.id)
        .catch((refundErr) => console.error("Stripe refund failed:", refundErr));
    }
    console.error("Prodigi order error:", e);
    const prodigiPaymentError =
      typeof e?.message === "string" && /no card details/i.test(e.message);
    const friendlyMessage = prodigiPaymentError
      ? "Prodigi rejected the order because no card is on file for your Prodigi account. Add a payment method in Prodigi or switch the account to invoice billing, then try again."
      : e.message || "Order submission failed";
    res.status(e.statusCode || 500).json({
      error: friendlyMessage,
      details: e.details || null,
    });
  }
});

app.post("/api/webhooks/prodigi", (req, res) => {
  const secret = process.env.PRODIGI_WEBHOOK_SECRET;
  const sigHeader = req.get("x-prodigi-signature");
  if (secret && sigHeader) {
    try {
      const hmac = crypto
        .createHmac("sha256", secret)
        .update(req.rawBody || Buffer.from(JSON.stringify(req.body)))
        .digest("hex");
      if (hmac !== sigHeader) return res.status(401).json({ error: "Invalid webhook signature" });
    } catch {
      return res.status(400).json({ error: "Could not verify webhook" });
    }
  }
  const entry = recordWebhook(req.body);
  res.status(202).json({ received: true, orderId: entry?.id || null });
});

app.get("/api/orders/:id", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// serve the static frontend from project root
const publicRoot = path.resolve(__dirname, "..", "..");
app.use(express.static(publicRoot));
app.get("/", (_req, res) => res.sendFile(path.join(publicRoot, "index.html")));
app.get("/category", (_req, res) => res.sendFile(path.join(publicRoot, "category.html")));
app.get("/product", (_req, res) => res.sendFile(path.join(publicRoot, "product.html")));

const DEFAULT_PORT = 4000;
const resolvedPort = Number(PORT) || DEFAULT_PORT;
const MAX_PORT_SHIFTS = 5;

function startServer(port, attempt = 0) {
  const serverInstance = app.listen(port, () => {
    console.log(`\u2705 Server running on port ${port}`);
  });

  serverInstance.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attempt < MAX_PORT_SHIFTS) {
      const nextPort = port + 1;
      console.warn(`\u26A0\uFE0F Port ${port} is already in use. Trying ${nextPort}...`);
      setTimeout(() => {
        try {
          serverInstance.close();
        } catch (closeErr) {
          console.warn("Port handoff close failed:", closeErr);
        }
        startServer(nextPort, attempt + 1);
      }, 1000);
    } else if (err.code === "EADDRINUSE") {
      console.error(`\u274C Ports from ${resolvedPort} through ${port} are in use. Server not started.`);
    } else {
      console.error("\u274C Server error:", err);
    }
  });
}

startServer(resolvedPort);
