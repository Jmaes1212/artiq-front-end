const PRODIGI_API_KEY = process.env.PRODIGI_API_KEY;
const PRODIGI_API_BASE = (process.env.PRODIGI_API_BASE || "https://api.sandbox.prodigi.com/v4.0").replace(/\/$/, "");

function ensureApiKey() {
  if (!PRODIGI_API_KEY) {
    throw Object.assign(new Error("Prodigi API key is not configured"), {
      statusCode: 500,
      details: {
        hint: "Set the PRODIGI_API_KEY environment variable to your Prodigi API key before submitting an order.",
      },
    });
  }
}

if (typeof fetch !== "function") {
  throw new Error("Node 18+ required (fetch not found)");
}

function normaliseItem(item, index) {
  const attributes = {};

  if (Array.isArray(item.attributes)) {
    item.attributes.forEach((attr) => {
      if (attr && attr.name && attr.value != null) {
        attributes[String(attr.name)] = String(attr.value).toLowerCase();
      }
    });
  } else if (item.attributes && typeof item.attributes === "object") {
    Object.entries(item.attributes).forEach(([name, value]) => {
      if (value != null) {
        attributes[String(name)] = String(value).toLowerCase();
      }
    });
  } else if (item.frame || item.frameColor) {
    attributes.color = String(item.frameColor || item.frame).toLowerCase();
  }

  const normalisedAttributes = Object.keys(attributes).length ? attributes : undefined;

  return {
    sku: item.prodigiSku,
    copies: item.quantity || 1,
    sizing: "fillPrintArea",
    merchantReference: `${item.productId}-${index}`,
    assets: [{ printArea: "default", url: item.assetUrl }],
    ...(normalisedAttributes ? { attributes: normalisedAttributes } : {})
  };
}

function buildOrderPayload({ customer, shipping, items, notes }) {
  const shippingMethod = (shipping && (shipping.methodCode || shipping.method)) || "Budget";
  return {
    merchantReference: customer.email,
    idempotencyKey: `${customer.email}-${Date.now()}`,
    shippingMethod,
    recipient: {
      name: customer.name,
      email: customer.email,
      address: {
        line1: shipping.address1,
        ...(shipping.address2 ? { line2: shipping.address2 } : {}),
        townOrCity: shipping.city,
        postalOrZipCode: shipping.postcode,
        countryCode: (shipping.countryCode || "GB").toUpperCase()
      }
    },
    items: items.map(normaliseItem),
    ...(notes ? { packingSlip: { message: notes } } : {})
  };
}

async function submitOrder(payload) {
  ensureApiKey();
  const res = await fetch(`${PRODIGI_API_BASE}/Orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": PRODIGI_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    const error = new Error(`Prodigi API error ${res.status}: ${err}`);
    error.statusCode = res.status;
    try {
      error.details = JSON.parse(err);
    } catch {
      error.details = err;
    }
    if (res.status === 401 && PRODIGI_API_KEY) {
      error.details = {
        ...(error.details || {}),
        hint: "Verify that your Prodigi API key is correct and has access to the selected environment (sandbox or production).",
      };
    }
    throw error;
  }

  return res.json();
}

module.exports = { buildOrderPayload, submitOrder };
