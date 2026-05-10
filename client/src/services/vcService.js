import { apiClient } from '../utils/apiClient';

/**
 * VC Service for Simulator and Pitch Evaluation
 */
export const vcService = {
  /**
   * Starts a new VC session (initializes context)
   */
  async startVCSession() {
    // Currently sessions are client-side or implicit, but we can have an endpoint for this
    return { sessionId: Date.now(), status: 'active' };
  },

  /**
   * Sends a message to the AI VC
   * @param {string} message 
   * @param {Array} context 
   */
  async sendVCMessage(message, context) {
    const response = await apiClient.post('/vc-chat', { message, context });
    return response.status === 'success' ? response.data.response : response;
  },

  /**
   * Evaluates a pitch deck or session
   * @param {Object} pitchData 
   */
  async evaluatePitch(pitchData) {
    const response = await apiClient.post('/vc-score', { pitchData });
    return response.status === 'success' ? response.data : response;
  }
};

export default vcService;
