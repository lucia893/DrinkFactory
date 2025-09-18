export type OrderState = "pending" | "in_production" | "completed" | "rejected";

export interface Order {
  orderId: string;
  drinkType: string;
  quantity: number;
  state: OrderState;
  createdAt: string; // ISO
}
