# Referral Credit System

A simple referral-based credit system with first-purchase conversion logic.

## Overview

This monorepo provides a minimal, production-ready referral system:
- Users can register/login and receive a unique `referralCode`.
- Sharing the referral link (e.g., `/register?r=CODE`) creates a pending referral on signup.
- The referred user’s first purchase converts the referral and atomically credits both users (+2 credits each).
- A simple dashboard endpoint returns credits and referral stats.

Auth uses stateless JWTs returned on login/registration. Protected routes require `Authorization: Bearer <token>`.

## API Overview & Endpoints

- Base URL (local dev): `http://localhost:4000/api`
- Auth: Send `Authorization: Bearer <JWT>` for protected routes.
- Content type: `application/json` unless noted.

### Health
- GET `/health`
  - Public liveness probe.
  - Response: `{ ok: true }`

### Auth
- POST `/register`
  - Body: `{ email: string, password: string, username?: string, referralCode?: string }`
  - Creates a new user, optionally links a referrer by `referralCode` (status=`pending`).
  - 201 Responses:
    - Success: `{ token, user: { id, email, username, referralCode, credits, hasPurchased } }`
  - Errors: `400` (missing fields), `409` (email exists)

- POST `/login`
  - Body: `{ email: string, password: string }`
  - 200 Responses:
    - Success: `{ token, user: { id, email, username, referralCode, credits, hasPurchased } }`
  - Errors: `400` (missing fields), `401` (invalid credentials)

### Dashboard (Protected)
- GET `/dashboard`
  - Headers: `Authorization: Bearer <token>`
  - Returns the signed-in user’s summary.
  - 200 Response: `{ totalCredits, referredUsers, convertedUsers, referralCode }`
  - Errors: `401` (missing/invalid token), `404` (user not found)

### Purchase (Protected)
- POST `/purchase`
  - Headers: `Authorization: Bearer <token>`
  - Marks the caller’s first purchase and (if they were referred and still pending) converts the referral and credits both parties by +2.
  - 200 Response: `{ message: 'Purchase completed', hasPurchased: true }`
  - Errors: `400` (already purchased), `401` (missing/invalid token)

### Example Requests

Register:
```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
  "email": "krish123@gmail.com",
  "password": "krish123",
  "username": "krish",
  "referralCode": "BOB123"
}
```

Login:
```http
POST /api/login HTTP/1.1
Content-Type: application/json

{ "email": "alice@example.com", "password": "StrongP@ssw0rd" }
```

Dashboard:
```http
GET /api/dashboard HTTP/1.1
Authorization: Bearer <JWT>
```

Purchase:
```http
POST /api/purchase HTTP/1.1
Authorization: Bearer <JWT>
```

## System Design Documentation

### Database Schema Design (MongoDB)

- User
  - username: string (required)
  - email: string (required, unique)
  - passwordHash: string (required)
  - referralCode: string (required, unique)
  - credits: number (default: 0)
  - hasPurchased: boolean (default: false)
  - createdAt: Date (default: now)

- Referral
  - referrerID: ObjectId<User> (required)
  - referredUserID: ObjectId<User> (required)
  - status: 'pending' | 'converted' (default: 'pending')
  - createdAt: Date (default: now)

Constraints/Indexes:
- User.email unique index
- User.referralCode unique index
- Optional compound index on Referral `(referrerID, referredUserID)` to prevent duplicates


### Key Business Rules
- Only the first purchase by a referred user triggers credits.
- Conversions happen once per referred user.
- Both referrer and referred user receive +2 credits on first purchase.

## Monorepo Layout
- backend: Node.js + Express + TypeScript + Mongoose
- frontend: Next.js + TypeScript + Tailwind CSS + Zustand + Framer Motion

## Quick Start

### Backend
1. Copy `backend/.env.example` to `backend/.env` and fill values.
2. Install deps and run in dev mode:

```powershell
cd backend
npm install
npm run dev
```

### Frontend
1. Copy `frontend/.env.example` to `frontend/.env` and fill `NEXT_PUBLIC_API_BASE_URL`.
2. Install deps and run in dev mode:

```powershell
cd frontend
npm install
npm run dev
```

### Environment Variables
See `.env.example` files in each project for required variables.

## Test Scenario
- Register User A
- Copy A's referral link `https://app/register?r=CODE_A`
- Visit link and register User B (auto-captures referral)
- Log in as B and perform purchase (POST /purchase)
- Verify A and B both received +2 credits; B cannot earn again on repeat purchase

## Deployment Notes
- Backend (Render/Railway/Heroku):
  - Repo root: set context to `backend/`
  - Build: `npm ci && npm run build`
  - Start: `npm run start`
  - Env vars: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (e.g., `https://your-frontend.vercel.app`)
- Frontend (Vercel):
  - Root: `frontend/`
  - Env var: `NEXT_PUBLIC_API_BASE_URL` -> your backend URL (e.g., Render service URL)
- Database (MongoDB Atlas):
  - Create a cluster and database `referraldb`
  - Add a DB user and copy the connection string into backend `MONGODB_URI`
  - Network Access: allow the backend IPs or set 0.0.0.0/0 for testing
