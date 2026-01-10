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
- Admin dashboard with recent activity
- Appointment creation, editing, and status management
- Weekly working schedule configuration
- Time-off and unavailability management
- Public availability sharing via link
- Role-based access control

### Client
- Book appointments through a shared availability link
- Simple and guided booking flow
- View appointment details

### Automation
- Cron-based reminder jobs
- Time-zone aware scheduling logic
- Defensive validation on frontend and backend

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

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Router

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication

---

## ▶️ Running Locally

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

---

## 👤 Author Note

Built with a production mindset, focusing on security, scalability, and realistic business workflows.
