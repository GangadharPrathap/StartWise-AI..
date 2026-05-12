import express from "express";
import { getMentors } from "../services/mentorService.js";

const router = express.Router();

router.get("/:industry", async (req, res) => {
  try {
    const mentors = await getMentors(
      req.params.industry
    );

    res.json(mentors);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch mentors"
    });
  }
});

export default router;