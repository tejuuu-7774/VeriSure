````md
# VeriSure
VeriSure is a full-stack background verification platform designed to manage candidate identity verification workflows in a secure and structured environment.

The platform enables evaluators or HR teams to create candidate profiles, perform Aadhaar and PAN verification checks, track verification status, maintain verification logs, and generate downloadable PDF verification reports.

---

## Live Demo

**Frontend URL:**  
`https://veri-sure-gamma.vercel.app/`

**Backend API URL:**  
`https://verisure-backend.onrender.com`

---

## Repository

**GitHub Repository:**  
`https://github.com/tejuuu-7774/VeriSure.git`

---

## Project Overview

VeriSure provides an end-to-end verification workflow for candidate onboarding and compliance checks.

The system allows users to:

* Register and authenticate securely
* Create and manage candidate profiles
* Perform Aadhaar and PAN verification
* Track verification logs and candidate status
* View verification timelines
* Generate downloadable PDF reports
* Monitor operational metrics through a dashboard

---

## Features

### Authentication

* Secure user registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes and APIs

### Candidate Management

* Create candidate profiles
* Update candidate details
* Delete candidate records
* View candidate information

### Verification Workflow

* Aadhaar verification simulation
* PAN verification simulation
* Verification status tracking

Candidate statuses:

* `PENDING`
* `VERIFIED`
* `FAILED`
* `PARTIAL`

### Verification Logs

* Stores verification history
* Maintains timestamps
* Displays verification timeline

### Reports

* Professional verification report preview
* PDF report download
* Masked sensitive information in reports

### Dashboard

* Total candidates
* Verified candidates
* Failed verifications
* Pending verifications
* Partial verifications
* Recent activity tracking

### Demo Workspace

* Seed demo candidate data
* Reset workspace for fresh testing

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* React Hook Form
* Zod
* Axios
* Sonner
* Lucide React

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* JWT Authentication
* bcrypt

### Database

* PostgreSQL (Neon)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## System Architecture

```txt
Client (Next.js - Port 3000)
            │
            ▼
REST API (Express.js - Port 3001)
            │
            ▼
Prisma ORM
            │
            ▼
PostgreSQL Database (Neon)
```

---
### Database Relationships

#### User

Stores authenticated platform users.

Fields:

* id
* name
* email
* password
* createdAt

#### Candidate

Stores candidate information.

Fields:

* id
* fullName
* email
* phone
* aadhaarNumber
* panNumber
* dob
* address
* verificationStatus
* createdById
* createdAt

#### VerificationLog

Stores Aadhaar and PAN verification results.

Fields:

* id
* verificationType
* verificationStatus
* requestPayload
* responsePayload
* verifiedAt
* candidateId

---

## Verification Flow

```txt
Create Candidate
        │
        ▼
Start Aadhaar & PAN Verification
        │
        ▼
Verification Logs Stored
        │
        ▼
Candidate Status Updated
        │
        ▼
Generate Verification Report
        │
        ▼
Download PDF Report
```

---

## Folder Structure

```txt
VeriSure/
│
├── client/                         # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── services/
│   │   ├── lib/
│   │   └── types/
│
├── server/                         # Backend (Express + Prisma)
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validations/
│   │   └── utils/
│
└── README.md
```

---

## Local Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd VeriSure
```

---

### 2. Setup Backend

Navigate to server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
PORT=3001
CLIENT_URL=http://localhost:3000
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:3001
```

---

### 3. Setup Frontend

Navigate to client:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

### Candidates

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| GET    | `/api/candidates`     | Get all candidates |
| GET    | `/api/candidates/:id` | Get candidate      |
| POST   | `/api/candidates`     | Create candidate   |
| PUT    | `/api/candidates/:id` | Update candidate   |
| DELETE | `/api/candidates/:id` | Delete candidate   |

### Verification

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| POST   | `/api/candidates/:id/verify` | Start verification |

### Reports

| Method | Endpoint               | Description  |
| ------ | ---------------------- | ------------ |
| GET    | `/api/reports/:id`     | Get report   |
| GET    | `/api/reports/:id/pdf` | Download PDF |

### Dashboard

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/dashboard/stats` | Dashboard statistics |

---

## Security Measures

* JWT authentication
* Password hashing using bcrypt
* Protected routes
* Request validation using Zod
* Sensitive identity masking in reports
* Prisma ORM for secure database queries

---

## Future Improvements Could be

* Real Aadhaar and PAN API integration
* Email notifications
* Advanced filtering and analytics
* Role-based access control
* Verification retry system
* Audit exports

---