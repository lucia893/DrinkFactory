# DrinkFactory - Guía de Instalación y Ejecución

Esta guía explica cómo instalar, configurar y correr el proyecto **DrinkFactory - Fábrica de Bebidas Energéticas**.

---

## 1. Requisitos

- Node.js >= 18 (recomendado Node 20 LTS)
- npm >= 9
- Docker y Docker Compose (opcional pero recomendado)
- Redis (si se corre localmente sin Docker)

---

## 2. Clonar el repositorio

```bash
git clone <tu-repositorio> DrinkFactory
cd DrinkFactory/DrinkFactory
```

---

## 3. Configuración de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
REDIS_URL=redis://redis:6379
```

> Nota: Si corrés Redis local sin Docker, usar `redis://localhost:6379`.

---

## 4. Instalación de dependencias

```bash
npm install
npm install --save uuid
npm install --save-dev @types/uuid
```

---

## 5. Levantar Redis (opcional sin Docker)

```bash
docker run --name redis-energy -p 6379:6379 redis:7-alpine
```

---

## 6. Compilar TypeScript

```bash
npm run build
```

---

## 7. Ejecutar la aplicación

### Opción 1: Con Docker Compose (recomendado)

```bash
docker-compose up --build
```

Esto levanta:
- API en http://localhost:3000
- Redis en localhost:6379

### Opción 2: Local sin Docker

```bash
npm start
```

> Asegurarse que Redis esté corriendo.

---

## 8. Probar la API

### Endpoint: POST `/api/order-drink`

Headers: `Content-Type: application/json`

Body ejemplo:
```json
{
  "orderId": "order1",
  "drinkType": "cosmic_punch",
  "quantity": 5
}
```

### Comandos curl de prueba

- Pedido exitoso:
```bash
curl -X POST http://localhost:3000/api/order-drink \
  -H "Content-Type: application/json" \
  -d '{"orderId":"order_success","drinkType":"cosmic_punch","quantity":5}'
```

- Pedido con inventario insuficiente:
```bash
curl -X POST http://localhost:3000/api/order-drink \
  -H "Content-Type: application/json" \
  -d '{"orderId":"order_fail","drinkType":"lunar_berry","quantity":1000}'
```

---

## 9. Verificar estado en Redis

```bash
docker exec -it redis-energy redis-cli
# Listar pedido
hgetall order:order1
# Inventario
zrange ingredient_inventory 0 -1 withscores
# Contador bebidas
get drink_counter:cosmic_punch
```

---

## 10. Ejecutar tests

```bash
npm test
```

> Esto ejecuta los tests unitarios de validación y servicios.

---

## 11. Notas finales

- La cola Bull maneja la producción asincrónica de pedidos.
- Se recomienda usar la colección Postman proporcionada para pruebas rápidas.
- Asegurarse que Redis esté accesible según la configuración de `.env`.

