import { apiClient } from '../utils/apiClient';

/**
 * Investor Service for Networking and Fundraising
 */
export const investorService = {
  /**
   * Finds nearby investors based on city
   */
  async findNearbyInvestors(city) {
    const response = await apiClient.post('/investors', { city });
    return response.status === 'success' ? response.data : response;
  }
};

export default investorService;
