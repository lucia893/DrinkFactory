import { Request, Response } from "express";
import RedisRepository from "../repositories/redis.repository";
import { InventoryService } from "../services/inventory.service";
import OrderService from "../services/order.service";
import { validateOrderPayload } from "../validators/order.validator";

const repo = new RedisRepository();
const inventory = new InventoryService(repo);
const orderService = new OrderService(repo, inventory);

export async function postOrder(req: Request, res: Response) {
  const body = req.body;
  const validation = validateOrderPayload(body);
  if (!validation.valid)
    return res.status(400).json({ ok: false, error: validation.reason });

  const result = await orderService.createOrder({
    orderId: body.orderId,
    drinkType: body.drinkType,
    quantity: body.quantity,
  });
  if (!result.ok)
    return res.status(400).json({ ok: false, error: result.reason });

  return res.status(201).json({ ok: true, orderId: result.orderId });
}
