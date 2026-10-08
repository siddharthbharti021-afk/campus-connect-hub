# CampusOS Backend API Guide & RBAC Authentication

## Overview
CampusOS is built on a FastAPI backend (`http://localhost:8000/api/v1`) with role-based access control (RBAC), bcrypt password hashing, signed JWT authentication, and strict server-side data isolation for 4 primary user personas: **Student**, **Professor**, **Dean**, and **Guardian**.

---

## Environment & Configuration
Configuration settings are specified in `app/config.py` and overrideable via `backend/.env`:

| Key | Default / Recommended Value | Description |
| --- | --- | --- |
| `JWT_SECRET` | `campusos-production-jwt-secret-key-2026-hackathon` | Secret key used for signing HS256 JWT tokens. |
| `JWT_ALGORITHM` | `HS256` | Token signing algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 days) | Token expiration duration in minutes. |
| `DATABASE_URL` | `sqlite+aiosqlite:///./campusos.db` | Async SQLAlchemy database connection string. |

---

## Demo Credentials (Seeded)
To seed or reset demo users, run:
```bash
python scripts/seed_smart_campus.py
```

All demo accounts share the password: `Password123!`

| Role | User ID (`user_code`) | Persona Name | Key Scoped Access & Features |
| --- | --- | --- | --- |
| **Dean** | `dean01` | Dr. Sanjeev Verma | Institution-wide analytics, all departments, fee collections, RAG intelligence. |
| **Professor** | `prof01` | Prof. Ananya Sen | Computer Science classes, CS student roster, early warning attendance flags. |
| **Professor** | `prof02` | Prof. Rajesh Kumar | Data Science classes, DS student roster, class performance metrics. |
| **Student** | `student01` | Aarav Patel | Personal fees, bus pass (`BUS-01`), timetable, attendance, certificates. |
| **Student** | `student02` | Ananya Sharma | Personal fees, bus pass (`BUS-02`), timetable, attendance, certificates. |
| **Student** | `student03` | Rohan Gupta | Personal fees, timetable, attendance, certificates. |
| **Guardian** | `parent01` | Vikram Patel | Linked child: `student01` (Aarav Patel). Scoped read-only progress & fees. |
| **Guardian** | `parent02` | Sunita Sharma | Linked child: `student02` (Ananya Sharma). Scoped read-only progress. |

---

## Authentication Endpoints

### 1. `POST /api/v1/auth/login`
- **Request Body:**
```json
{
  "user_id": "student01",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "access_token": "<signed-jwt-token>",
  "token_type": "bearer",
  "user": {
    "id": 3,
    "email": "aarav.patel@campus.edu",
    "user_code": "student01",
    "full_name": "Aarav Patel",
    "roles": ["student"]
  }
}
```

### 2. `GET /api/v1/auth/me`
- **Header:** `Authorization: Bearer <signed-jwt-token>`
- **Response (200 OK):** Returns profile of currently authenticated user.

### 3. `POST /api/v1/auth/logout`
- **Header:** `Authorization: Bearer <signed-jwt-token>`
- **Response (200 OK):** Clears session token.

---

## RBAC & Data Scoping Policy Matrix

| Endpoint Route | Allowed Roles | Data Scoping Rules |
| --- | --- | --- |
| `/auth/login` | Public | None |
| `/auth/me`, `/auth/logout` | Any authenticated user | Returns user's own token identity |
| `/fees/my-fees` | `student`, `parent`, `dean` | Students see own fees; Guardians see linked child's fees; Dean sees institution aggregate |
| `/certificates/my-certificates` | `student`, `dean` | Students see own certificates; Dean sees all issued certificates |
| `/transport/bus-pass` | `student`, `parent`, `dean` | Students see own pass; Guardians see child pass; Dean sees fleet status |
| `/parent/my-children` | `parent`, `dean` | Parent sees only linked children via `ParentStudentLink` |
| `/intelligence/*` | `dean`, `professor` | Professors see department early warnings; Dean sees university analytics |
| `/ai/chat` | Any authenticated user | Answers scoped strictly to user's identity & permitted context |

---

## How to Run & Verify

1. **Backend Server:**
   ```bash
   cd backend
   python scripts/seed_smart_campus.py
   uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
2. **Backend Test Suite:**
   ```bash
   cd backend
   python test_all_new_modules.py
   ```
3. **Frontend Application:**
   ```bash
   cd frontend
   npm run build
   npm run dev
   ```
