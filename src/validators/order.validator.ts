export function validateOrderPayload(payload: any) {
  if (!payload) return { valid: false, reason: "empty_payload" };
  const { orderId, drinkType, quantity } = payload;
  if (!drinkType || typeof drinkType !== "string")
    return { valid: false, reason: "invalid_drinkType" };
  if (!quantity || typeof quantity !== "number" || quantity <= 0)
    return { valid: false, reason: "invalid_quantity" };
  if (orderId && typeof orderId !== "string")
    return { valid: false, reason: "invalid_orderId" };
  return { valid: true };
}
