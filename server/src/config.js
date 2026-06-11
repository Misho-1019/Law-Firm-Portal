const isProd = process.env.NODE_ENV === "production";

const config = {
  // Required
  MONGO_URI: process.env.MONGO_URI,
  SECRET_KEY: process.env.SECRET_KEY,

  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  isProd,

  // Client origins (comma-separated)
  CLIENT_URLS: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Email
  GMAIL_USER: (process.env.GMAIL_USER || "").trim(),
  GMAIL_APP_PASS: (process.env.GMAIL_APP_PASS || "").replace(/\s+/g, ""),
  EMAILS_DISABLED: process.env.EMAILS_DISABLED === "1",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,

  // Reminders
  REMINDERS_DISABLED: process.env.REMINDERS_DISABLED === "1",
  REMINDER_BATCH_LIMIT: Number(process.env.REMINDER_BATCH_LIMIT || 100),
  USE_INTERNAL_CRON: process.env.USE_INTERNAL_CRON === "true",

  // Auth / cookies
  COOKIE_SECURE:
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "1"
      : isProd,
  COOKIE_SAMESITE:
    (process.env.COOKIE_SAMESITE || "lax").toLowerCase(),

  // Jobs
  CRON_SECRET: process.env.CRON_SECRET || "",
};

// Validate required
const missing = [];
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
