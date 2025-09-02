// Load environment variables first
import { config } from 'dotenv';
config();

import express from 'express';
import { registerRoutes } from './server/routes.js';
import { setupVite, serveStatic, log } from './server/vite.js';
import { connectDB, initializeDatabase } from './server/db.js';
import { storage } from './server/storage.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database connection
  await connectDB();
  await initializeDatabase();
  
  // Register API routes
  registerRoutes(app);

  // Setup Vite for development or serve static files for production
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    await setupVite(app);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});