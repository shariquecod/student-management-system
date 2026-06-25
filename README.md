# Apex Valley Academy — Student Admin Portal

Production-ready student administration management web application built with Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit, and shadcn/ui.

## Features

- **Authentication** — Admin login with email/password, remember me, route protection via middleware
- **Dashboard** — Bento grid layout with animated stats, enrollment trends, recent activity
- **Students** — Search, filter, paginate, CRUD with guardian details
- **Teachers** — Faculty management with archive support
- **Classes** — Class roster, teacher assignment, timetable views
- **Attendance** — Daily recording and historical summaries
- **Exams & Results** — Exam definitions, marks entry, printable result summaries
- **Fees & Payments** — Balance tracking, overdue highlights, payment recording
- **Settings** — School profile, academic year, user management

## Tech Stack

- Next.js 15 · React 19 · TypeScript
- Tailwind CSS · shadcn/ui · Recharts
- Redux Toolkit · react-hook-form · Zod
- Mock REST APIs via Next.js route handlers (Option 2)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@school.edu | admin123 | Super Admin |
| staff@school.edu | staff123 | Staff |

## Verification

```bash
npx tsx scripts/verify-mock-store.ts
npx tsx scripts/verify-api.ts
npm run build
```

## Architecture

```
Pages → services/school-api.ts → app/api/* → lib/mock-store
```

Swap mock API handlers for real database logic later without changing page components.
