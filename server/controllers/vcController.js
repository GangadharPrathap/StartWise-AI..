import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess, sendError } from "../utils/responseFormatter.js";
import * as aiService from "../services/geminiService.js";

export const processChat = catchAsync(async (req, res, next) => {
  const { message, context } = req.body;
  
  if (!message) {
    return sendError(res, "Message is required", 400);
  }

  const systemPrompt = "You are StartWise AI Co-Pilot, a world-class startup strategist and venture capital expert. Your goal is to help founders build billion-dollar companies. Provide deep, actionable insights on business models, unit economics, fundraising, and product-market fit. Be visionary yet practical. Use professional, encouraging language.";
  
  const aiResponse = await aiService.generateCompletion(systemPrompt, message, false);
  
  sendSuccess(res, { response: aiResponse }, "Chat processed successfully");
});

export const processVoice = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  // This would typically integrate with an STT/TTS service like ElevenLabs or OpenAI Whisper
  // For the hackathon/demo, we'll return a simulated URL or tell the client to use browser TTS
  sendSuccess(res, { useBrowserTTS: true, textToSpeak: text }, "Voice command processed");
});

export const getScore = catchAsync(async (req, res, next) => {
  const { pitchData } = req.body;
  
  if (!pitchData) {
    return sendError(res, "Pitch data is required", 400);
  }

  const systemPrompt = "You are a top-tier VC analyst. Score the following pitch deck data on a scale of 1-10 for Market, Team, and Product. Provide a brief feedback. Return ONLY valid JSON: {\"overallScore\": number, \"breakdown\": {\"market\": number, \"team\": number, \"product\": number}, \"feedback\": \"string\"}";
  
  const scoreDataStr = await aiService.generateCompletion(systemPrompt, JSON.stringify(pitchData), true);
  
  try {
    const scoreData = JSON.parse(scoreDataStr);
    sendSuccess(res, scoreData, "Pitch evaluated successfully");
  } catch (error) {
    sendError(res, "Failed to parse AI evaluation", 500);
  }
});
