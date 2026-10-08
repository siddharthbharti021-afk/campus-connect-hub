# 🚀 Smart University Digital Campus — Backend API & Architecture Guide

This backend is a production-grade, API-first **FastAPI** service with full multi-role support (**Student, Admin, Faculty, Parent**), relational data persistence, an **Academic Early-Warning Risk Engine**, and a **Dynamic Knowledge Ingestion (RAG) Subsystem** capable of indexing and answering questions on arbitrary campus data beyond base training data.

---

## 🏃 Quick Start (How to Run)

### 1. Start the Backend
Double-click `run_backend.bat` or in PowerShell run:
```powershell
.\run_backend.ps1
```
* **Interactive Swagger API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Interface:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

### 2. Run Database Seeding
To reset or re-populate the sample data across all modules:
```powershell
python backend/scripts/seed_smart_campus.py
```

### 3. Run Automated Integration Verification
```powershell
python backend/test_all_new_modules.py
```

---

## 👥 Pre-Seeded Demo Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Academic Admin** | `admin@college.edu` | *(any password)* | Full administrative approvals, financial overview, policy ingestion |
| **Faculty Mentor** | `faculty@college.edu` | *(any password)* | Department class register, marks, at-risk student monitoring |
| **Student** | `student@college.edu` | *(any password)* | Aarav Patel (3rd Year CSE, 84% attendance, healthy risk profile) |
| **At-Risk Student** | `atrisk@college.edu` | *(any password)* | Rohan Gupta (2nd Year CSE, 60% attendance, flagged as High Risk) |
| **Parent** | `parent@college.edu` | *(any password)* | Linked directly to student Aarav Patel |

---

## 🔌 API Endpoints, Inputs & Outputs

All API endpoints are prefixed with `/api/v1`. Pass `Authorization: Bearer <access_token>` in HTTP headers for protected endpoints.

---

### 1. Authentication (`/api/v1/auth`)

#### `POST /auth/login`
* **Input:**
  ```json
  {
    "email": "student@college.edu",
    "password": "any_password"
  }
  ```
* **Output:**
  ```json
  {
    "access_token": "eyJhbG...",
    "token_type": "bearer",
    "user": {
      "id": "cccc0000-0000-0000-0000-000000000003",
      "email": "student@college.edu",
      "full_name": "Aarav Patel",
      "role": "STUDENT",
      "roles": ["STUDENT"]
    }
  }
  ```

---

### 2. Fees & Payment Receipts (`/api/v1/fees`)

#### `GET /fees/my-invoices`
Returns current student's fee invoices, remaining balance, and past payment receipts.
* **Output:**
  ```json
  [
    {
      "id": "uuid",
      "student_id": "uuid",
      "title": "Semester 5 Tuition & Laboratory Fees",
      "category": "TUITION",
      "total_amount": 65000.0,
      "paid_amount": 65000.0,
      "remaining_balance": 0.0,
      "status": "PAID",
      "due_date": "2026-10-20",
      "payments": [
        {
          "receipt_number": "RCPT-TUIT-2026-001",
          "amount": 65000.0,
          "payment_method": "UPI",
          "status": "SUCCESS"
        }
      ]
    }
  ]
  ```

#### `POST /fees/pay`
Processes fee payment and generates a tamper-resistant receipt number.
* **Input:**
  ```json
  {
    "invoice_id": "uuid",
    "amount": 4500.0,
    "payment_method": "UPI"
  }
  ```
* **Output:**
  ```json
  {
    "id": "uuid",
    "invoice_id": "uuid",
    "amount": 4500.0,
    "payment_method": "UPI",
    "transaction_ref": "TXN-98471203",
    "receipt_number": "RCPT-56FECEED",
    "status": "SUCCESS",
    "paid_at": "2026-10-06T10:09:12"
  }
  ```

#### `GET /fees/receipt/{receipt_number}`
Public lookup endpoint to verify any issued fee receipt.

---

### 3. Digital Certificates & QR Verification (`/api/v1/certificates`)

#### `POST /certificates/apply`
* **Input:**
  ```json
  {
    "certificate_type": "BONAFIDE",
    "purpose": "Passport Application",
    "additional_details": "Urgent request"
  }
  ```

#### `GET /certificates/verify/{verification_code}` *(Public / QR Endpoint)*
Scanned by third parties (embassies, employers, banks) to verify certificate authenticity.
* **Output:**
  ```json
  {
    "is_valid": true,
    "verification_code": "VERIFY-BONA-2026",
    "certificate_type": "BONAFIDE",
    "student_name": "Aarav Patel",
    "department_name": "Computer Science & Engineering",
    "status": "ISSUED",
    "verification_message": "Certificate is authentic, approved, and officially verified by the University Academic Registry."
  }
  ```

---

### 4. Campus Transport (`/api/v1/transport`)

* `GET /transport/routes`: Lists all campus bus routes, stops, departure times, and driver phone numbers.
* `GET /transport/my-pass`: Returns the student's active digital bus pass with QR code and stop name.
* `POST /transport/apply-pass`: Student applies for a semester bus pass.

---

### 5. Parent Portal (`/api/v1/parent`)

#### `GET /parent/my-children`
Gives authenticated parents a real-time single pane of glass into their child's campus journey:
* **Output:**
  ```json
  [
    {
      "student_id": "cccc0000-0000-0000-0000-000000000003",
      "full_name": "Aarav Patel",
      "email": "student@college.edu",
      "department_name": "Computer Science & Engineering",
      "year_of_study": 3,
      "attendance_percentage": 84.0,
      "pending_fees": 0.0,
      "active_risk_level": "SAFE",
      "relationship": "FATHER"
    }
  ]
  ```

---

### 6. Academic Early-Warning Risk Engine (`/api/v1/intelligence`)

#### `GET /intelligence/my-risk`
Calculates student's risk profile based on:
1. Aggregate Attendance vs. 75% critical floor
2. Assignment completion rates
3. Cohort stress indicators
* **Output:**
  ```json
  {
    "student_id": "uuid",
    "student_name": "Rohan Gupta (At-Risk Demo)",
    "attendance_rate": 60.0,
    "assignment_completion_rate": 55.0,
    "risk_score": 45.0,
    "risk_level": "HIGH_RISK",
    "risk_factors": [
      {
        "category": "ATTENDANCE",
        "severity": "CRITICAL",
        "description": "Attendance is 60.0%, which is below the mandatory 75% institutional threshold."
      }
    ],
    "recommended_interventions": [
      "Issue formal attendance warning and schedule mentor counseling session.",
      "Notify parent/guardian regarding attendance deficit."
    ]
  }
  ```

---

### 7. Dynamic Campus Knowledge Ingestion & RAG (`/api/v1/ai/knowledge`)

> **Handles Any Custom / Manual Campus Data Apart from Base Static Tables**

#### `POST /ai/knowledge/ingest` *(Admin Only)*
Uploads custom campus rulebooks, hostel gate policies, scholarship circulars, GPU lab rules, or FAQs.
* **Input:**
  ```json
  {
    "title": "NVIDIA A100 GPU Cluster Usage Policy 2026",
    "category": "FACILITY",
    "content": "Hackathon participants may reserve NVIDIA A100 GPU compute nodes for 48 hours via Helpdesk ticket.",
    "tags": "gpu,ai,hackathon"
  }
  ```

#### `POST /ai/knowledge/ask` *(Unified AI Query)*
Queries both personal student context AND dynamically uploaded campus documents:
* **Input:**
  ```json
  {
    "query": "How do I reserve GPU servers for my hackathon?",
    "include_personal_context": true
  }
  ```
* **Output:**
  ```json
  {
    "intent": "INFORMATIONAL",
    "sources": [
      "FACILITY: NVIDIA A100 GPU Cluster Usage Policy 2026"
    ],
    "answer": "According to the official NVIDIA A100 GPU Cluster Usage Policy 2026: Hackathon participants may reserve NVIDIA A100 GPU compute nodes for 48 hours via Helpdesk ticket...",
    "suggested_actions": [
      {
        "action": "create_ticket",
        "label": "Raise Helpdesk Ticket",
        "endpoint": "/api/v1/helpdesk/tickets"
      }
    ]
  }
  ```
