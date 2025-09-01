Post-login redirects

If role = ADMIN ⇒ /admin

If role = CLIENT ⇒ /portal

Logout ⇒ back to /login

Menu visibility (matrix)
Area / Link	CLIENT sees	ADMIN sees
Home /	✔️	✔️
Contact /contact	✔️	✔️
Login /login	✔️	✔️
Invite accept /accept-invite	✔️	—
Portal /portal	✔️	—
My Cases /portal/cases	✔️	—
Case → Documents/Messages/etc.	✔️	—
Admin /admin	—	✔️
Admin → Intake/Cases/Requests/etc.	—	✔️
Settings /admin/settings	—	✔️
Guardrails (server-side)

Every API endpoint enforces ADMIN vs CLIENT rights.

Case data is only visible to the case’s client or to admin.

Appointment Requests: CLIENT can only operate on own case; ADMIN can operate on all.

Legal & consent (public)

Show cookie banner on first visit.

Intake form requires Privacy/Terms consent checkbox.

Registration is invite-only, no public /register.

Acceptance checklist for “2) point”

 ia-sitemap.md filled (routes + page purposes + decisions)

 appointment-requests.md filled (states, rules, availability)

 nav-auth.md filled (redirects + visibility matrix)

 Any open TODOs clearly marked (we can resolve them next step)