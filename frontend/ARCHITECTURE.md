# Backend Architecture & Database Schema

## 🔷 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection setup
│   ├── controllers/
│   │   └── authController.js        # Request handlers for auth
│   ├── middleware/
│   │   └── auth.js                  # JWT, error handling, validation
│   ├── models/
│   │   └── User.js                  # User schema with role-specific fields
│   ├── routes/
│   │   └── authRoutes.js            # API route definitions
│   ├── utils/
│   │   └── helpers.js               # Utility functions
│   └── server.js                    # Express app entry point
├── .env                             # Environment configuration
├── .env.example                     # Example env variables
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
├── test-api.sh                      # API testing script (bash)
├── test-api.ps1                     # API testing script (PowerShell)
└── README.md                        # Backend documentation

```

## 🗄️ Database Schema

### User Model (MongoDB Collection: `users`)

```javascript
{
  // Identification
  _id: ObjectId,
  
  // Common Fields
  fullName: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  profileImage: String,
  
  // Role & Identification
  role: String (enum: "citizen", "official", "contractor", "media") (required),
  identificationId: String (unique, required),
  identificationType: String (required),
  
  // Citizen-Specific
  citizenship: {
    district: String,
    state: String,
    country: String
  },
  
  // Official-Specific
  official: {
    departmentName: String,
    designation: String,
    departmentCode: String,
    officeLocation: String,
    officePhone: String
  },
  
  // Contractor-Specific
  contractor: {
    companyName: String,
    registrationNumber: String,
    businessCategory: String,
    gstNumber: String,
    bankAccount: {
      accountNumber: String,
      bankName: String,
      ifscCode: String
    },
    previousProjects: Number,
    rating: Number (0-5)
  },
  
  // Media/Audit-Specific
  media: {
    organizationName: String,
    licenseNumber: String,
    licenseExpiry: Date,
    specialization: [String]
  },
  
  // Account Management
  isVerified: Boolean,
  verificationToken: String,
  verificationTokenExpiry: Date,
  isActive: Boolean,
  
  // Security
  lastLogin: Date,
  failedLoginAttempts: Number,
  lockoutUntil: Date,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

### Registration Flow
```
1. User submits form with:
   - Basic info (name, email, password)
   - Role selection (citizen/official/contractor/media)
   - Role-specific fields

2. Backend validates:
   - Password match
   - Email format
   - Unique email & identification ID
   - Required fields for role

3. Create user:
   - Hash password with bcrypt (salt: 10 rounds)
   - Generate auto ID if not provided
   - Save to MongoDB

4. Generate JWT token:
   - Payload: userId, role
   - Secret: JWT_SECRET from .env
   - Expiry: JWT_EXPIRE (default: 7d)

5. Return:
   - JWT token (for localStorage)
   - User profile (name, email, role, id)
```

### Login Flow
```
1. User submits:
   - Email
   - Password
   - Role (optional)

2. Backend validates:
   - User exists with email
   - Password matches (bcrypt.compare)
   - Account not locked

3. On success:
   - Reset failed login attempts
   - Update last login timestamp
   - Generate JWT token
   - Return token + user info

4. On failure:
   - Increment failed attempts
   - Lock account after 5 attempts (30 min)
   - Return error message
```

### Token Verification Flow
```
1. Client sends request with:
   - Authorization header: "Bearer <token>"

2. Middleware (protect):
   - Extract token from header
   - Verify with JWT_SECRET
   - Decode payload (userId, role)
   - Attach to req.user

3. If valid:
   - Continue to route handler
   
4. If invalid:
   - Return 401 Unauthorized
```

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "citizen"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 📝 Endpoints Reference

### POST /api/auth/register
Register new user with role-specific fields

**Required fields:**
- fullName
- email
- password
- confirmPassword
- role
- identificationId
- identificationType
- Role-specific fields

### POST /api/auth/login
Login with email, password, and optional role

**Required fields:**
- email
- password

### GET /api/auth/verify
Verify JWT token

**Auth:** Required (Bearer token)

### GET /api/auth/me
Get current user profile

**Auth:** Required (Bearer token)

## 🔒 Security Measures

1. **Password Security**
   - Hashed with bcrypt (10 salt rounds)
   - Not returned in API responses
   - Minimum 6 characters

2. **JWT Tokens**
   - Secret key required (JWT_SECRET)
   - 7-day expiration
   - Signature verification on each request

3. **Account Protection**
   - Account lockout after 5 failed logins
   - 30-minute lockout duration
   - Failed attempt counter

4. **Data Validation**
   - Email format validation
   - Required field checks
   - Type validation

5. **Access Control**
   - Role-based authorization
   - Token verification on protected routes
   - CORS protection

## 🚀 Deployment Considerations

### Environment Variables
- Never commit .env file
- Use .env.example as template
- Rotate JWT_SECRET in production
- Use strong, unique values

### MongoDB
- Use MongoDB Atlas for production
- Enable IP whitelist
- Use strong authentication
- Regular backups

### API Security
- Use HTTPS in production
- Set appropriate CORS_ORIGIN
- Rate limiting (future)
- Request logging (future)

## 📊 Database Indexing

Recommended MongoDB indexes:
```javascript
// Single field indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ identificationId: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Compound indexes
db.users.createIndex({ role: 1, createdAt: -1 })
```

## 🔄 Middleware Chain

```
Request
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Request Logger
  ↓
Route Handler
  ↓
[If Protected] Auth Middleware (protect)
  ↓
[If Authorized] Role Check (authorize)
  ↓
Controller Logic
  ↓
Response/Error Handler
  ↓
Response Sent
```

## 📈 Scalability Features

For future improvements:
- Add pagination to list endpoints
- Implement caching (Redis)
- Add request rate limiting
- Database query optimization
- Add audit logging
- Implement soft deletes
- Add webhook support
- Implement real-time updates (WebSockets)

---

**Architecture designed for security, scalability, and maintainability**
