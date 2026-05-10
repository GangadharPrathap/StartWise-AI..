import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Hook for managing investor search and mapping
 */
export function useInvestorSearch() {
  const store = useAppStore();
  const [mapType, setMapType] = useState('roadmap');
  
  const cityCoords = {
    "Delhi NCR": [28.6139, 77.2090],
    "Mumbai": [19.0760, 72.8777],
    "Bangalore": [12.9716, 77.5946],
    "Hyderabad": [17.3850, 78.4867],
    "Pune": [18.5204, 73.8567],
    "Chennai": [13.0827, 80.2707]
  };

  const cities = ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai"];

  return {
    selectedCity: store.selectedCity,
    setSelectedCity: store.setSelectedCity,
    selectedInvestor: store.selectedInvestor,
    setSelectedInvestor: store.setSelectedInvestor,
    setSelectedInvestorForMeeting: store.setSelectedInvestorForMeeting,
    cities,
    cityCoords,
    mapType,
    setMapType
  };
}
