/login

Purpose: sign in clients/admin; redirect by role

Fields: email*, password*; “Forgot password?” link

Errors: BAD_CREDENTIALS → “Email or password is incorrect.”

Redirect: CLIENT → /portal; ADMIN → /admin

Accessibility: focus first field; aria-live errors

/accept-invite

Purpose: invited client sets name & password; consents to Terms/Privacy

Fields: first/last name*, password*, confirm*, consent checkbox*

Errors: token expired/used → explain and offer “Resend invite” flow

Success: auto-login → /portal

/portal — Dashboard

Purpose: quick overview & shortcuts

Sections:

“My cases” (up to 3; link to all)

Upcoming appointment (next one)

Recent documents/messages

Empty states: no cases → “Your lawyer will add a case soon.”

Loading: skeleton cards

/portal/cases

Purpose: list client’s cases

Columns: title, status, updatedAt

Sort: updatedAt desc

Empty state: “No cases yet.”

/portal/cases/:id — Case Overview

Purpose: one-glance status and recent activity

Blocks: status pill, case number (if any), last updated; last 2 docs; last 2 messages; next appointment

Actions: go to Documents, Messages, Appointments, Invoices

/portal/cases/:id/documents

Purpose: download case files

Table: file name, type, uploaded date, action (download)

Decision: Client uploads allowed? [TODO yes/no]

If yes: allowed types, max size, virus scan note, success toast

Empty state: “No documents yet.”

/portal/cases/:id/messages

Purpose: secure thread with admin

Composer: textarea, send button; max [TODO] chars

List: messages oldest→newest or newest→oldest (pick one)

Error handling: send fail → retry control; rate limit message

Microcopy: “Replies typically within 1 business day.”

/portal/cases/:id/appointments

Purpose: list confirmed appointments + Request appointment

List columns: date/time (Europe/Sofia), location, notes

CTA: “Request appointment” → modal with fields: type, mode, notes, 2–3 preferred windows

Request status badges: PENDING / PROPOSED / APPROVED / DECLINED / CANCELED

Empty state: “No appointments yet.”

/portal/cases/:id/invoices

Purpose: see invoices

Columns: issuedAt, dueDate, amount, status

Action: Pay (if enabled in future)

/portal/profile

Purpose: view/update contact info; change password

Validation: confirm current password on change