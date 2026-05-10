import express from "express";
import * as meetingController from "../controllers/meetingController.js";

const router = express.Router();

router.post("/generate-link", meetingController.generateMeetingLink);

export default router;
