const stripeSecret = process.env.STRIPE_SECRET_KEY;

let stripeClient = null;

function getStripe() {
  if (!stripeSecret) {
    const error = new Error("Stripe secret key is not configured");
    error.statusCode = 500;
    error.details = {
      hint: "Set STRIPE_SECRET_KEY in the server environment to enable payments."
    };
    throw error;
  }
  if (!stripeClient) {
    // Lazy-load to avoid throwing when the key is missing until payment is attempted
    // eslint-disable-next-line global-require
    const Stripe = require("stripe");
    stripeClient = Stripe(stripeSecret);
  }
  return stripeClient;
}

async function createPaymentIntent({ amount, currency = "gbp", metadata = {} }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    const error = new Error("Invalid payment amount");
    error.statusCode = 400;
    throw error;
  }
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    capture_method: "manual",
    metadata
  });
  return intent;
}

async function retrievePaymentIntent(paymentIntentId) {
  if (!paymentIntentId) {
    const error = new Error("Missing paymentIntentId");
    error.statusCode = 400;
    throw error;
  }
  const stripe = getStripe();
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

async function capturePaymentIntent(paymentIntentId) {
  if (!paymentIntentId) {
    const error = new Error("Missing paymentIntentId for capture");
    error.statusCode = 400;
    throw error;
  }
  const stripe = getStripe();
  return stripe.paymentIntents.capture(paymentIntentId);
}

async function cancelPaymentIntent(paymentIntentId) {
  if (!paymentIntentId) {
    const error = new Error("Missing paymentIntentId for cancel");
    error.statusCode = 400;
    throw error;
  }
  const stripe = getStripe();
  return stripe.paymentIntents.cancel(paymentIntentId);
}

async function refundPaymentIntent(paymentIntentId) {
  if (!paymentIntentId) {
    const error = new Error("Missing paymentIntentId for refund");
    error.statusCode = 400;
    throw error;
  }
  const stripe = getStripe();
  return stripe.refunds.create({ payment_intent: paymentIntentId });
}

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
  capturePaymentIntent,
  cancelPaymentIntent,
  refundPaymentIntent,
  hasStripeConfig: () => Boolean(stripeSecret)
};
