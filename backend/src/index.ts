import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import orgRoutes from './routes/organizations';
import menuRoutes from './routes/menu';
import inventoryRoutes from './routes/inventory';
import posRoutes from './routes/pos';
import loyaltyRoutes from './routes/loyalty';
import subscriptionRoutes from './routes/subscriptions';
import staffRoutes from './routes/staff';
import syncRoutes from './routes/sync';
import reportsRoutes from './routes/reports';
import webhookRoutes from './routes/webhooks';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { validateOrganization } from './middleware/organization';

// Import services
import { initializeDatabase } from './services/database';
import { initializeWebSockets } from './services/websocket';
import { initializeCronJobs } from './services/cron';
import { initializeStripe } from './services/stripe';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Organization-ID'],
}));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', authMiddleware, validateOrganization, orgRoutes);
app.use('/api/menu', authMiddleware, validateOrganization, menuRoutes);
app.use('/api/inventory', authMiddleware, validateOrganization, inventoryRoutes);
app.use('/api/pos', authMiddleware, validateOrganization, posRoutes);
app.use('/api/loyalty', authMiddleware, validateOrganization, loyaltyRoutes);
app.use('/api/subscriptions', authMiddleware, validateOrganization, subscriptionRoutes);
app.use('/api/staff', authMiddleware, validateOrganization, staffRoutes);
app.use('/api/sync', authMiddleware, validateOrganization, syncRoutes);
app.use('/api/reports', authMiddleware, validateOrganization, reportsRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize services
async function initializeApp() {
  try {
    console.log('🚀 Initializing Barback Pro Backend...');

    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Initialize WebSocket server
    initializeWebSockets(io);
    console.log('✅ WebSocket server initialized');

    // Initialize Stripe
    initializeStripe();
    console.log('✅ Stripe initialized');

    // Initialize cron jobs
    initializeCronJobs();
    console.log('✅ Cron jobs initialized');

    // Start server
    server.listen(PORT, () => {
      console.log(`🎉 Barback Pro Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📚 API Documentation:');
        console.log('  - Auth: POST /api/auth/login, POST /api/auth/register');
        console.log('  - Organizations: GET /api/organizations, POST /api/organizations');
        console.log('  - Menu: GET /api/menu, POST /api/menu');
        console.log('  - Inventory: GET /api/inventory, POST /api/inventory/receive');
        console.log('  - POS: POST /api/pos/orders, GET /api/pos/orders');
        console.log('  - Loyalty: POST /api/loyalty/earn, POST /api/loyalty/redeem');
        console.log('  - Staff: GET /api/staff, POST /api/staff/shifts');
        console.log('  - Reports: GET /api/reports/sales, GET /api/reports/inventory');
        console.log('  - Sync: POST /api/sync');
      }
    });

  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
initializeApp();

export { app, server, io };