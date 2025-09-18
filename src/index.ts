// Punto de entrada: arranca servidor y worker
import "./queue/production.worker";
import { startServer } from "./server";

startServer();
