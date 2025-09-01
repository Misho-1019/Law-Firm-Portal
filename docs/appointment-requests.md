States

PENDING → (PROPOSED) → APPROVED / DECLINED / CANCELED

Client flow

From Case → Appointments click Request appointment.

Provide:

Type: Consultation / Update / Review / [TODO: custom?]

Mode: In-person / Online

Notes: [optional]

Preferred slots (2–3): start/end in local time (stored as UTC)

Submit ⇒ status PENDING; visible on the case’s Appointments page.

Admin flow

/admin/appointments/requests shows pending items (filters by case/client/date).

Actions per request:

Approve → choose exact start/end/location → creates Appointment + status APPROVED

Propose alternatives (up to 3 slots) → status PROPOSED

Decline with short reason → status DECLINED

Client can accept one proposal or cancel a pending request.

Scheduling rules

Store all times UTC, display Europe/Sofia.

Conflict check against existing Appointments + buffer minutes of [TODO: e.g., 15].

One open request per case per client (prevent spam).

Auto-expire PENDING/PROPOSED after [TODO: e.g., 7 days].

Notifications

New request → email admin (link only; no sensitive details).

Approve/Propose/Decline/Cancel → email client.

On approval, send .ics invite with summary/location.

Availability (admin)

Working hours by weekday: [TODO: e.g., Mon–Fri 09:00–12:00, 13:00–17:00]

Slot duration: [TODO: e.g., 30 min]

Buffer: [TODO: e.g., 15 min]

Blackout dates/holidays: [TODO list]