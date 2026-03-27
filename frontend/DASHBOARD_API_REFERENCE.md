# Dashboard APIs - Complete Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. PROJECTS API

### Get All Projects
```http
GET /projects?status=in-progress&sector=healthcare&risk=high
```
**Query Parameters:**
- `status`: sanctioned, in-progress, completed, delayed, on-hold
- `sector`: healthcare, education, infrastructure, agriculture, energy, sanitation
- `risk`: low, medium, high
- `search`: Search by title or contractor name

### Get Single Project
```http
GET /projects/:projectId
```

### Create Project (Protected - Official only)
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Bridge Construction",
  "description": "Highway bridge reconstruction project",
  "sector": "infrastructure",
  "budget": 50000000,
  "location": {
    "address": "NH-48, Maharashtra",
    "lat": 19.0760,
    "lng": 72.8777
  },
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "department": "Public Works",
  "officialId": "user_id"
}
```

### Update Project Status (Protected)
```http
PATCH /projects/:projectId/status
Authorization: Bearer <token>

{
  "status": "in-progress",
  "progress": 45,
  "expenses": 25000000,
  "resourceUsage": "Heavy machinery deployed"
}
```

### Add Citizen Feedback (Protected)
```http
POST /projects/:projectId/feedback
Authorization: Bearer <token>

{
  "rating": 4,
  "comment": "Progress is good, quality is maintained",
  "userId": "citizen_id",
  "userName": "John Doe"
}
```

### Get Dashboard Stats
```http
GET /projects/stats?officialId=user_id
```

---

## 2. COMPLAINTS/GRIEVANCES API

### Get All Complaints
```http
GET /complaints?status=pending&priority=high&projectId=project_id
```
**Query Parameters:**
- `status`: pending, in-review, resolved, rejected
- `priority`: low, medium, high, critical
- `userId`: Filter by complainer
- `projectId`: Filter by project
- `search`: Search by description

### Get Single Complaint
```http
GET /complaints/:complaintId
```

### File New Complaint (Protected)
```http
POST /complaints
Authorization: Bearer <token>

{
  "userId": "citizen_id",
  "userName": "Citizen Name",
  "projectId": "project_id",
  "projectName": "Bridge Construction",
  "category": "budget-misuse",
  "description": "Found discrepancies in bill submissions",
  "location": "Site Office, Mumbai"
}
```
**Complaint Categories:**
- budget-misuse
- quality-issue
- delay
- corruption-suspicion
- other

### Update Complaint Status (Protected - Official only)
```http
PATCH /complaints/:complaintId/status
Authorization: Bearer <token>

{
  "status": "resolved",
  "priority": "critical",
  "resolution": "Funds recovered and contractor penalized"
}
```

### Upvote Complaint (Protected)
```http
POST /complaints/:complaintId/upvote
Authorization: Bearer <token>
```

### Get Complaint Statistics
```http
GET /complaints/stats
```

---

## 3. BUDGETS API

### Get All Budgets
```http
GET /budgets?category=infrastructure&officialId=user_id&status=approved
```
**Query Parameters:**
- `category`: salary, infrastructure, supplies, maintenance, other
- `officialId`: Filter by official
- `projectId`: Filter by project
- `status`: approved, pending, rejected, partially-utilized

### Get Single Budget
```http
GET /budgets/:budgetId
```

### Create Budget Allocation (Protected - Official only)
```http
POST /budgets
Authorization: Bearer <token>

{
  "title": "Q1 Infrastructure Budget",
  "allocatedAmount": 100000000,
  "category": "infrastructure",
  "departmentId": "dept_001",
  "officialId": "user_id",
  "projectId": "project_id",
  "fiscalYear": "2024-25",
  "quarter": 1
}
```

### Update Budget Utilization (Protected)
```http
PATCH /budgets/:budgetId
Authorization: Bearer <token>

{
  "utilizedAmount": 50000000,
  "status": "partially-utilized"
}
```

### Approve Budget (Protected - Higher authority)
```http
POST /budgets/:budgetId/approve
Authorization: Bearer <token>
```

### Get Budget Statistics
```http
GET /budgets/stats?officialId=user_id
```

---

## 4. RTI REQUESTS API

### Get All Public RTI Requests
```http
GET /rti?status=approved&priority=urgent
```
**Query Parameters:**
- `status`: pending, in-review, approved, partially-approved, rejected
- `requesterId`: Filter by requester
- `projectId`: Filter by project
- `search`: Search by title

### Get Single RTI Request
```http
GET /rti/:rtiId
```

### Submit RTI Request (Protected - Media/Audit)
```http
POST /rti
Authorization: Bearer <token>

{
  "title": "Highway Expansion Audit",
  "description": "Request for audit reports on Highway 48 expansion project",
  "projectId": "project_id",
  "requesterId": "media_user_id",
  "requesterName": "National News Bureau",
  "requesterEmail": "rti@newsbureau.com",
  "priority": "urgent"
}
```

### Approve RTI Request (Protected - Official only)
```http
PATCH /rti/:rtiId/approve
Authorization: Bearer <token>

{
  "responseDocument": "https://bucket.s3.com/audit_report_2024.pdf",
  "denialReason": null
}
```

**OR (for rejection):**
```json
{
  "responseDocument": null,
  "denialReason": "Classified information under State Secrets Act"
}
```

### Get RTI Statistics
```http
GET /rti/stats
```

---

## 5. RESPONSE FORMAT

All responses follow this format:

**Success (2xx):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 6. ERROR CODES

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 7. REAL-TIME UPDATES (WebSocket)

Connect to WebSocket for real-time updates:
```
ws://localhost:5000/ws
```

**Subscribe to events:**
```json
{
  "action": "subscribe",
  "events": ["project.updated", "complaint.filed", "budget.approved"]
}
```

**Events:**
- `project.created`
- `project.updated`
- `project.status.changed`
- `complaint.filed`
- `complaint.resolved`
- `budget.allocated`
- `budget.approved`
- `rti.requested`
- `rti.approved`

---

## 8. EXAMPLE: Complete Workflow

### 1. Official Creates Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Construction",
    "description": "New school in rural area",
    "sector": "education",
    "budget": 10000000,
    "location": {"address": "Village X, State Y", "lat": 20.5, "lng": 78.5},
    "startDate": "2024-06-01",
    "endDate": "2025-05-31",
    "department": "Education",
    "officialId": "official_123"
  }'
```

### 2. Citizen Files Complaint
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer $CITIZEN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "citizen_456",
    "userName": "Rajesh Kumar",
    "projectId": "project_789",
    "projectName": "School Construction",
    "category": "quality-issue",
    "description": "Poor quality of materials being used",
    "location": "School Site, Village X"
  }'
```

### 3. Official Reviews & Resolves
```bash
curl -X PATCH http://localhost:5000/api/complaints/complaint_001/status \
  -H "Authorization: Bearer $OFFICIAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "priority": "high",
    "resolution": "Material quality standards enforced, contractor warned"
  }'
```

### 4. Media Files RTI
```bash
curl -X POST http://localhost:5000/api/rti \
  -H "Authorization: Bearer $MEDIA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Construction Audit Details",
    "description": "Requesting audit reports and inspection reports",
    "projectId": "project_789",
    "requesterId": "media_001",
    "requesterName": "Investigative Bureau",
    "requesterEmail": "rti@invbureau.com"
  }'
```

