# Civic Integrity AI - MERN Full Stack Setup

## 📦 Project Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application for transparent governance.

## 🏗️ Project Structure

```
GovTrack---Civic-Ai-Integrity-Platform/
├── src/                    # React Frontend
│   ├── components/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── backend/               # Node.js Backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── package.json          # Frontend dependencies
├── vite.config.ts       # Vite configuration
└── README.md
```

## ⚙️ Prerequisites

- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start server
npm run dev
```

Backend API will be available at `http://localhost:5000`

## 🔧 Configuration

### Frontend (.env)
Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/civic-integrity-ai
PORT=5000
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

## 📡 API Integration

The frontend communicates with the backend at:
- **Base URL:** `http://localhost:5000/api`
- **Auth Endpoints:** `/auth/register`, `/auth/login`, `/auth/verify`

### Environment Setup for Frontend

Add API base URL to your frontend API client:

```typescript
// src/lib/api.ts or similar
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  auth: {
    register: (data) => fetch(`${API_BASE}/auth/register`, { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }),
    login: (data) => fetch(`${API_BASE}/auth/login`, { 
      method: 'POST', 
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }),
  }
};
```

## 📝 Scripts

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend
```bash
npm run dev        # Start with auto-reload
npm start          # Start production server
```

## 🔐 User Roles

1. **Citizen** - Monitor projects and file grievances
2. **Government Official** - Manage budgets and oversee projects
3. **Contractor** - Update progress and manage contracts
4. **Media/Audit** - Investigate and audit public spending

## 📚 Documentation

- **Frontend:** See `README.md` in root directory
- **Backend:** See `backend/README.md` for API documentation

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001  # or any available port
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in backend/.env
- For MongoDB Atlas, whitelist IP address

### CORS Errors
- Update `CORS_ORIGIN` in backend/.env
- Add frontend URL to the list

### Hot reload not working
```bash
# Kill process and restart
npm run dev
```

## 🔄 Workflow

1. **Frontend (React + Vite)**
   - User fills registration/login form
   - Sends request to `http://localhost:5000/api/auth/register` or `/login`
   - Receives JWT token in response
   - Stores token in localStorage
   - Includes token in subsequent requests

2. **Backend (Express + MongoDB)**
   - Receives registration/login request
   - Validates input
   - Creates/finds user in MongoDB
   - Generates JWT token
   - Returns token and user data

3. **Database (MongoDB)**
   - Stores user documents with role-specific fields
   - Each user has:
     - Basic info (name, email, password hash)
     - Role (citizen, official, contractor, media)
     - Role-specific fields

## 📦 Key Dependencies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Lucide Icons

### Backend
- Express.js
- MongoDB + Mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

## 🎓 Next Steps

1. ✅ Frontend is styled and professional
2. ✅ Backend API is set up with authentication
3. ⏭️ Connect frontend to backend API
4. ⏭️ Add role-specific dashboards
5. ⏭️ Add project/grievance management features
6. ⏭️ Add real-time monitoring features

## 📞 Support

For issues or questions:
1. Check the documentation in respective README files
2. Review error messages and logs
3. Verify environment configuration
4. Check MongoDB connection

---

**Made with ❤️ for transparent governance**
