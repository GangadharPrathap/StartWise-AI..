import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { PORT, APP_HOSTNAME } from "./config/env.js";
import aiRoutes from "./routes/aiRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import vcRoutes from "./routes/vcRoutes.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(requestLogger);

  // Security headers for production
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://apis.google.com", "https://*.firebaseapp.com"],
          "img-src": ["'self'", "data:", "https:", "http:", "https://*.tile.openstreetmap.org", "https://*.google.com", "https://*.googleusercontent.com"],
          "connect-src": ["'self'", "https:", "http:", "ws:", "wss:", "https://*.googleapis.com", "https://*.firebaseapp.com"],
          "frame-src": ["'self'", "https://*.firebaseapp.com"],
        },
      },
    })
  );

  // Rate limiting to prevent API abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiter to API routes only
  app.use("/api/", limiter);

  // Debug route
  app.get("/api/debug-env", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Routes
  app.use("/api/ai", aiRoutes);
  app.use("/api/email", emailRoutes);
  app.use("/api/meetings", meetingRoutes);
  app.use("/api/vc", vcRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://${APP_HOSTNAME}:${PORT}`);
  });
}

startServer();
