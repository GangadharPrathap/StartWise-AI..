import { apiClient } from '../utils/apiClient';

/**
 * AI Service for Idea Analysis and Market Insights
 */
export const aiService = {
  /**
   * Analyzes a startup idea for a specific city
   * @param {string} idea 
   * @param {string} city 
   */
  async analyzeIdea(idea, city) {
    const response = await apiClient.post('/analyze', { idea, city });
    // Normalize response to return data directly if status is success
    return response.status === 'success' ? response.data : response;
  },

  /**
   * Fetches market insights (currently part of analysis, but scalable for separate calls)
   */
  async getMarketInsights(idea, city) {
    // For now, this could be the same as analyzeIdea or a more specific endpoint
    const response = await apiClient.post('/market-insights', { idea, city });
    return response.status === 'success' ? response.data : response;
  },

  /**
   * Generates a detailed execution roadmap
   */
  async generateRoadmap(data) {
    const response = await apiClient.post('/roadmap', data);
    // Note: generateRoadmap controller doesn't use sendSuccess wrapper yet, so it returns data directly
    return response.status === 'success' ? response.data : response;
  }
};

// Also export as default for flexibility
export default aiService;
