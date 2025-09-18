import IORedis, { Redis } from "ioredis";
import config from "../config";
import { Order } from "../models/order.model";

export class RedisRepository {
  private client: Redis;

  constructor(client?: Redis) {
    this.client = client || new IORedis(config.redisUrl);
  }

  // Pedidos: guardamos como hash: `order:{orderId}`
  async saveOrder(order: Order) {
    const key = `order:${order.orderId}`;
    await this.client.hset(key, {
      orderId: order.orderId,
      drinkType: order.drinkType,
      quantity: String(order.quantity),
      state: order.state,
      createdAt: order.createdAt,
    });
  }
  async updateOrderState(orderId: string, state: string) {
    await this.client.hset(`order:${orderId}`, { state });
  }
  async getIngredientQuantity(ingredient: string): Promise<number> {
    const score = await this.client.zscore("ingredient_inventory", ingredient);
    return score ? Number(score) : 0;
  }
  async reserveIngredient(
    ingredient: string,
    amount: number
  ): Promise<boolean> {
    const current = await this.getIngredientQuantity(ingredient);
    if (current < amount) {
      return false;
    }
    await this.client.zincrby("ingredient_inventory", -amount, ingredient);
    return true;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const key = `order:${orderId}`;
    const data = await this.client.hgetall(key);
    if (Object.keys(data).length === 0) return null;
    return {
      orderId: data.orderId,
      drinkType: data.drinkType,
      quantity: Number(data.quantity),
      state: data.state as any,
      createdAt: data.createdAt,
    };
  }

  async incrementDrinkCounter(drinkType: string, amount: number) {
    await this.client.incrby(`drink_counter:${drinkType}`, amount);
  }
}

export default RedisRepository;
