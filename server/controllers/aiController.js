import * as aiService from "../services/geminiService.js";
import * as aiLogicService from "../services/aiLogicService.js";
import { GEMINI_API_KEY } from "../config/env.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess, sendError } from "../utils/responseFormatter.js";

export const generateSlides = catchAsync(async (req, res, next) => {
  const { idea, currentSlidesCount, additionalCount } = req.body;

  if (!GEMINI_API_KEY) {
    return sendError(res, "Gemini API key is not configured", 500);
  }

  const systemPrompt = `You are an expert startup pitch deck consultant.
Generate ${additionalCount} additional pitch deck slides for the given startup idea, starting from slide number ${currentSlidesCount + 1}.
Return ONLY valid JSON (no extra text) with this exact structure:
{
  "pitchSlides": [
    {"slideNumber": number, "title": "string", "content": "string"}
  ]
}`;

  const dataStr = await aiService.generateCompletion(systemPrompt, `Idea: ${idea}`);
  const data = JSON.parse(dataStr);
  sendSuccess(res, data, "Slides generated successfully");
});

export const generateAnalysis = catchAsync(async (req, res, next) => {
  const { idea, city } = req.body;

  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key is missing. Falling back to mock generation.");
    const mockData = aiLogicService.generateMockDashboard(idea, city);
    return sendSuccess(res, mockData, "Mock analysis generated");
  }

  const systemPrompt = `You are an expert startup analyst for the Indian market.
Analyze the given startup idea for the city of ${city} and return ONLY valid JSON (no extra text) with this exact structure:
{
  "marketSize": "string (e.g. '$2.4B')",
  "marketAnalysisDetails": "string (detailed analysis of the market)",
  "competitors": [{"name": "string", "description": "string"}],
  "opportunityScore": number (1-10),
  "targetCustomer": "string",
  "revenueModel": "string",
  "pitchSlides": [
    {"slideNumber": number, "title": "string", "content": "string"}
  ],
  "investorEmail": {
    "subject": "string",
    "body": "string (professional 150-word email)"
  },
  "localInvestors": [{"name": "string", "address": "string", "uri": "string", "lat": number, "lng": number}]
}`;

  const dataStr = await aiService.generateCompletion(systemPrompt, `Idea: ${idea}\nCity: ${city}`);
  const data = JSON.parse(dataStr);
  sendSuccess(res, data, "Analysis generated successfully");
});

export const generatePresentation = catchAsync(async (req, res, next) => {
  const { idea, slideCount, theme, language, type } = req.body;
  const data = aiLogicService.generatePresentationContent(idea, slideCount, theme, language, type);
  sendSuccess(res, data, "Presentation generated successfully");
});
