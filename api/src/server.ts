import express from "express";
import { applySecurity } from "./middleware/security.js";
import { healthRouter } from "./routes/health.js";

export function createServer() {
    const app = express();

    applySecurity(app);

    app.use(healthRouter)

    app.use((_req, res) => {
        res.status(404).json({ error: { code: 'Not_Found', message: 'Route Not Found' }});
    })

    app.use((err: any, _req: any, res: any, _next: any) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(err);
        }
        res.status(500).json({ error: { code: 'Internal_Server_Error', message: 'Something went wrong' }});
    })

    return app;
}