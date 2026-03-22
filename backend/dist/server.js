"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
console.log('DATABASE_URL at startup:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_URL value:', process.env.DATABASE_URL);
const app_1 = require("./app");
const db_1 = require("./config/db");
const PORT = Number(process.env.PORT ?? 4000);
async function main() {
    await (0, db_1.initDb)();
    const app = (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
main().catch((error) => {
    console.error("Fatal error starting server:", error);
    process.exit(1);
});
