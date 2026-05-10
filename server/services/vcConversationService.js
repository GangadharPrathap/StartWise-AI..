import * as aiService from "./geminiService.js";
import vcPromptService from "./vcPromptService.js";

/**
 * VC Conversation Service: Handles modular session logic and context-aware chat
 */
export const vcConversationService = {
  /**
   * Initializes a new session with a starting question
   */
  async startSession(personaKey = 'yc') {
    const persona = vcPromptService.personas[personaKey] || vcPromptService.personas.yc;
    const systemPrompt = vcPromptService.getSystemPrompt(personaKey);
    const initialPrompt = `Start the meeting. Introduce yourself briefly as ${persona.name} and ask the founder to pitch their core idea and unique insight in one sentence.`;
    
    try {
      const responseStr = await aiService.generateCompletion(systemPrompt, initialPrompt, true);
      return JSON.parse(responseStr);
    } catch (error) {
      console.error("Start Session Error:", error);
      return { 
        response: `Hello. I'm ${persona.name}. Let's get straight to it. What are you building and why does the world need it right now?`,
        tone: "Direct",
        confidence: 50,
        metrics: { market: 5, product: 5, team: 5 }
      };
    }
  },

  /**
   * Processes ongoing chat with context memory
   */
  async processChat(message, history = [], personaKey = 'yc') {
    const systemPrompt = vcPromptService.getSystemPrompt(personaKey);
    
    const context = history.slice(-6).map(h => `${h.role === 'user' ? 'Founder' : 'Investor'}: ${h.content}`).join('\n');
    const prompt = `Conversation Context:\n${context}\n\nFounder's new response: ${message}\n\nAnalyze the response, identify gaps, and respond as the investor. Remember to return JSON.`;
    
    try {
      const responseStr = await aiService.generateCompletion(systemPrompt, prompt, true);
      const parsed = JSON.parse(responseStr);
      
      // Clean up response if it has "Investor:" prefix which sometimes Gemini adds
      if (parsed.response && parsed.response.startsWith('Investor:')) {
        parsed.response = parsed.response.replace('Investor:', '').trim();
      }
      
      return parsed;
    } catch (error) {
      console.error("VC Chat Error:", error);
      return {
        response: "I'm not sure I follow. Can you be more specific about your distribution channel?",
        tone: "Skeptical",
        confidence: 40,
        metrics: { market: 5, product: 5, team: 5 }
      };
    }
  }
};

export default vcConversationService;
