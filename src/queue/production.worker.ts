import queue from "./production.queue";
import RedisRepository from "../repositories/redis.repository";
import { InventoryService } from "../services/inventory.service";

const repo = new RedisRepository();
const inventory = new InventoryService(repo);

queue.process(async (job) => {
  const { orderId } = job.data as { orderId: string };
  // obtener pedido
  const order = await repo.getOrder(orderId);
  if (!order) return Promise.reject(new Error("order_not_found"));

  // marcar in_production
  await repo.updateOrderState(orderId, "in_production");

  // simulación de producción
  await new Promise((res) => setTimeout(res, 3000));

  // Consumir inventario (ya reservado). En este ejemplo asumimos que reserva ya decrementó (reserveIngredients decremented).
  // Si usas reserva no destructiva, debes decrementar aquí.

  // marcar completado
  await repo.updateOrderState(orderId, "completed");

  // incrementar contador de bebida
  await repo.incrementDrinkCounter(order.drinkType, order.quantity);

  return { ok: true };
});

// manejo básico de errores
queue.on("failed", (job, err) => {
  console.error("Job failed", job.id, err);
});

export default queue;
