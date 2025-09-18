import { v4 as uuidv4 } from "uuid";
import RedisRepository from "../repositories/redis.repository";
import { InventoryService } from "./inventory.service";
import { Order } from "../models/order.model";
import productionQueue from "../queue/production.queue";

export class OrderService {
  constructor(
    private repo: RedisRepository,
    private inventory: InventoryService
  ) {}

  async createOrder(payload: {
    orderId?: string;
    drinkType: string;
    quantity: number;
  }) {
    const orderId = payload.orderId || uuidv4();
    const order: Order = {
      orderId,
      drinkType: payload.drinkType,
      quantity: payload.quantity,
      state: "pending",
      createdAt: new Date().toISOString(),
    };

    // validar inventario
    const availability = await this.inventory.canProduce(
      order.drinkType,
      order.quantity
    );
    if (!availability.ok) {
      order.state = "rejected";
      await this.repo.saveOrder(order);
      return { ok: false, reason: availability };
    }

    // reservar (naive)
    await this.inventory.reserveIngredients(order.drinkType, order.quantity);

    // persistir pedido
    await this.repo.saveOrder(order);

    // añadir a la cola
    await productionQueue.add({ orderId: order.orderId });

    return { ok: true, orderId };
  }
}

export default OrderService;
