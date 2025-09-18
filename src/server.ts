import app from "./app";
import config from "./config";

export function startServer() {
  const port = Number(config.port);
  const server = app.listen(port, () =>
    console.log(`Server listening on port ${port}`)
  );
  return server;
}

if (require.main === module) {
  startServer();
}
