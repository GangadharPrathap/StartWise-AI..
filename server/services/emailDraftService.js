import * as aiService from "./geminiService.js";

export async function generateEmailDraft(startupName, topic, city) {
  const systemPrompt = `You are an expert startup founder writing a cold email to a top tier venture capitalist.
Write a concise, compelling cold email (max 150 words) to introduce your startup.
Startup Name: ${startupName}
Industry: ${topic}
City: ${city}

Return ONLY valid JSON:
{
  "subject": "string",
  "body": "string"
}`;

  try {
    const dataStr = await aiService.generateCompletion(systemPrompt, `Generate draft for ${startupName}`, true);
    return JSON.parse(dataStr);
  } catch (error) {
    console.warn("Gemini generateEmailDraft failed, using mock:", error.message || error);
    return {
      subject: `Investment Opportunity: ${startupName} - Disrupting ${topic} in ${city}`,
      body: `Hi,\n\nI'm building ${startupName}, a ${topic} startup focused on ${city}. We are seeing massive growth in this sector and would love to discuss a potential investment.\n\nBest,\nFounder`
    };
  }
}
