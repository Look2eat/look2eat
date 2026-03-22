import "dotenv/config";

console.log('DATABASE_URL at startup:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_URL value:', process.env.DATABASE_URL);

import { createApp } from "./app";
import { initDb } from "./config/db";

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  await initDb();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
