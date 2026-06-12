# ⚖️ Lawyer Schedule 2025  
### Full-Stack Appointment & Availability Management System

A production-oriented full-stack web application designed to manage **appointments, availability, time-off, and client bookings** for law firms.

This project focuses on **real-world business logic**, secure authentication, role-based access, and scalable architecture — not just UI demos.

---

## 🎯 Project Purpose

Law firms often rely on manual processes such as phone calls, emails, and spreadsheets to manage appointments.

**Lawyer Schedule 2025** replaces this workflow with a centralized system that allows lawyers to:

- define their availability once
- share a booking link with clients
- manage time-off and exceptions
- reduce scheduling conflicts and back-and-forth communication

The project was built to simulate **production-level requirements**, making it suitable as both a foundation for real use and a strong portfolio project.

---

## 🚀 Core Features

### Admin (Lawyer / Office)
- Admin dashboard with recent activity and quick actions
- Appointment creation, editing, and status management
- Calendar view with month and week layouts
- Client search by name on the appointments catalog
- Service-type dropdown (Consultation, Contract Review, Court Hearing, Notary, etc.)
- Weekly working schedule editor (load, modify, and save intervals)
- Time-off and unavailability management (full-day and partial-day blocks)
- BI dashboard with appointment stats, service breakdown, and 7-day trend
- Multi-lawyer support — assign appointments to specific lawyers
- Public availability sharing via link
- Role-based access control

### Client
- Book appointments through a shared availability link
- Simple and guided booking flow
- View, reschedule, and cancel own appointments with confirmation modal
- Appointment history with upcoming / past toggle
- Password reset via email ("Forgot Password" flow)
- Email notification preference toggle on Profile page

### Automation & Robustness
- Cron-based reminder jobs (24h and 1h before appointment)
- Parallel batch processing for reminder emails
- Time-zone aware scheduling logic (Europe/Sofia with DST)
- Defensive validation on frontend (Yup) and backend (express-validator)
- React Error Boundary — graceful crash recovery
- Request timeouts (10s) — hung API calls don't freeze the UI
- Loading skeletons for all list and detail views
- Empty states with helpful messages and CTAs
- Structured JSON logging for Cloud Run & observability
- TypeScript models for type safety
- Code splitting and server-side pagination
- Sentry error tracking (client + server)
- 9 unit tests for availability logic

### Security
- Password reset flow with time-limited email tokens
- Separate rate limiter for auth endpoints (10 req / 15 min)
- JWT tokens with 7-day expiry and token-based session revocation
- Ownership checks — clients cannot view others' appointments
- Input validation on all endpoints
- HTTP-only cookie + Bearer token dual auth channels

---

## 🖥️ Screenshots (Recommended Order)

### 1️⃣ Admin Dashboard
![Admin Dashboard](views/Screenshot%202026-01-10%20020927.png)

### 2️⃣ Appointments Management
![Appointments](views/Screenshot%202026-01-10%20021214.png)

### 3️⃣ Appointment Details
![Appointment Details](views/Screenshot%202026-01-10%20021315.png)

### 4️⃣ Availability & Share Link
![Share Availability](views/Screenshot%202026-01-10%20021415.png)

### 5️⃣ Time-Off Management
![Time Off](views/Screenshot%202026-01-10%20021604.png)
![Time Off](views/Screenshot%202026-01-10%20021637.png)

### 6️⃣ Client Booking Flow
![Client Booking](views/Screenshot%202026-01-10%20021831.png)
![Client Booking](views/Screenshot%202026-01-10%20021725.png)

### 7️⃣ Schedule Editor (NEW)
> Screenshot: Working schedule editor with active days, time intervals, and save functionality.

### 8️⃣ Password Reset (NEW)
> Screenshot: Forgot password email form and reset password page.

### 9️⃣ Client Search (NEW)
> Screenshot: Appointments catalog with client name search bar.

### 🔟 Loading Skeleton States (NEW)
> Screenshot: Skeleton placeholders during data loading on any page.

### 1️⃣1️⃣ BI Dashboard (NEW)
> Screenshot: Appointment stats and service-type breakdown on the admin dashboard.

### 1️⃣2️⃣ Client History & Cancel Modal (NEW)
> Screenshot: Client dashboard with upcoming/history tabs and cancel confirmation modal.

### 1️⃣3️⃣ Email Notification Toggle (NEW)
> Screenshot: Email notification preference toggle on the Profile page.

---

## 🌐 Live Demo

- **Frontend:** https://law-firm-portal.web.app  
- **Backend API:** Deployed on Google Cloud Run

> ⚠️ Note:  
> This is a portfolio deployment.  
> Some features (such as email delivery and background jobs) may be limited or disabled.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 (Vite 7)
- Tailwind CSS 3
- Framer Motion
- React Router v7
- React Hook Form + Yup (validation)
- Luxon (timezone-aware date handling)
- Lucide React (icons)
- React Toastify
- Sentry (error tracking)

**Backend**
- Node.js (ES modules with TypeScript via tsx)
- Express 5
- MongoDB + Mongoose 8
- JWT Authentication (jsonwebtoken + bcrypt)
- express-validator (input validation)
- express-rate-limit
- helmet (security headers)
- node-cron + Cloud Scheduler (reminders)
- Nodemailer (email via Gmail SMTP)
- Luxon (DST-safe scheduling)
- @sentry/node (error tracking)
- vitest + supertest (testing)

---

## 🏗️ Architecture Overview

The application follows a clear client–server architecture:
- The frontend handles UI, state management, and user interactions.
- The backend exposes a REST API responsible for authentication, scheduling logic, validation, and persistence.
- Business logic (appointments, availability, time-off) is centralized on the server to ensure consistency and security.
- Background jobs are used for reminders and scheduled tasks.
- All server logs are structured JSON — compatible with Cloud Run / Cloud Logging for filtering and alerting.
- A health-check endpoint (`GET /health`) reports database connectivity status for monitoring.
- Request timeouts (10s) and MongoDB reconnection handlers prevent silent failures.
- React Error Boundary catches render crashes and displays a recovery screen.

---

## 🔒 Security Considerations

- JWT-based authentication using HTTP-only cookies
- Role-based authorization enforced at middleware level
- Ownership verification — clients can only access their own appointments
- CORS allowlists for trusted client origins
- Rate limiting: global (100 req / 15 min) + strict auth limiter (10 req / 15 min)
- Password-reset flow with time-limited (1h) cryptographic tokens
- JWT token versioning — all sessions invalidated on password change
- Security headers via helmet
- Environment-variable validation on startup — fails fast if secrets are missing
- Request body size limit (1 MB)

---

## 📋 Changelog

### v1.1 — June 2026 (Milestones 1–9)

**Critical Bug Fixes**
- Mailer module no longer crashes the server on startup when credentials are missing
- Date/time formatting in email subjects now shows correct dates instead of garbled text
- Registration now auto-logs in the user — no more manual re-login after sign-up

**UX Improvements**
- Loading skeletons replace text-based "Loading..." across all list and detail views
- Empty states with helpful messages and CTAs on catalog, dashboard, and schedules
- Appointment catalog now has client name search with 300ms debounce
- Service field is now a predefined dropdown instead of free text
- Weekly schedule calendar is scrollable on mobile with snap behavior
- Logout flow is smooth — no more white-screen flash or cancelled network requests

**Security**
- Password reset flow — forgot-password link sends time-limited email token
- Separate strict rate limiter for auth endpoints (10 req / 15 min)
- JWT tokens extended from 2 hours to 7 days with token-version revocation
- Ownership check on appointment detail endpoint — clients can't peek at others' bookings
- Duplicate username check during registration with friendly error message

**New Features**
- Schedule Editor — full CRUD for weekly working hours (was UI-only mockup)
- Duplicate middleware removed — admin routes no longer run auth checks twice
- Registration now validates firstName, lastName, and phone fields
- Default working hours now use configurable constants (WORK\_START / WORK\_END)

**Robustness**
- React Error Boundary — renders "Reload page" screen instead of white crash
- All fetch requests have 10-second timeout — hung API calls don't freeze the UI
- MongoDB connection event handlers (disconnect, error, reconnect) with auto-recovery
- Health-check endpoint (`GET /health`) returns database status
- Environment variable validation on startup — missing secrets fail fast
- Request body size limit (1 MB) on all endpoints
- Cron reminder processing handles backlogs with parallel batching
- Structured JSON logging throughout the server (mailer, reminders, connection events)

**Code Quality**
- Password validation rules aligned between client and server
- Unused imports removed (validators)
- Stale `creatorId` parameter removed from appointment creation
- Comma-operator pattern in `useAppointment` replaced with standard block syntax
- Fixed-position date slicing replaced with Luxon-based parsing

---

### v1.2 — June 2026 (Milestones 10–21)

**New Features**
- Multi-lawyer support — per-lawyer schedules, bookings, and filtering
- Client appointment history tab with upcoming/past switching
- Cancel appointment modal with required reason
- Email notification preference toggle on Profile page
- BI dashboard with appointment stats, service breakdown, and 7-day trend
- Sentry error tracking on both client and server
- Configurable firm name via Settings model

**Performance**
- Code splitting with React.lazy — each page is a separate chunk
- Server-side pagination on appointments catalog
- Calendar month view batched from 90 queries to 3

**Robustness**
- Centralized config module replacing scattered process.env reads
- 9 unit tests for availability slot computation
- TypeScript migration for all models and config
- Structured JSON logging throughout the server

**UX Improvements**
- Loading skeletons replacing text-based loading states in 8 components
- Getting-started onboarding banner on admin dashboard
- Confirmation modal replacing window.confirm on delete
- Branded professional HTML templates for all 7 email types
- Friendly date format in all emails ("Thu, 2026-06-12 at 14:00")
- Sort preference persisted in localStorage
- Server-side sorting applies to all pages, not just current page
- Accessibility labels on icon-only buttons

**Bug Fixes**
- CORS fix for production CLIENT_URL parsing
- Upcoming appointment card no longer affected by table sort
- Cancel button navigates to confirmation modal instead of non-existent route
- Missing todayAppts / goPrevDay / goNextDay / allFreeSlots variables added
- tsx moved to production dependencies for Cloud Run deployment
- Scheduler URL corrected with /api prefix for reminder jobs

---

## ▶️ Running Locally

```bash
cd server && npm install && npm run dev    # Express API on port 3000 (tsx)
cd client && npm install && npm run dev    # Vite dev server on port 5173
```

```bash
cd server && npm test                       # Run 9 unit tests (vitest)
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `SECRET_KEY` | Yes | — | JWT signing secret |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment (`production` enables secure cookies) |
| `CLIENT_URLS` | No | — | Comma-separated CORS origins |
| `GMAIL_USER` | No | — | Gmail address for email sending |
| `GMAIL_APP_PASS` | No | — | Gmail app password |
| `ADMIN_EMAIL` | No | — | Admin notification email recipient |
| `EMAILS_DISABLED` | No | `0` | Disable all email sending (`1` to disable) |
| `FIRM_NAME` | No | `LexSchedule` | Firm name shown in email from field |
| `REMINDERS_DISABLED` | No | `0` | Disable cron reminders (`1` to disable) |
| `REMINDER_BATCH_LIMIT` | No | `100` | Max reminders per batch |
| `USE_INTERNAL_CRON` | No | `false` | Use node-cron (dev) vs Cloud Scheduler (prod) |
| `CRON_SECRET` | No | — | Shared secret for Cloud Scheduler requests |
| `COOKIE_SECURE` | No | `isProd` | Require HTTPS for cookies |
| `COOKIE_SAMESITE` | No | `lax` | Cookie SameSite policy |
| `SENTRY_DSN` | No | — | Sentry DSN for server error tracking |

### Client (`client/.env` / `.env.production`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | — | API base URL (e.g. `http://localhost:3000/api` or `/api`) |
| `VITE_SENTRY_DSN` | No | — | Sentry DSN for client error tracking |

---

## 👤 Author Note

Built with a production mindset, focusing on security, scalability, and realistic business workflows.
