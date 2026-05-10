import vcConversationService from "../services/vcConversationService.js";
import vcScoringService from "../services/vcScoringService.js";
import sarvamService from "../services/sarvamService.js";
import vcPromptService from "../services/vcPromptService.js";

/**
 * VC Controller: Unified API for Simulator Sessions
 */
export const vcController = {
  /**
   * Start Session: POST /api/vc/start-session
   */
  async startSession(req, res, next) {
    try {
      const { persona } = req.body;
      const initialData = await vcConversationService.startSession(persona);
      res.json({ status: 'success', data: initialData });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Chat: POST /api/vc/chat
   */
  async processChat(req, res, next) {
    try {
      const { message, history, persona } = req.body;
      const aiData = await vcConversationService.processChat(message, history, persona);
      res.json({ status: 'success', data: aiData });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Evaluate: POST /api/vc/evaluate
   */
  async evaluate(req, res, next) {
    try {
      const { history, persona } = req.body;
      const personaName = vcPromptService.personas[persona]?.name || "Senior VC";
      const evaluation = await vcScoringService.evaluate(history, personaName);
      res.json({ status: 'success', data: evaluation });
    } catch (error) {
      next(error);
    }
  },

  /**
   * STT: POST /api/vc/speech-to-text
   */
  async processSpeechToText(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No audio file provided' });
      }
      const transcript = await sarvamService.speechToText(req.file.path);
      res.json({ status: 'success', data: { transcript } });
    } catch (error) {
      next(error);
    }
  },

  /**
   * TTS: POST /api/vc/text-to-speech
   */
  async processTextToSpeech(req, res, next) {
    try {
      const { text, language, persona } = req.body;
      const speaker = vcPromptService.personas[persona]?.speaker || 'meera';
      const audioData = await sarvamService.textToSpeech(text, language, speaker);
      res.json({ status: 'success', data: audioData });
    } catch (error) {
      next(error);
    }
  }
};

export default vcController;
