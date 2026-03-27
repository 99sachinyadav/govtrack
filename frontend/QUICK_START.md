# 🚀 Quick Start Guide - MERN Backend Setup

## Step 1: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all required packages
npm install
```

**Expected packages to install:**
- express (API framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT authentication)
- bcryptjs (Password hashing)
- cors (Cross-Origin Resource Sharing)
- dotenv (Environment variables)
- validator (Input validation)
- nodemon (Auto-reload in dev mode)

## Step 2: Set Up MongoDB

### Option A: Local MongoDB Installation

**Windows:**
```bash
# Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-integrity-ai?retryWrites=true&w=majority
   ```

## Step 3: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
```

**Required values in .env:**
```env
MONGODB_URI=mongodb://localhost:27017/civic-integrity-ai
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## Step 4: Start the Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
╔════════════════════════════════════════════════════╗
║  Civic Integrity AI Backend Server                │
║  Port: 5000                                        │
║  Environment: development                         │
║  API: http://localhost:5000/api                   │
╚════════════════════════════════════════════════════╝
```

## Step 5: Test the API

### Option A: Using PowerShell (Windows)
```bash
cd backend
./test-api.ps1
```

### Option B: Using Bash (Mac/Linux)
```bash
cd backend
bash test-api.sh
```

### Option C: Using Postman
1. Download Postman: https://www.postman.com/
2. Import endpoints from `backend/README.md`
3. Create requests for each endpoint

### Option D: Using curl (Command Line)

**Register as Citizen:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "citizen",
    "identificationId": "123456789",
    "identificationType": "aadhaar",
    "citizenship": {
      "district": "Bangalore",
      "state": "Karnataka",
      "country": "India"
    }
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "citizen"
  }'
```

## Step 6: Connect Frontend to Backend

### Update Frontend API Configuration

Edit `src/lib/apiClient.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Create or update `.env` in root folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### Update Frontend Components

In your login/register components, use the API client:

```typescript
import apiClient from '@/lib/apiClient';

// Register
const handleRegister = async (userData) => {
  try {
    const response = await apiClient.register(userData);
    apiClient.setToken(response.data.token);
    // Navigate to dashboard
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Login
const handleLogin = async (credentials) => {
  try {
    const response = await apiClient.login(credentials);
    apiClient.setToken(response.data.token);
    // Navigate to dashboard
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Check if authenticated
if (!apiClient.isAuthenticated()) {
  // Show login form
}
```

## Step 7: Run Full Stack

### Terminal 1 - Frontend
```bash
npm run dev
# Available at http://localhost:5173
```

### Terminal 2 - Backend
```bash
cd backend
npm run dev
# Available at http://localhost:5000
```

### Terminal 3 - MongoDB (if local)
```bash
mongod
```

## 🔐 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/verify` | Verify JWT token | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |

## 📋 User Roles

### 1. Citizen
Required fields:
- `identificationId`: Aadhar/Voter ID
- `identificationType`: "aadhaar" or "voter_id"
- `citizenship`: district, state, country

### 2. Government Official
Required fields:
- `identificationId`: Employee ID
- `identificationType`: "employee_id"
- `official`: department, designation, location

### 3. Contractor
Required fields:
- `identificationId`: License ID
- `identificationType`: "license_id"
- `contractor`: company name, registration, GST, bank details

### 4. Media/Audit
Required fields:
- `identificationId`: License Number
- `identificationType`: "audit_license"
- `media`: organization, license info, specialization

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
```bash
# Check if MongoDB is running
# Windows: Check Services or Task Manager
# Mac/Linux: 
sudo systemctl status mongodb

# Restart MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change PORT in backend/.env
PORT=5001

# Or kill the process using port 5000
# Windows PowerShell:
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Mac/Linux:
kill -9 $(lsof -t -i :5000)
```

### Issue: CORS Error
**Solution:**
Update `CORS_ORIGIN` in `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

### Issue: JWT Token Error
**Solution:**
- Make sure token is being sent in header: `Authorization: Bearer <token>`
- Check that `JWT_SECRET` is set in `.env`
- Verify token hasn't expired (default: 7 days)

## 📚 Next Steps

1. ✅ Backend is running
2. ✅ Database is connected
3. ✅ Authentication is working
4. ⏭️ Integrate API with frontend login/register forms
5. ⏭️ Create protected routes that require authentication
6. ⏭️ Add role-based dashboards
7. ⏭️ Add project management features
8. ⏭️ Add real-time monitoring

## 🔗 Useful Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **JWT Docs:** https://jwt.io/
- **Mongoose Docs:** https://mongoosejs.com/
- **CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

## 📞 Getting Help

Check the detailed documentation:
- Backend: `backend/README.md`
- Full Setup: `BACKEND_SETUP.md`
- API Reference: `backend/README.md` (API Endpoints section)

---

**Happy coding! 🎉**
