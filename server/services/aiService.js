import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function analyzeStartup(data) {
  try {
    const prompt = `
You are a world-class startup strategist and VC analyst.

Analyze this startup idea in detail.

Startup Title:
${data.title}

Description:
${data.description}

Industry:
${data.industry}

Provide:
1. Market Validation
2. Competitor Analysis
3. SWOT Analysis
4. Monetization Strategy
5. AI Startup Score (out of 100)
6. Execution Roadmap
7. Funding Potential
8. Present Market Trend Fit

Format the response professionally with headings.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response;

  } catch (error) {
    console.error("Gemini AI Error:", error);

    throw new Error("AI Analysis Failed");
  }
}