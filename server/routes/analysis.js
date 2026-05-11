import express from "express";
import { prisma } from "../lib/prisma.js";
import { analyzeStartup } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      startupId,
      title,
      description,
      industry
    } = req.body;

    const analysisResult = await analyzeStartup({
      title,
      description,
      industry
    });

    const savedAnalysis =
      await prisma.analysis.create({
        data: {
          startupId,
          content: {
            result: analysisResult
          }
        }
      });

    res.json(savedAnalysis);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI Analysis Failed"
    });
  }
});

export default router;