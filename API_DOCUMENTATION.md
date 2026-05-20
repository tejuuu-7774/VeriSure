# VeriSure API Documentation

## Base URL

### Local Development

```http
http://localhost:3001/api
```

### Production

```http
https://verisure-backend.onrender.com/api
```

---

# Authentication

VeriSure uses **JWT Authentication**.

After login, include the JWT token in the `Authorization` header for all protected routes.

### Header Format

```http
Authorization: Bearer <jwt_token>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
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

**Status: 201 Created**

```json
{
  "message": "User registered successfully"
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Validation error |
| 409 | Email already exists |
| 500 | Internal server error |

---

## Login User

Authenticates a user and returns a JWT token.

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

**Status: 200 OK**

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

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Validation error |
| 401 | Invalid credentials |
| 500 | Internal server error |

---

# Candidate APIs

All candidate routes are protected and require JWT authentication.

---

## Get All Candidates

Returns all candidates created by the authenticated user.

### Endpoint

```http
GET /api/candidates
```

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

**Status: 200 OK**

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

---

## Get Candidate By ID

Returns candidate details including verification logs.

### Endpoint

```http
GET /api/candidates/:id
```

Example:

```http
GET /api/candidates/123
```

### Success Response

**Status: 200 OK**

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

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 401 | Unauthorized |
| 404 | Candidate not found |

---

## Create Candidate

Creates a new candidate profile.

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

**Status: 201 Created**

```json
{
  "message": "Candidate created successfully",
  "candidate": {
    "id": "candidate_id"
  }
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |

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

**Status: 200 OK**

```json
{
  "message": "Candidate updated successfully"
}
```

---

## Delete Candidate

Deletes a candidate record.

### Endpoint

```http
DELETE /api/candidates/:id
```

### Success Response

**Status: 200 OK**

```json
{
  "message": "Candidate deleted successfully"
}
```

---

# Verification APIs

## Start Verification

Runs Aadhaar and PAN verification simulation.

### Endpoint

```http
POST /api/candidates/:id/verify
```

Example:

```http
POST /api/candidates/123/verify
```

### Success Response

**Status: 200 OK**

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

**Status: 200 OK**

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

Returns a structured verification report.

### Endpoint

```http
GET /api/reports/:id
```

### Success Response

**Status: 200 OK**

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

Downloads a professional PDF verification report.

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

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Resource not found |
| 409 | Conflict |
| 500 | Internal server error |

---

# Postman Testing

For protected routes:

```http
Authorization: Bearer <jwt_token>
```

### Recommended API Testing Flow

```txt
1. Register user
2. Login user
3. Copy JWT token
4. Create candidate
5. Start verification
6. View candidate details
7. Check dashboard statistics
8. Generate report
9. Download PDF report
```