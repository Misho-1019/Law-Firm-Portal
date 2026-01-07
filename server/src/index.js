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

const app = express();

app.set("trust proxy", 1)

app.use(helmet());

const allowlist = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);


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

app.use(express.json());

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
})

app.use(limiter)
app.use(authMiddleware)
app.use(router);

async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Missing MONGO_URI env var");

    await mongoose.connect(uri)
    console.log('Successfully connected to the database');
    
  } catch (error) {
      console.log('Could not connect to the database');
      console.log(error.message);

      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
  }

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`))
  
  startReminderCron();
}

start()