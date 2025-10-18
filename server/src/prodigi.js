const PRODIGI_API_KEY = process.env.PRODIGI_API_KEY;
const PRODIGI_API_BASE = (process.env.PRODIGI_API_BASE || "https://api.sandbox.prodigi.com/v4.0").replace(/\/$/, "");

if (typeof fetch !== "function") {
  throw new Error("Node 18+ required (fetch not found)");
}

function normaliseItem(item, index) {
  return {
    sku: item.prodigiSku,
    copies: item.quantity || 1,
    sizing: "fillPrintArea",
    merchantReference: `${item.productId}-${index}`,
    assets: [{ printArea: "default", url: item.assetUrl }]
  };
}

function buildOrderPayload({ customer, shipping, items, notes }) {
  return {
    merchantReference: customer.email,
    idempotencyKey: `${customer.email}-${Date.now()}`,
    shippingMethod: "Budget",
    recipient: {
      name: customer.name,
      email: customer.email,
      address: {
        line1: shipping.address1,
        line2: shipping.address2,
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
    throw new Error(`Prodigi API error ${res.status}: ${err}`);
  }

  return res.json();
}

module.exports = { buildOrderPayload, submitOrder };
