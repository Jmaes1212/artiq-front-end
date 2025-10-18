const orders = new Map();

function recordOrder(prodigiResponse) {
  const id = prodigiResponse.id || `local-${Date.now()}`;
  const entry = {
    id,
    status: prodigiResponse.status || "submitted",
    createdAt: new Date().toISOString(),
    response: prodigiResponse,
    updates: []
  };
  orders.set(id, entry);
  return entry;
}

function recordWebhook(payload) {
  if (!payload) return null;
  const id = payload.id || payload.orderId;
  if (!id) return null;
  const existing = orders.get(id) || {
    id,
    status: payload.status || "unknown",
    createdAt: new Date().toISOString(),
    response: null,
    updates: []
  };
  existing.status = payload.status || existing.status;
  existing.updates.push({ receivedAt: new Date().toISOString(), payload });
  orders.set(id, existing);
  return existing;
}

function getOrder(id) {
  return orders.get(id) || null;
}

module.exports = { recordOrder, recordWebhook, getOrder };
