import "dotenv/config";

import { createApp } from "./app";
import { initDb } from "./config/db";
import { env } from "./config/env";
import { startJobs } from "./bootstrap/jobs";

async function main() {
  await initDb();

  const app = createApp();

  await startJobs();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});