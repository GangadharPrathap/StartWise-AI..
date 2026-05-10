import { apiClient } from '../utils/apiClient';

/**
 * Email Service for Investor Communication
 */
export const emailService = {
  /**
   * Generates a cold email draft for investors
   */
  async generateInvestorEmail(startupName, topic, city) {
    const response = await apiClient.post('/email-draft', { startupName, topic, city });
    return response.status === 'success' ? response.data : response;
  },

  /**
   * Sends a generated email
   */
  async sendEmail(to, subject, body) {
    const response = await apiClient.post('/email-send', { to, subject, body });
    return response.status === 'success' ? response.data : response;
  }
};

export default emailService;
