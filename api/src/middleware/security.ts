import type { Express } from "express";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env, getCorsOrigin } from "../utils/env.js";
import { error } from "console";

export function applySecurity(app: Express) {
    app.set("trust proxy", 1);

    app.use(helmet())

    app.use(
        cors({
            origin: getCorsOrigin(),
            credentials: true,
        })
    )

    app.use(cookieParser())

    app.use(
        express.json({
            limit: "200kb",
        })
    )

    app.use(
        rateLimit({
            windowMs: 66_000,
            limit: 120,
            standardHeaders: true,
            legacyHeaders: false,
            message: { error: { code: 'Rate_Limited', message: 'Too many requests' }} as any,
        })
    )
}