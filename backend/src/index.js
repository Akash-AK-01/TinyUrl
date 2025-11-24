import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from '../db/connection.js';
import linksRouter from '../routes/links.js';
import { incrementClickCount, getLinkByCode } from '../models/Link.js';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/links', linksRouter);

// Redirect endpoint - must be after /api routes
app.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    // Skip redirect for reserved paths
    const reservedPaths = ['healthz', 'api', 'code'];
    if (reservedPaths.includes(code)) {
      return next();
    }

    // Validate code format (6-8 alphanumeric)
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    if (!codeRegex.test(code)) {
      return next(); // Let frontend handle it
    }

    const link = await getLinkByCode(code);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Increment click count
    await incrementClickCount(code);

    // Perform 302 redirect
    res.redirect(302, link.target_url);
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${BASE_URL}`);
      console.log(`📊 Health check: ${BASE_URL}/healthz`);
      console.log(`💾 Database: configured`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    const { default: prisma } = await import('../db/connection.js');
    if (prisma && prisma.$disconnect) await prisma.$disconnect();
  } catch (e) {
    // ignore
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    const { default: prisma } = await import('../db/connection.js');
    if (prisma && prisma.$disconnect) await prisma.$disconnect();
  } catch (e) {
    // ignore
  }
  process.exit(0);
});

startServer();
