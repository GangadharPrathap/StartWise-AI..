import express from "express";
import * as aiController from "../controllers/aiController.js";
import * as emailController from "../controllers/emailController.js";
import meetingRoutes from "./meetingRoutes.js";
import vcRoutes from "./vcRoutes.js";

const router = express.Router();

// AI & Analysis Endpoints
router.post("/analyze", aiController.generateAnalysis);
router.post("/roadmap", aiController.generateRoadmap);
router.post("/pitch-deck", aiController.generatePresentation);
router.post("/generate-slides", aiController.generateSlides);
router.post("/suggest-domains", aiController.suggestDomains);

// VC Simulator Endpoints
router.use("/vc", vcRoutes);

// Email Endpoints
router.post("/email-draft", async (req, res, next) => {
  res.json({ status: "success", data: { subject: "Startup Intro", body: "Hello Investor..." } });
});
router.post("/email-send", emailController.sendEmail);

// Investor Endpoints
router.post("/investors", (req, res) => {
  res.json({ status: "success", data: [
    { name: "Sequoia Surge", city: req.body.city || "Bangalore" },
    { name: "Nexus Venture Partners", city: req.body.city || "Bangalore" }
  ]});
});

// Meetings
router.use("/meetings", meetingRoutes);

// Auth (Mocks for now)
router.post("/auth/login", (req, res) => {
  res.json({ status: "success", data: { user: { name: "Demo User" }, token: "demo-token" } });
});
router.post("/auth/signup", (req, res) => {
  res.json({ status: "success", data: { user: { name: req.body.name }, token: "demo-token" } });
});

export default router;
