import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const GMAIL_USER = (process.env.GMAIL_USER || "").trim();
const GMAIL_APP_PASS = (process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");
const IS_PROD = process.env.NODE_ENV === "production";
const EMAIL_DISABLED = process.env.EMAIL_DISABLED === '1'

if (!EMAIL_DISABLED && (!GMAIL_USER || !GMAIL_APP_PASS)) {
  throw new Error(`[mailer] Missing GMAIL_USER or GMAIL_APP_PASS`);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SMTPS
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
  ...(IS_PROD ? {} : { tls: { rejectUnauthorized: false } }), // DEV ONLY
});

// Optional but useful:
transporter.verify((err) => {
  if (err) console.error("[mailer] verify failed:", err.message);
  else console.log("[mailer] verify OK");
});

/** sendEmail({ to, subject, html?, text? }) */
export async function sendEmail({ to, subject, html, text }) {
  if (process.env.EMAIL_DISABLED === '1') {
    return { skipped: true, reason: 'EMAIL_DISABLED' }
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
