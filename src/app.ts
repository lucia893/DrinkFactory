import express from "express";
import orderRoutes from "./routes/order.routes";

const app = express();

app.use(express.json());

// Rutas principales
app.use("/api", orderRoutes);

// Health check
app.get("/health", (_, res) => res.json({ ok: true }));

export default app;
