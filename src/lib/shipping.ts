// Shipping rules (single source of truth for UI and server-side pricing).
// Orders of Rs. 799 or more ship free; below that a flat Rs. 50 applies.
export const FREE_SHIPPING_THRESHOLD = 799; // rupees
export const SHIPPING_FEE = 50; // rupees

/** Shipping charge (in rupees) for a given item subtotal (in rupees). */
export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
