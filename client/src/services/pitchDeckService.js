import { apiClient } from '../utils/apiClient';

/**
 * Pitch Deck Service for Presentation Generation
 */
export const pitchDeckService = {
  /**
   * Generates pitch deck content from an idea
   */
  async generatePitchDeck(idea, slideCount, theme, language, type) {
    const response = await apiClient.post('/pitch-deck', { idea, slideCount, theme, language, type });
    return response.status === 'success' ? response.data : response;
  },

  /**
   * Generates additional slides for an existing deck
   */
  async generateAdditionalSlides(idea, currentSlidesCount, additionalCount) {
    const response = await apiClient.post('/generate-slides', { idea, currentSlidesCount, additionalCount });
    return response.status === 'success' ? response.data : response;
  }
};

export default pitchDeckService;
