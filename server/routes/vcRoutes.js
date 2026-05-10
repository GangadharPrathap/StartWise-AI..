import express from "express";
import * as vcController from "../controllers/vcController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// You can apply requireAuth middleware to protect these routes
router.post("/chat", vcController.processChat);
router.post("/voice", vcController.processVoice);
router.post("/score", vcController.getScore);

export default router;
