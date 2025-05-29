// src/store/gameStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGameStore = create(
  persist(
    (set, get) => ({
      // Character State
      character: {
        name: "Alex Developer",
        age: 21,
        money: 1500,
        reputation: 45,
        energy: 75,
        skillPoints: 12,
        education: "high_school", // high_school, college, university, academy
        currentJob: null,
        jobPerformance: 0,
        avatar: {
          sex: "man",
          seed: "12345",
        },
      },

      // Game Setup
      gameSetup: {
        isCharacterCreated: false,
        gameStarted: false,
      },

      // Skills State
      skills: {
        learned: ["HTML", "CSS"],
        available: ["JavaScript", "React", "Python", "Node.js"],
        skillTree: {
          HTML: { cost: 0, learned: true, prerequisites: [] },
          CSS: { cost: 0, learned: true, prerequisites: [] },
          JavaScript: {
            cost: 3,
            learned: false,
            prerequisites: ["HTML", "CSS"],
          },
          React: { cost: 4, learned: false, prerequisites: ["JavaScript"] },
          Python: { cost: 4, learned: false, prerequisites: [] },
          "Node.js": { cost: 3, learned: false, prerequisites: ["JavaScript"] },
          // Add more skills...
        },
      },

      // Career State
      career: {
        currentPosition: null,
        experience: 0,
        availableJobs: [],
        applications: [],
        interviews: [],
      },

      // Business State
      business: {
        ownedBusinesses: [],
        products: [],
        ideas: [],
      },

      // Life State
      life: {
        housing: "basic_apartment",
        relationshipStatus: "single",
        pets: [],
        hobbies: [],
      },

      // Game Progress
      gameProgress: {
        currentDay: 1,
        achievements: [],
        completedGoals: [],
      },

      // Actions
      learnSkill: (skillName) => {
        const state = get();
        const skill = state.skills.skillTree[skillName];

        if (!skill || skill.learned) return false;
        if (state.character.skillPoints < skill.cost) return false;

        // Check prerequisites
        const hasPrereqs = skill.prerequisites.every(
          (req) => state.skills.skillTree[req]?.learned
        );
        if (!hasPrereqs) return false;

        set((state) => ({
          character: {
            ...state.character,
            skillPoints: state.character.skillPoints - skill.cost,
            reputation: state.character.reputation + 2,
          },
          skills: {
            ...state.skills,
            skillTree: {
              ...state.skills.skillTree,
              [skillName]: { ...skill, learned: true },
            },
            learned: [...state.skills.learned, skillName],
            available: state.skills.available.filter((s) => s !== skillName),
          },
        }));
        return true;
      },

      updateCharacter: (updates) =>
        set((state) => ({
          character: { ...state.character, ...updates },
        })),

      // Avatar Actions
      updateAvatar: (avatarConfig) =>
        set((state) => ({
          character: {
            ...state.character,
            avatar: { ...state.character.avatar, ...avatarConfig },
          },
        })),

      generateRandomAvatar: (sex) => {
        const randomSeed = String(Math.random());
        set((state) => ({
          character: {
            ...state.character,
            avatar: {
              sex: sex || state.character.avatar.sex,
              seed: randomSeed,
            },
          },
        }));
      },

      // Character Creation
      createCharacter: (characterData) =>
        set((state) => ({
          character: { ...state.character, ...characterData },
          gameSetup: {
            ...state.gameSetup,
            isCharacterCreated: true,
            gameStarted: true,
          },
        })),

      addMoney: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            money: state.character.money + amount,
          },
        })),

      spendMoney: (amount) => {
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

      restoreEnergy: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            energy: Math.min(100, state.character.energy + amount),
          },
        })),

      // Education Actions
      takeExam: (examType) => {
        // Logic for taking exams
        const state = get();
        const costs = {
          college: 200,
          university: 500,
          academy: 1000,
        };

        if (state.character.money >= costs[examType]) {
          set((state) => ({
            character: {
              ...state.character,
              money: state.character.money - costs[examType],
              education: examType,
              reputation: state.character.reputation + 10,
            },
          }));
          return true;
        }
        return false;
      },

      // Reset game
      resetGame: () =>
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
            avatar: {
              sex: "man",
              seed: "12345",
            },
          },
          gameSetup: {
            isCharacterCreated: false,
            gameStarted: false,
          },
          skills: {
            learned: ["HTML", "CSS"],
            available: ["JavaScript", "React", "Python", "Node.js"],
            skillTree: {
              HTML: { cost: 0, learned: true, prerequisites: [] },
              CSS: { cost: 0, learned: true, prerequisites: [] },
              JavaScript: {
                cost: 3,
                learned: false,
                prerequisites: ["HTML", "CSS"],
              },
              // ... reset all skills
            },
          },
          // Reset other states...
        })),
    }),
    {
      name: "web-dev-sim-storage",
      // Only persist certain parts of the state
      partialize: (state) => ({
        character: state.character,
        skills: state.skills,
        career: state.career,
        business: state.business,
        life: state.life,
        gameProgress: state.gameProgress,
        gameSetup: state.gameSetup,
      }),
    }
  )
);

export default useGameStore;
