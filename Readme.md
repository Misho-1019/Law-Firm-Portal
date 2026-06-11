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
- Public availability sharing via link
- Role-based access control

### Client
- Book appointments through a shared availability link
- Simple and guided booking flow
- View and reschedule own appointments
- Password reset via email ("Forgot Password" flow)

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

**Backend**
- Node.js (ES modules)
- Express 5
- MongoDB + Mongoose 8
- JWT Authentication (jsonwebtoken + bcrypt)
- express-validator (input validation)
- express-rate-limit
- helmet (security headers)
- node-cron + Cloud Scheduler (reminders)
- Nodemailer (email via Gmail SMTP)
- Luxon (DST-safe scheduling)

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

## ▶️ Running Locally

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

---

## 👤 Author Note

Built with a production mindset, focusing on security, scalability, and realistic business workflows.
