// src/store/characterStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCharacterStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // CHARACTER STATE
      // ==========================================
      character: {
        name: "Developer X",
        age: 21,
        money: 100,
        reputation: 10,
        energy: 75,
        skillPoints: 12,
        education: "high_school", // high_school, college, university, academy
        currentJob: null,
        jobPerformance: 0,
        gender: "male", // male or female - for gameplay mechanics
        avatar: {
          seed: "Alex Developer",
          backgroundColor: ["ffd93d"],
          primaryColor: ["6bcf7f"],
        },
        // Character Skills (affects gameplay bonuses)
        characterSkills: {
          technical: 3, // Affects coding speed, quality, and skill point gain
          business: 2, // Bonuses in business ventures and monetization
          social: 2, // Job interviews, salary negotiation, dating
          creativity: 3, // Better product ideas and success probability
        },
      },

      // ==========================================
      // CHARACTER ACTIONS
      // ==========================================
      updateCharacter: (updates) =>
        set((state) => ({
          character: { ...state.character, ...updates },
        })),

      updateCharacterSkill: (skillName, value) =>
        set((state) => ({
          character: {
            ...state.character,
            characterSkills: {
              ...state.character.characterSkills,
              [skillName]: Math.max(1, Math.min(10, value)), // Clamp between 1-10
            },
          },
        })),

      // ==========================================
      // AVATAR ACTIONS
      // ==========================================
      updateAvatar: (avatarConfig) =>
        set((state) => ({
          character: {
            ...state.character,
            avatar: { ...state.character.avatar, ...avatarConfig },
          },
        })),

      generateRandomAvatar: () => {
        const backgroundColors = [
          "ffd93d",
          "6bcf7f",
          "ffb3ba",
          "bae1ff",
          "ffffba",
          "ffdfba",
          "c7ceea",
          "b5ead7",
          "ffc9de",
          "ff9aa2",
        ];

        const primaryColors = [
          "ff6b6b",
          "4ecdc4",
          "45b7d1",
          "f9ca24",
          "f0932b",
          "eb4d4b",
          "6c5ce7",
          "a29bfe",
          "fd79a8",
          "00b894",
        ];

        const getRandomElement = (array) =>
          array[Math.floor(Math.random() * array.length)];

        set((state) => ({
          character: {
            ...state.character,
            avatar: {
              ...state.character.avatar,
              seed: `avatar-${Date.now()}-${Math.random()}`,
              backgroundColor: [getRandomElement(backgroundColors)],
              primaryColor: [getRandomElement(primaryColors)],
            },
          },
        }));
      },

      // ==========================================
      // CHARACTER CREATION
      // ==========================================
      createCharacter: (characterData) =>
        set((state) => ({
          character: {
            ...state.character,
            ...characterData,
            avatar: {
              ...state.character.avatar,
              ...characterData.avatar,
            },
          },
        })),

      // ==========================================
      // MONEY MANAGEMENT
      // ==========================================
      addMoney: (amount, source = "unknown") => {
        set((state) => ({
          character: {
            ...state.character,
            money: state.character.money + amount,
          },
        }));

        // Check for millionaire achievement through progress store
        const newState = get();
        if (newState.character.money >= 1000000) {
          // This would be handled by progress store
          console.log("Millionaire achievement unlocked!");
        }
      },

      spendMoney: (amount, purpose = "unknown") => {
        const state = get();
        if (state.character.money >= amount) {
          set((state) => ({
            character: {
              ...state.character,
              money: state.character.money - amount,
            },
          }));
          return true;
        }
        return false;
      },

      // ==========================================
      // ENERGY SYSTEM
      // ==========================================
      restoreEnergy: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            energy: Math.min(100, state.character.energy + amount),
          },
        })),

      consumeEnergy: (amount) => {
        const state = get();
        const newEnergy = Math.max(0, state.character.energy - amount);

        set((state) => ({
          character: {
            ...state.character,
            energy: newEnergy,
          },
        }));

        return newEnergy > 0; // Return true if has energy left
      },

      // ==========================================
      // SKILL POINTS MANAGEMENT
      // ==========================================
      addSkillPoints: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            skillPoints: state.character.skillPoints + amount,
          },
        })),

      spendSkillPoints: (amount) => {
        const state = get();
        if (state.character.skillPoints >= amount) {
          set((state) => ({
            character: {
              ...state.character,
              skillPoints: state.character.skillPoints - amount,
            },
          }));
          return true;
        }
        return false;
      },

      // ==========================================
      // REPUTATION MANAGEMENT
      // ==========================================
      addReputation: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            reputation: Math.min(100, state.character.reputation + amount),
          },
        })),

      // ==========================================
      // EDUCATION MANAGEMENT
      // ==========================================
      setEducation: (educationLevel) =>
        set((state) => ({
          character: {
            ...state.character,
            education: educationLevel,
          },
        })),

      // ==========================================
      // JOB MANAGEMENT
      // ==========================================
      setCurrentJob: (jobId) =>
        set((state) => ({
          character: {
            ...state.character,
            currentJob: jobId,
          },
        })),

      // ==========================================
      // RESET CHARACTER
      // ==========================================
      resetCharacter: () =>
        set(() => ({
          character: {
            name: "Alex Developer",
            age: 21,
            money: 1500,
            reputation: 45,
            energy: 75,
            skillPoints: 12,
            education: "high_school",
            currentJob: null,
            jobPerformance: 0,
            gender: "male",
            avatar: {
              seed: "Alex Developer",
              backgroundColor: ["ffd93d"],
              primaryColor: ["6bcf7f"],
            },
            characterSkills: {
              technical: 3,
              business: 2,
              social: 2,
              creativity: 3,
            },
          },
        })),

      // ==========================================
      // DEBUG METHODS (for development)
      // ==========================================
      debug: {
        addMoney: (amount) => get().addMoney(amount, "debug"),
        addSkillPoints: (amount) => get().addSkillPoints(amount),
        setEnergy: (amount) =>
          set((state) => ({
            character: {
              ...state.character,
              energy: Math.max(0, Math.min(100, amount)),
            },
          })),
        setReputation: (amount) =>
          set((state) => ({
            character: {
              ...state.character,
              reputation: Math.max(0, Math.min(100, amount)),
            },
          })),
      },
    }),
    {
      name: "web-dev-sim-character",
      partialize: (state) => ({
        character: state.character,
      }),
    }
  )
);

export default useCharacterStore;
