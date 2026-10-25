import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

import authRoutes from './routes/auth';
import listingsRoutes from './routes/listings';
import favouritesRoutes from './routes/favourites';
import enquiriesRoutes from './routes/enquiries';
import reportsRoutes from './routes/reports';
import usersRoutes from './routes/users';
import analyticsRoutes from './routes/analytics';
import { errorHandler, notFoundHandler } from './middleware/error';

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Vite dev server compatibility
  })
);

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: isProd ? false : [corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

// Request body size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for auth endpoints (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Serve uploaded files safely
const uploadsPath = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/favourites', favouritesRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PlayAgain Sports Marketplace API',
    version: '1.0.0',
  });
});

// Serve client in production
if (isProd) {
  const clientDistPath = path.resolve(__dirname, '../../dist');
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  PlayAgain Sports Marketplace Backend Running `);
    console.log(`  URL: http://localhost:${PORT}                 `);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

export default app;
