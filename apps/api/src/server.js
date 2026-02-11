import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, "0.0.0.0", () => {
    console.log(`SmartNotes API listening on http://0.0.0.0:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("API bootstrap failed", error);
  process.exit(1);
});
