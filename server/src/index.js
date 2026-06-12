import dotenv from "dotenv";

dotenv.config();

import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { startReminderCron } from "./jobs/reminders.js";
import logger from "./utils/logger.js";
import config from "./config.js";
import * as Sentry from "@sentry/node";

const app = express();

if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.NODE_ENV,
    integrations: [Sentry.expressIntegration()],
  });
  logger.info("sentry initialized", { env: config.NODE_ENV });
}

app.set("trust proxy", 1)

app.use(helmet());

const allowlist = config.CLIENT_URLS;


const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (Postman/curl) with no Origin header
    if (!origin) return callback(null, true);

    if (allowlist.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Handle preflight requests explicitly
app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many auth attempts from this IP, please try again later.'
})

app.use("/api/auth", authLimiter)
app.use(limiter)
app.use(authMiddleware)

app.get("/health", async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbOk = dbState === 1;
  const emailOk = !!(config.GMAIL_USER && config.GMAIL_APP_PASS) || config.EMAILS_DISABLED;
  const ok = dbOk;
  return res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    db: ["disconnected","connected","connecting","disconnecting"][dbState] || "unknown",
    email: emailOk ? "configured" : "missing",
  });
});

app.use(router);

if (config.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

async function start() {
  mongoose.connection.on("disconnected", () => {
    logger.warn("mongodb disconnected", { event: "disconnected" });
  });
  mongoose.connection.on("error", (err) => {
    logger.error("mongodb error", { event: "error", message: err.message });
  });
  mongoose.connection.on("reconnected", () => {
    logger.info("mongodb reconnected", { event: "reconnected" });
  });
  try {
    await mongoose.connect(config.MONGO_URI)
    logger.info("connected to database");
    
  } catch (error) {
      logger.error("database connection failed", { message: error.message });

      if (config.isProd) {
        process.exit(1)
      }
  }

  app.listen(config.PORT, () => logger.info("server started", { port: config.PORT }))
  
  if (config.USE_INTERNAL_CRON) {
    startReminderCron();
    logger.info("internal cron enabled");
  } else {
    logger.info("internal cron disabled (using Scheduler)");
  }

}

start()