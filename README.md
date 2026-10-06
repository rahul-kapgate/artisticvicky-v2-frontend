# AV Art Academy — Frontend

> A modern EdTech learning experience for MAH AAC CET preparation, bringing courses, resources, video lectures, mock tests, PYQs, and student learning flows into one responsive web application.

AV Art Academy is the frontend application for the **Artistic Vicky / AV Art Academy** platform. It is built with **React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, and React Router**, and connects to a separate Node.js/Express backend for authentication, course content, enrollments, payments, resources, and student progress.

**Live Website:** https://artisticvickey.in/  
**Frontend Repository:** https://github.com/rahul-kapgate/artisticvicky-v2-frontend  
**Backend Repository:** https://github.com/rahul-kapgate/artisticvicky-v2-backend

---

## Overview

The platform is designed for students preparing for **MAH AAC CET** and similar art entrance examinations.

Instead of spreading lectures, study resources, mock tests, PYQs, enrollment information, and student activity across multiple tools, AV Art Academy brings them together into a single learning experience.

The frontend focuses on:

- Course discovery
- Course details and enrollment flows
- Student learning experience
- Video lectures
- Resources and study material
- Mock tests
- Previous year question practice
- Profile and account management
- Responsive desktop and mobile experience
- Admin-facing management screens

---

# Features

## Student Experience

- Browse available courses
- View detailed course information
- Access enrolled learning content
- Watch video lectures
- Download/view study resources
- Practice mock tests
- Practice previous year questions
- Track learning activity
- Manage profile information
- Responsive navigation across desktop and mobile

## Course Experience

Course pages are designed to present structured information such as:

- Course title
- Description
- Pricing
- Access information
- Course resources
- Recorded lectures
- Practice content
- Enrollment state

The UI is designed to clearly separate public course discovery from content available to enrolled students.

## Mock Tests

The platform includes exam-style mock test flows with features such as:

- Timed attempts
- Question navigation
- Answer selection
- Submit confirmation
- Leave-test confirmation
- Tab-switch awareness
- Attempt review
- Answer review

## Previous Year Questions

Students can use PYQ practice flows to:

- Access previous exam questions
- Attempt questions
- Review responses
- Use PYQs as part of structured revision

## Video Learning

The application supports a video-focused learning experience for recorded lectures and course content.

The frontend is responsible for:

- Video listing
- Course-specific video access
- Responsive playback experience
- Authenticated access flows

## Resources

Study material can be organized into course resources such as:

- Notes
- PDFs
- eBooks
- Practice material
- Downloadable learning files

The frontend includes PDF-oriented dependencies for in-browser document viewing.

## Authentication

The frontend integrates with the backend authentication system for:

- Signup
- Email verification / OTP flows
- Login
- Session handling
- Protected routes
- Logout
- User profile access

## Payments & Enrollment

The application is designed to work with backend payment and enrollment flows.

Typical flow:

```text
Student
   │
   ▼
Select Course
   │
   ▼
View Course Details
   │
   ▼
Start Enrollment
   │
   ▼
Payment Flow
   │
   ▼
Backend Verification
   │
   ▼
Enrollment Activated
   │
   ▼
Course Content Available
```

## Admin Experience

The wider platform includes administration workflows for areas such as:

- Dashboard
- Courses
- Users
- Enrollments
- Reports
- Resources
- Videos
- Artwork
- Invoices
- Notifications

---

# Tech Stack

## Core

| Technology | Purpose |
| --- | --- |
| React 19 | Component-based UI |
| TypeScript | Type-safe application development |
| Vite 7 | Development server and production build |
| React Router | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |

## Data & API

| Technology | Purpose |
| --- | --- |
| TanStack Query | Server-state fetching, caching, and mutations |
| Axios | API communication |
| TanStack Query Devtools | Development/debugging for server state |

## UI & Experience

| Technology | Purpose |
| --- | --- |
| Radix UI | Accessible UI primitives |
| shadcn-style component setup | Reusable application UI |
| Framer Motion | Motion and transitions |
| Lucide React | Icons |
| React Icons | Additional icons |
| Sonner | Toast notifications |
| next-themes | Theme handling |
| CVA | Component variant management |
| clsx | Conditional class composition |
| tailwind-merge | Tailwind class merging |

## Documents

| Technology | Purpose |
| --- | --- |
| react-pdf | PDF rendering |
| pdfjs-dist | PDF processing |

The current frontend dependency set is defined in the repository's `package.json`.

---

# Frontend Architecture

```text
┌──────────────────────────────────────────┐
│                Browser                   │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│          React + Vite Frontend           │
│                                          │
│ Pages                                    │
│ Components                               │
│ Routing                                  │
│ Forms                                    │
│ Course UI                                │
│ Mock Test UI                             │
│ Resource / PDF UI                        │
└─────────────────────┬────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌───────────────────┐    ┌───────────────────┐
│ TanStack Query    │    │ Client UI State   │
│ Server State      │    │ Components/Theme  │
└─────────┬─────────┘    └───────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│                 Axios                    │
│              API Client                  │
└─────────────────────┬────────────────────┘
                      │
                      │ HTTPS / JSON
                      ▼
┌──────────────────────────────────────────┐
│       AV Art Academy Backend API         │
│                                          │
│ Node.js + Express                        │
│ Auth                                     │
│ Courses                                  │
│ Enrollments                              │
│ Resources                                │
│ Videos                                   │
│ Mock Tests                               │
│ Payments                                 │
└──────────────────────────────────────────┘
```

---

# Application Flow

```text
Visitor
  │
  ├── Home
  ├── Courses
  ├── Course Details
  └── Authentication
          │
          ▼
     Logged-in User
          │
          ├── Profile
          ├── Enrollments
          ├── Resources
          ├── Videos
          ├── Mock Tests
          └── PYQ Practice
```

The application keeps UI concerns on the frontend while server-owned data is fetched and updated through the backend API.

---

# Project Structure

A typical high-level structure for this repository is:

```text
artisticvicky-v2-frontend/
│
├── public/                 # Public/static assets
│
├── src/
│   ├── assets/             # Images and local assets
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application screens/routes
│   ├── hooks/              # Reusable hooks
│   ├── services/           # API communication
│   ├── lib/                # Utilities/helpers
│   ├── types/              # TypeScript types
│   └── ...
│
├── components.json         # UI component configuration
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

> The exact internal structure can evolve as new modules are added.

---

# Server-State Strategy

TanStack Query is used for data that belongs to the backend.

Examples include:

- Current user
- Courses
- Enrollments
- Resources
- Videos
- Mock test data
- PYQ data
- Admin-managed content

A typical flow is:

```text
Component
   │
   ▼
Query / Mutation
   │
   ▼
Axios API Request
   │
   ▼
Backend
   │
   ▼
Cache Update / Refetch
   │
   ▼
UI
```

This keeps API data out of unnecessary global client state and provides a consistent pattern for:

- Loading states
- Error states
- Request caching
- Mutations
- Refetching
- Cache invalidation

---

# Local Development

## Prerequisites

Make sure you have:

- Node.js 18+
- npm
- Git
- Access to a running AV Art Academy backend

---

## 1. Clone the Repository

```bash
git clone https://github.com/rahul-kapgate/artisticvicky-v2-frontend.git
cd artisticvicky-v2-frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment

Create the local environment file expected by the application and configure the frontend API base URL required by the project's API client.

Example:

```env
VITE_API_URL=http://localhost:5000
```

> Use the environment variable name currently referenced by the API client if it differs from the example above. Never place private backend secrets inside a Vite environment variable because `VITE_*` values are exposed to the browser.

---

## 4. Start Development Server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

A common local URL is:

```text
http://localhost:5173
```

---

# Available Scripts

## Development

```bash
npm run dev
```

Starts the Vite development server.

## Production Build

```bash
npm run build
```

Runs TypeScript build validation and creates the optimized Vite production bundle.

## Lint

```bash
npm run lint
```

Runs ESLint.

## Preview

```bash
npm run preview
```

Previews the production build locally.

---

# Production Build

Create the production bundle with:

```bash
npm run build
```

The generated frontend can then be deployed to a static/web hosting platform.

Before deployment, make sure:

- Production backend URL is configured
- CORS allows the deployed frontend origin
- Authentication cookies/tokens use production-safe settings
- Payment callbacks use the correct production environment
- All frontend URLs use HTTPS

---

# Backend Integration

This repository is the frontend half of the AV Art Academy platform.

Backend repository:

https://github.com/rahul-kapgate/artisticvicky-v2-backend

The backend is responsible for application concerns such as:

```text
Authentication
Courses
Users
Enrollments
Resources
Videos
Mock Tests
PYQs
Payments
File Handling
Emails
Invoices / PDFs
Admin APIs
```

The frontend should never contain private credentials for backend integrations.

---

# Key Engineering Decisions

## React + Vite

Vite keeps local development fast and produces a lightweight production build while React provides the component architecture for a multi-screen learning platform.

## TypeScript

TypeScript helps keep API models, forms, page props, and component contracts predictable as the application grows.

## TanStack Query

Backend data is managed as server state instead of duplicating it across custom stores.

This makes fetching and mutation flows easier to reason about.

## Tailwind CSS

Tailwind keeps responsive layouts and application styling colocated with UI components while still supporting a consistent design system.

## React Router

The platform contains multiple public, authenticated, student, and administrative screens, making client-side routing a core part of the frontend architecture.

## PDF Rendering

Course resources can include PDF material, so the frontend includes `react-pdf` and `pdfjs-dist` for document-oriented learning experiences.

---

# Security Notes

Frontend security practices include:

- Avoid storing private secrets in client-side environment variables
- Use HTTPS in production
- Keep authentication state synchronized with backend rules
- Do not trust frontend authorization alone
- Validate access to paid/enrolled content on the backend
- Sanitize or safely render external content
- Keep dependencies updated

Authorization for courses, resources, payments, and administrative actions must always be enforced by the backend.

---

# Future Improvements

Potential frontend improvements include:

1. More detailed student progress analytics
2. Course completion tracking
3. Bookmarking/favorites
4. Better revision planning
5. Offline/PWA support
6. Push notifications
7. Improved accessibility audits
8. Automated frontend tests
9. End-to-end testing with Playwright
10. Improved bundle splitting
11. Image optimization
12. More granular admin permissions
13. Enhanced mock-test analytics
14. Personalized study recommendations
15. Better mobile exam experience

---

# Related Repository

### Backend

https://github.com/rahul-kapgate/artisticvicky-v2-backend

The backend handles authentication, APIs, database access, storage, payments, email, and server-side business logic.

---

# Author

**Rahul Kapgate**

GitHub: https://github.com/rahul-kapgate  
Portfolio: https://rahulkapgate.in  
Live Platform: https://artisticvickey.in/

---

If you find the project useful, consider giving the repository a ⭐.
