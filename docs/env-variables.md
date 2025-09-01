Web (/web/.env.local)

NEXT_PUBLIC_APP_NAME — Display name (e.g., “Icko Law”).

NEXT_PUBLIC_WEB_URL — Public site base URL (e.g., http://localhost:3000 in dev).

API_BASE_URL — The API origin (e.g., http://localhost:4000).

(optional) NEXT_PUBLIC_DEFAULT_LOCALE — en (add bg later).

(optional) NEXT_PUBLIC_TIMEZONE — Europe/Sofia.

API (/api/.env)

Server & CORS

PORT — API port (dev: 4000).

CORS_ORIGIN — Allowed web origin (dev: http://localhost:3000).

(optional) COOKIE_DOMAIN — e.g., .example.com in prod.

Auth & Sessions

JWT_ACCESS_SECRET — strong random string.

JWT_REFRESH_SECRET — strong random string.

ACCESS_TTL — e.g., 15m.

REFRESH_TTL — e.g., 14d.

Database

DATABASE_URL — Postgres connection string (dev will point to your local container).

(optional) DB_SSL — false in dev, true in prod if your provider requires SSL.

Object Storage (MinIO/S3)

S3_ENDPOINT — e.g., http://127.0.0.1:9000 (MinIO dev).

S3_REGION — e.g., eu-central-1.

S3_BUCKET — e.g., law-firm-docs.

S3_ACCESS_KEY_ID — dev key.

S3_SECRET_ACCESS_KEY — dev secret.

(optional) S3_FORCE_PATH_STYLE — true (recommended for MinIO).

Email (SMTP)

SMTP_HOST — 127.0.0.1 (Mailpit dev).

SMTP_PORT — 1025.

SMTP_USER — (blank for dev).

SMTP_PASS — (blank for dev).

EMAIL_FROM — e.g., law-office@example.com.

Appointments & Locale

TIMEZONE — Europe/Sofia (display purposes).

APPOINTMENT_SLOT_MINUTES — e.g., 30.

APPOINTMENT_BUFFER_MINUTES — e.g., 15.

Admin seed (for first login)

ADMIN_EMAIL — your dad’s email.

ADMIN_PASSWORD — a strong temp password (change after first login).

Security/ops (optional)

RATE_LIMIT_PER_MINUTE — e.g., 120.

LOG_LEVEL — info (dev), warn/error (prod).

Dev DB tool: Postgres in Docker (yes).

Dev storage: MinIO (yes).

Dev email: Mailpit (yes).

Timezone: Europe/Sofia.

Access/refresh TTL: 15m / 14d (or your preference).

Bucket name: law-firm-docs (or your name).

Client uploads allowed in v1: yes/no (pick one; affects storage usage).

Public registration: invite-only (confirmed).