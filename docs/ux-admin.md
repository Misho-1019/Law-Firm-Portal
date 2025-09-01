/admin — Dashboard

Purpose: situational awareness

Widgets: active cases, pending intakes, upcoming 7-day appointments, unpaid invoices count/sum

Empty/Loading: skeletons; zero states with guidance

/admin/intake

Purpose: triage new leads

Columns: name, email, matter type, receivedAt, status

Row actions: Convert (creates Client + Case + Invite), Dismiss

Convert modal fields: case title*, practice area (select), notes (opt)

/admin/cases

Purpose: manage all cases

Filters: status, practice area, text search (title/client)

Columns: title, client, status, updatedAt

Actions: open case, create new case

/admin/cases/:id — Case Detail (tabs)

Tabs: Overview | Documents | Messages | Appointments | Billing

Overview: status, case number, timeline (created, last doc, last message)

Documents: upload/download; version info; delete (with confirm)

Messages: same thread view as client (admin side)

Appointments: list/calendar; create/edit; conflict warnings

Billing: invoices list; create invoice (amount, currency, due date)

/admin/appointments

Purpose: global calendar/list of confirmed appointments

Views: week/month; timezone display note; filters by case/client

/admin/appointments/requests

Purpose: process client requests

Columns: case, client, submittedAt, type/mode, status

Row actions: Approve (choose start/end/location), Propose alternatives (≤3), Decline (reason)

Conflicts: warn/block overlaps with buffer

/admin/invoices

Purpose: billing overview

Filters: status (DRAFT/SENT/PAID/OVERDUE), due window

Columns: case, issuedAt, dueDate, amount, status

Action: Create invoice

/admin/clients

Purpose: manage clients

Columns: name, email, cases#, createdAt

Actions: Invite client (email), open profile

/admin/settings → Availability

Purpose: working hours & scheduling rules

Fields: weekday ranges, slot minutes, buffer minutes, blackout dates

Action: Save → confirmation toast