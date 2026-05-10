import express from "express";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-slides", aiController.generateSlides);
router.post("/generate", aiController.generateAnalysis);
router.post("/presentation", aiController.generatePresentation);

export default router;
