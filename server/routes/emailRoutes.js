import express from "express";
import * as emailController from "../controllers/emailController.js";

const router = express.Router();

router.post("/send-email", emailController.sendEmail);

export default router;
