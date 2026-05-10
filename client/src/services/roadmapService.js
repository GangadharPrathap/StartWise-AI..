import { apiClient } from '../utils/apiClient';

/**
 * Roadmap Service for Execution Plans
 */
export const roadmapService = {
  /**
   * Generates a startup roadmap based on idea and skills
   */
  async generateRoadmap(roadmapData) {
    const response = await apiClient.post('/roadmap', roadmapData);
    return response; // Backend returns roadmap object directly or via status
  },

  /**
   * Suggests domains/skills for a startup idea
   */
  async suggestDomains(idea_text) {
    const response = await apiClient.post('/suggest-domains', { idea_text });
    return response;
  },

  /**
   * Updates progress of a roadmap task
   */
  async updateProgress(roadmapId, taskId, status) {
    return apiClient.put(`/roadmap/${roadmapId}/task/${taskId}`, { status });
  }
};

export default roadmapService;
