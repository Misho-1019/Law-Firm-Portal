H1) Map UX → API (traceability)


Login (/login page) → POST /auth/login

Accept invite (/accept-invite) → POST /auth/invite/redeem

Contact form submit (/contact) → POST /intake

Admin convert intake (/admin/intake) → POST /intake/:id/convert

Client: My cases (/portal/cases) → GET /cases

Case overview (/portal/cases/:id) → GET /cases/:id

Docs list / download → GET /cases/:id/documents

Docs upload (admin) → POST /cases/:id/documents/presign (+ client uploads to S3 URL)

Messages list → GET /cases/:id/messages?cursor&limit

Send message → POST /cases/:id/messages

Appointments list → GET /cases/:id/appointments

Admin create appt → POST /cases/:id/appointments

Client request appt → POST /cases/:id/appointment-requests

Admin approve/propose/decline → POST /appointment-requests/:id/(approve|propose|decline)

Client cancel/accept → POST /appointment-requests/:id/(cancel|accept)

Invoices list → GET /cases/:id/invoices

Admin create invoice → POST /cases/:id/invoices

(Later) Pay invoice → POST /invoices/:id/pay

Admin availability → GET/PATCH /admin/availability

H2) Finalize request/response shapes


Method & path

Role (ADMIN/CLIENT/public)

Request body fields (names + types)

Response shape

Errors (codes you’ll use)

Standard error codes (use consistently):

BAD_CREDENTIALS, UNAUTHORIZED, FORBIDDEN, NOT_FOUND

VALIDATION_ERROR, RATE_LIMITED, CONFLICT, TOKEN_EXPIRED, TOKEN_USED

H3) RBAC checklist

For each endpoint, add a quick RBAC sentence:

GET /cases — CLIENT: own only; ADMIN: all (filters allowed)

GET /cases/:id — owner client or ADMIN

documents/messages/appointments/invoices — same case-membership rule

Appointment Requests — CLIENT: own requests; ADMIN: all

Add “server enforces” note to avoid relying on hidden UI.

H4) Rate-limit decisions (lock numbers)

Pick numbers and write them down:

/auth/login: 5/min/IP

/auth/forgot: 3/hour/IP

Messages: 30/min/user

Presign uploads: 10/min/user (+ size limit note)

Appointment Requests: 3/day/user

H5) Notifications (events → emails)

List the events + recipient:

Intake created → Admin

New client message → Admin

New admin message → Client

Appt Request state changes → Client

Invoice sent → Client; Payment received → Admin
Add the “no sensitive content in email body” rule + .ics attached on approval.