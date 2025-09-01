Public site (no login)

/ — Home

Blocks: Hero (CTA), Practice areas ([TODO: list 3–5]), Bio snippet, Testimonials (optional), Contact CTA

/contact — Intake form

Fields: full name, email, phone (opt), matter type, message, consent checkbox

Success state: Thank-you screen + email notice to admin

/privacy — Privacy Policy (GDPR)

/terms — Terms of Use

/cookies — Cookie Policy (+ banner details)

/imprint (optional, EU style)

Shared auth routes

/login — one page for both roles (ADMIN/CLIENT)

/accept-invite — invite link lands here (client onboarding)

/forgot-password, /reset-password — recovery flow

(No public /register — invite-only)

Client Portal (login required)

/portal — Dashboard: recent case updates, quick links

/portal/cases — My cases list (title, status, updatedAt)

/portal/cases/:caseId — Case overview (status, key dates, last messages)

/portal/cases/:caseId/documents — Document list (download; [TODO: allow client upload? yes/no])

/portal/cases/:caseId/messages — Secure thread with admin

/portal/cases/:caseId/appointments — Upcoming/past + Request appointment

/portal/cases/:caseId/invoices — Invoices list (view; pay link later)

/portal/profile — Contact info, password

/portal/requests (optional) — All my appointment requests

Admin Dashboard (login required; ADMIN only)

/admin — KPIs: active cases, pending intakes, unpaid invoices, upcoming appointments

/admin/intake — Intakes list → Convert to Client + Case + Send Invite

/admin/cases — All cases (filters: status, practice area, client)

/admin/cases/:caseId — Case detail with tabs:

Overview (status, timeline)

Documents (upload/download, versions)

Messages (thread)

Appointments (list/calendar)

Billing (invoices & payments)

/admin/appointments — Calendar/list of confirmed appointments

/admin/appointments/requests — Requests inbox (approve/propose/decline)

/admin/invoices — All invoices (filters: status, due date)

/admin/clients — Client list + profiles

/admin/settings — Firm details, email templates, availability

Notes & decisions

Practice areas to show on Home: [TODO]

Languages displayed (BG/EN): [TODO: start with EN only?]

Map/office address on Home: [TODO yes/no]

Client uploads allowed: [TODO yes/no]