/**
 * Main Express Application Server
 * Project: CHECK MY LINK - Mobile Security Phishing Link Checker
 * Developer: Krishan Kumar Verma
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const scanRoutes = require('./routes/scanRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectDB();

// 1. Security Headers via Helmet (with relaxed CSP for fonts/inline styles)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5500,http://localhost:5500,http://localhost:3000,http://localhost:5000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local college viva demo
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parser Middleware
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// 4. Rate Limiting to Prevent Abuse & Denial of Service
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: {
    success: false,
    error: 'RateLimitExceeded',
    message: 'Too many link scan requests from this IP address. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 5. Serve Frontend Static Assets directly from server (dual-mode support)
const frontendPath = path.join(__dirname, '..', 'FRONTEND');
app.use(express.static(frontendPath));

// 6. API Routes
app.use('/api', scanRoutes);

// Root route fallback: serves FRONTEND index.html if present, else JSON welcome
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.json({
        name: 'CHECK MY LINK API',
        developer: 'Krishan Kumar Verma',
        version: '1.0.0',
        documentation: 'Visit /api/health or POST /api/scan',
      });
    }
  });
});

// 7. Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🛡️  CHECK MY LINK - Cybersecurity Backend Running`);
  console.log(`👨‍💻  Developer: Krishan Kumar Verma`);
  console.log(`🚀  Port: ${PORT}`);
  console.log(`🌐  Local URL: http://localhost:${PORT}`);
  console.log(`🔍  Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

// Graceful process termination handling
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('[SERVER] Process terminated.');
  });
});
