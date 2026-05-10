import { create } from 'zustand';

/**
 * User Store for Authentication and Preferences
 */
export const useUserStore = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  preferences: {
    theme: 'dark',
    notifications: true,
  },

  setUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
  setPreferences: (prefs) => set((state) => ({ 
    preferences: { ...state.preferences, ...prefs } 
  })),
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
