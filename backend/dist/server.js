"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const jobs_1 = require("./bootstrap/jobs");
async function main() {
    await (0, db_1.initDb)();
    const app = (0, app_1.createApp)();
    await (0, jobs_1.startJobs)();
    app.listen(env_1.env.port, () => {
        console.log(`Server running on http://localhost:${env_1.env.port}`);
    });
}
main().catch((error) => {
    console.error("Fatal error starting server:", error);
    process.exit(1);
});
