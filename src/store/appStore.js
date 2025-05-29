// src/store/appStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAppStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // LANGUAGE STATE
      // ==========================================
      language: "en",

      // ==========================================
      // GAME SETUP
      // ==========================================
      gameSetup: {
        isCharacterCreated: false,
        gameStarted: false,
        currentDay: 1,
        gameSpeed: 1, // Multiplier for time progression
      },

      // ==========================================
      // LANGUAGE ACTIONS
      // ==========================================
      setLanguage: (languageCode) =>
        set(() => ({
          language: languageCode,
        })),

      // ==========================================
      // GAME SETUP ACTIONS
      // ==========================================
      setCharacterCreated: (isCreated) =>
        set((state) => ({
          gameSetup: {
            ...state.gameSetup,
            isCharacterCreated: isCreated,
            gameStarted: isCreated,
          },
        })),

      setGameSpeed: (speed) =>
        set((state) => ({
          gameSetup: {
            ...state.gameSetup,
            gameSpeed: Math.max(0.5, Math.min(3, speed)), // Clamp between 0.5x and 3x
          },
        })),

      advanceDay: () => {
        set((state) => ({
          gameSetup: {
            ...state.gameSetup,
            currentDay: state.gameSetup.currentDay + 1,
          },
        }));

        // Trigger day advancement in other stores
        // This will be handled by components or a separate game loop
      },

      // ==========================================
      // GAME MANAGEMENT
      // ==========================================
      resetGame: () =>
        set(() => ({
          language: "en",
          gameSetup: {
            isCharacterCreated: false,
            gameStarted: false,
            currentDay: 1,
            gameSpeed: 1,
          },
        })),
    }),
    {
      name: "web-dev-sim-app",
      partialize: (state) => ({
        language: state.language,
        gameSetup: state.gameSetup,
      }),
    }
  )
);

export default useAppStore;
