H6) DB migrations — final checklist (Knex + node-pg-migrate)

Create a new doc docs/migrations-checklist.md and list the order + columns + indexes. No code, just the plan.

Order

user

cols: id (uuid pk), email (unique, lowercased), password_hash, first_name, last_name, phone, role (text check: ADMIN|CLIENT), email_verified_at, twofa_secret, created_at, updated_at

idx: user_email_uq

session (refresh rotation)

cols: id (uuid pk), user_id (fk user), token_id (or refresh_token_hash), user_agent, ip, expires_at, created_at, revoked_at

idx: session_user_id_idx, session_token_id_uq

invite

cols: id (uuid pk), email, role (default CLIENT), case_id (fk), token (unique), expires_at, used_at, invited_by (fk user), created_at

idx: invite_token_uq, invite_email_idx

intake

cols: id, full_name, email, phone, matter_type, message, status (NEW|CONVERTED|DISMISSED), created_at, updated_at, converted_to_user_id (fk), converted_to_case_id (fk)

idx: intake_status_idx, intake_created_at_idx

case

cols: id, title, case_number, practice_area, status (INTAKE|ACTIVE|ON_HOLD|CLOSED), client_id (fk), created_at, updated_at

idx: case_client_id_idx, case_status_idx, case_updated_at_idx

case_member

cols: case_id (fk), user_id (fk), role

pk: (case_id, user_id)

document

cols: id, case_id (fk), file_name, mime_type, storage_key (unique), version (int default 1), uploaded_by_id (fk), is_clean (bool default true), scanned_at (nullable), created_at

idx: document_case_id_idx, document_created_at_idx, document_storage_key_uq

message

cols: id, case_id (fk), sender_id (fk), body (text), created_at

idx: message_case_created_idx (composite case_id, created_at desc)

appointment

cols: id, case_id (fk), user_id (fk nullable), starts_at (timestamptz), ends_at (timestamptz), location, notes

idx: appointment_case_starts_idx (case_id, starts_at), appointment_starts_idx (starts_at)

appointment_request

cols: id, case_id (fk), requester_id (fk user), type, mode, notes, preferred_slots (jsonb), status (PENDING|PROPOSED|APPROVED|DECLINED|CANCELED), chosen_appointment_id (fk appointment), created_at, updated_at

idx: apptreq_case_status_idx (case_id, status, created_at)

partial unique: one open per (case_id, requester_id):

unique index on (case_id, requester_id) where status IN ('PENDING','PROPOSED')

appointment_proposal (optional)

cols: id, request_id (fk), starts_at, ends_at, status (PENDING|EXPIRED|ACCEPTED)

idx: proposal_request_id_idx

invoice

cols: id, case_id (fk), amount_cents (int), currency (text default 'EUR'), status (DRAFT|SENT|PAID|OVERDUE), due_date (date), issued_at (timestamptz), updated_at

idx: invoice_case_status_idx (case_id, status), invoice_due_date_idx

payment

cols: id, invoice_id (fk), amount_cents (int), provider (text), provider_ref (text), paid_at (timestamptz)

idx: payment_invoice_id_idx

audit_log

cols: id (bigserial pk), user_id (fk nullable), action (text), entity (text), entity_id (text/uuid), created_at (timestamptz), metadata (jsonb)

idx: audit_entity_idx (entity, entity_id), audit_created_idx (created_at)

General rules

Use UUID for primary keys (except audit_log id bigserial okay).

All timestamps are timestamptz (UTC).

Add ON DELETE RESTRICT for critical FKs (e.g., don’t delete a case with documents).

Normalize emails to lowercase and add unique constraint.

Enums: use text + CHECK or native enums; simplest is text + CHECK.

H7) Seeds & defaults (document now)

Seed ADMIN user from env: ADMIN_EMAIL, ADMIN_PASSWORD.

(Later) Seed availability defaults: working hours Mon–Fri, slot 30m, buffer 15m.

Create bucket name law-firm-docs in dev MinIO at first run.