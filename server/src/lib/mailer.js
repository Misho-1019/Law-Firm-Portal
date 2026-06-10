import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const GMAIL_USER = (process.env.GMAIL_USER || "").trim();
const GMAIL_APP_PASS = (process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");
const IS_PROD = process.env.NODE_ENV === "production";
const EMAILS_DISABLED = process.env.EMAILS_DISABLED === '1'

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
  if (process.env.EMAILS_DISABLED === '1') {
    return { skipped: true, reason: 'EMAILS_DISABLED' }
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[mailer] Skipping — missing GMAIL credentials");
    return { skipped: true, reason: "missing credentials" };
  }

  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (!recipients.length) return { skipped: true, reason: "missing recipient" };

  const mail = {
    from: `"Law Office" <${GMAIL_USER}>`,
    to: recipients.join(", "),
    subject,
    html: html || (text ? `<pre>${text}</pre>` : undefined),
    text: text || undefined,
  };

  const info = await transporter.sendMail(mail);
  console.log("[mailer] SENT", { messageId: info.messageId, to: recipients, subject });
  return { id: info.messageId };
}
