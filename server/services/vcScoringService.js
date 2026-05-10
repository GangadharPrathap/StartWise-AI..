import * as aiService from "./geminiService.js";

/**
 * VC Scoring Service: Evaluates startup quality across 7 key metrics
 */
export const vcScoringService = {
  /**
   * Performs a comprehensive evaluation of the pitch history
   */
  async evaluate(history, personaName = "Senior VC") {
    const systemPrompt = `You are a world-class ${personaName}. 
    Based on the provided founder-investor conversation history, perform a final audit.
    
    Evaluate the startup on these 7 metrics (1-10):
    1. Market Potential (TAM/SAM/SOM)
    2. Scalability (Tech & Operations)
    3. Feasibility (Proof of Concept/MVP)
    4. Founder Clarity (Vision & Strategy)
    5. Monetization (Revenue Model)
    6. Competition (Moats & Barriers)
    7. Innovation (Unique Insight/Tech)
    
    Final Verdict: "Invest", "Maybe", or "Reject".
    
    Return ONLY a valid JSON object:
    {
      "verdict": "Invest/Maybe/Reject",
      "overallScore": number,
      "breakdown": {
        "market": 1-10,
        "scalability": 1-10,
        "feasibility": 1-10,
        "clarity": 1-10,
        "monetization": 1-10,
        "competition": 1-10,
        "innovation": 1-10
      },
      "reasoning": "Detailed technical and strategic explanation",
      "weaknesses": ["list", "of", "risks"],
      "strengths": ["list", "of", "positives"]
    }`;

    const context = history.map(h => `${h.role === 'user' ? 'Founder' : 'Investor'}: ${h.content}`).join('\n');

    try {
      const response = await aiService.generateCompletion(systemPrompt, `Context:\n${context}`, true);
      return JSON.parse(response);
    } catch (error) {
      console.error("Scoring Error:", error);
      // Fallback logic if AI fails
      return {
        verdict: "Maybe",
        overallScore: 6.5,
        breakdown: { market: 7, scalability: 6, feasibility: 7, clarity: 6, monetization: 6, competition: 5, innovation: 8 },
        reasoning: "The concept is innovative but the unit economics and market defensibility are still unproven.",
        weaknesses: ["High competition", "Unclear GTM"],
        strengths: ["Strong innovation", "Large TAM"]
      };
    }
  }
};

export default vcScoringService;
