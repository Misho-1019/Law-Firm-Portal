import nodemailer from "nodemailer";
import dotenv from "dotenv";
import config from "../config.js";
import logger from "../utils/logger.js";

dotenv.config();

const GMAIL_USER = config.GMAIL_USER;
const GMAIL_APP_PASS = config.GMAIL_APP_PASS;
const IS_PROD = config.isProd;
const EMAILS_DISABLED = config.EMAILS_DISABLED;

let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  if (!GMAIL_USER || !GMAIL_APP_PASS) return null;
  _transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
    ...(IS_PROD ? {} : { tls: { rejectUnauthorized: false } }),
  });
  return _transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  if (config.EMAILS_DISABLED) {
    return { skipped: true, reason: 'EMAILS_DISABLED' }
  }

  const transporter = getTransporter();
  if (!transporter) {
    logger.warn("mailer skipping - missing credentials");
    return { skipped: true, reason: "missing credentials" };
  }

  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (!recipients.length) return { skipped: true, reason: "missing recipient" };

  const mail = {
    from: `"${config.FIRM_NAME}" <${GMAIL_USER}>`,
    to: recipients.join(", "),
    subject,
    html: html || (text ? `<pre>${text}</pre>` : undefined),
    text: text || undefined,
  };

  const info = await transporter.sendMail(mail);
  logger.info("mail sent", { to: recipients, subject });
  return { id: info.messageId };
}
