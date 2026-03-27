import './config/env.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import rtiRoutes from './routes/rtiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import { errorHandler } from './middleware/auth.js';
import { initSocket } from './utils/socket.js';
import jwt from 'jsonwebtoken';
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);
// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = initSocket(server);

io.use((socket, next) => {
  const token = socket.handshake?.auth?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch (err) {
    return next();
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Cloudinary handles image storage (no local uploads folder).

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary is used for uploads (no local static uploads required)

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/rti', rtiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', communityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  Civic Integrity AI Backend Server                │
║  Port: ${PORT}                                         │
║  Environment: ${process.env.NODE_ENV || 'development'}                       │
║  API: http://localhost:${PORT}/api                │
║════════════════════════════════════════════════════╝
  `);
});

export default app;
