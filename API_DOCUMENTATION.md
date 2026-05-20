For submission, your API documentation should be **clean, evaluator-friendly, and quick to scan** — not Swagger-level overkill.

I recommend:

```txt id="x8m2qt"
API_DOCUMENTATION.md
```

inside root.

Structure:

```txt id="p4n8rv"
base url
authentication
request headers
all endpoints
request body
response examples
status codes
error responses
```

Use this **copy-paste ready professional version**:

````md id="t3k8vn"
# VeriSure API Documentation

## Base URL

### Local Development

```http
http://localhost:3001/api
````

### Production

```http
Add deployed backend URL here
```

---

# Authentication

VeriSure uses **JWT Authentication**.

After login, include the token in the Authorization header.

### Header Format

```http
Authorization: Bearer <jwt_token>
```

Example:

```http
Authorization: Bearer eyJhbGciOi...
```

---

# Authentication APIs

## Register User

Creates a new user account.

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Tejaswini",
  "email": "teju@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "User registered successfully"
}
```

### Status Codes

| Code | Description          |
| ---- | -------------------- |
| 201  | User created         |
| 400  | Validation error     |
| 409  | Email already exists |

---

## Login User

Authenticates user and returns JWT token.

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "teju@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Tejaswini",
    "email": "teju@example.com"
  }
}
```

### Status Codes

| Code | Description         |
| ---- | ------------------- |
| 200  | Login successful    |
| 401  | Invalid credentials |
| 400  | Validation error    |

---

# Candidate APIs

All candidate routes are protected.

---

## Get All Candidates

Returns all candidates.

### Endpoint

```http
GET /api/candidates
```

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

```json
[
  {
    "id": "candidate_id",
    "fullName": "Aarav Mehta",
    "email": "aarav@example.com",
    "phone": "9876543210",
    "verificationStatus": "VERIFIED",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

### Status Codes

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 401  | Unauthorized |

---

## Get Candidate By ID

Returns candidate details with verification logs.

### Endpoint

```http
GET /api/candidates/:id
```

Example:

```http
GET /api/candidates/123
```

### Success Response

```json
{
  "id": "candidate_id",
  "fullName": "Aarav Mehta",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "verificationStatus": "VERIFIED",
  "verificationLogs": []
}
```

---

## Create Candidate

Creates a new candidate.

### Endpoint

```http
POST /api/candidates
```

### Request Body

```json
{
  "fullName": "Aarav Mehta",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "aadhaarNumber": "123412341234",
  "panNumber": "ABCDE1234F",
  "dob": "1996-04-12",
  "address": "Bangalore"
}
```

### Success Response

```json
{
  "message": "Candidate created successfully",
  "candidate": {
    "id": "candidate_id"
  }
}
```

### Status Codes

| Code | Description       |
| ---- | ----------------- |
| 201  | Candidate created |
| 400  | Validation error  |
| 401  | Unauthorized      |

---

## Update Candidate

Updates candidate information.

### Endpoint

```http
PUT /api/candidates/:id
```

### Request Body

```json
{
  "phone": "9999999999",
  "address": "Hyderabad"
}
```

### Success Response

```json
{
  "message": "Candidate updated successfully"
}
```

---

## Delete Candidate

Deletes a candidate.

### Endpoint

```http
DELETE /api/candidates/:id
```

### Success Response

```json
{
  "message": "Candidate deleted successfully"
}
```

---

# Verification APIs

## Start Verification

Runs Aadhaar and PAN verification.

### Endpoint

```http
POST /api/candidates/:id/verify
```

Example:

```http
POST /api/candidates/123/verify
```

### Success Response

```json
{
  "message": "Verification completed",
  "status": "VERIFIED"
}
```

### Possible Status Values

```txt
VERIFIED
FAILED
PARTIAL
PENDING
```

---

# Dashboard APIs

## Get Dashboard Statistics

Returns dashboard metrics.

### Endpoint

```http
GET /api/dashboard/stats
```

### Success Response

```json
{
  "totalCandidates": 10,
  "verified": 5,
  "pending": 2,
  "failed": 1,
  "partial": 2
}
```

---

# Report APIs

## Get Verification Report

Returns structured verification report.

### Endpoint

```http
GET /api/reports/:id
```

### Success Response

```json
{
  "reportId": "REP-12345",
  "candidate": {},
  "verificationSummary": {},
  "checks": {},
  "timeline": [],
  "generatedAt": "timestamp"
}
```

---

## Download PDF Report

Downloads verification report PDF.

### Endpoint

```http
GET /api/reports/:id/pdf
```

### Response

Returns downloadable PDF file.

---

# Error Response Format

### Example Error Response

```json
{
  "message": "Something went wrong"
}
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource created      |
| 400  | Bad request           |
| 401  | Unauthorized          |
| 404  | Resource not found    |
| 409  | Conflict              |
| 500  | Internal server error |

---

# Postman Testing

Import all APIs into Postman and use:

```http
Authorization: Bearer <jwt_token>
```

for protected routes.

Recommended testing flow:

```txt
1. Register user
2. Login user
3. Copy JWT token
4. Create candidate
5. Start verification
6. View dashboard stats
7. Generate report
8. Download PDF
```