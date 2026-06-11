import dotenv from "dotenv";
dotenv.config();

export interface AppConfig {
  MONGO_URI: string;
  SECRET_KEY: string;
  PORT: number;
  NODE_ENV: string;
  isProd: boolean;
  CLIENT_URLS: string[];
  GMAIL_USER: string;
  GMAIL_APP_PASS: string;
  EMAILS_DISABLED: boolean;
  ADMIN_EMAIL: string | null;
  FIRM_NAME: string;
  REMINDERS_DISABLED: boolean;
  REMINDER_BATCH_LIMIT: number;
  USE_INTERNAL_CRON: boolean;
  COOKIE_SECURE: boolean;
  COOKIE_SAMESITE: string;
  CRON_SECRET: string;
}

const isProd = process.env.NODE_ENV === "production";

const config: AppConfig = {
  MONGO_URI: process.env.MONGO_URI!,
  SECRET_KEY: process.env.SECRET_KEY!,
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  isProd,
  CLIENT_URLS: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  GMAIL_USER: (process.env.GMAIL_USER || "").trim(),
  GMAIL_APP_PASS: (process.env.GMAIL_APP_PASS || "").replace(/\s+/g, ""),
  EMAILS_DISABLED: process.env.EMAILS_DISABLED === "1",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
  FIRM_NAME: process.env.FIRM_NAME || "LexSchedule",
  REMINDERS_DISABLED: process.env.REMINDERS_DISABLED === "1",
  REMINDER_BATCH_LIMIT: Number(process.env.REMINDER_BATCH_LIMIT || 100),
  USE_INTERNAL_CRON: process.env.USE_INTERNAL_CRON === "true",
  COOKIE_SECURE:
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "1"
      : isProd,
  COOKIE_SAMESITE:
    (process.env.COOKIE_SAMESITE || "lax").toLowerCase(),
  CRON_SECRET: process.env.CRON_SECRET || "",
};

const missing: string[] = [];
if (!config.MONGO_URI) missing.push("MONGO_URI");
if (!config.SECRET_KEY) missing.push("SECRET_KEY");

if (missing.length) {
  console.error(
    JSON.stringify({
      level: "error",
      timestamp: new Date().toISOString(),
      message: "missing required env vars",
      missing,
    })
  );
  if (isProd) process.exit(1);
}

export default config;
