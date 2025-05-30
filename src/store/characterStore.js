// Enhanced Character Store with Character Skill Progression
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
        money: 1500,
        reputation: 10,
        energy: 75,
        skillPoints: 12, // For learning technical skills (JS, React, etc.)
        education: "none",
        currentJob: null,
        jobPerformance: 0,
        gender: "male",
        avatar: {
          seed: "Alex Developer",
          backgroundColor: ["ffd93d"],
          primaryColor: ["6bcf7f"],
        },
        // Character Skills (affects gameplay bonuses)
        characterSkills: {
          technical: 3,
          business: 2,
          social: 2,
          creativity: 3,
        },
        // NEW: Available character skill points to distribute
        availableCharacterSkillPoints: 0,
        // Track progression sources
        skillProgression: {
          educationBonusesReceived: [],
          jobExperienceGained: {
            technical: 0,
            business: 0,
            social: 0,
            creativity: 0,
          },
          achievementsUnlocked: [],
        },
      },

      // ==========================================
      // CHARACTER SKILL PROGRESSION METHODS
      // ==========================================

      // Add character skill points from various sources
      addCharacterSkillPoints: (amount, source = "unknown") => {
        set((state) => ({
          character: {
            ...state.character,
            availableCharacterSkillPoints:
              state.character.availableCharacterSkillPoints + amount,
          },
        }));

        console.log(`+${amount} Character Skill Points from ${source}`);
        return amount;
      },

      // Spend character skill points to improve a character skill
      improveCharacterSkill: (skillName, pointsToSpend = 1) => {
        const state = get();
        const currentSkill = state.character.characterSkills[skillName];
        const availablePoints = state.character.availableCharacterSkillPoints;

        // Validation
        if (availablePoints < pointsToSpend) return false;
        if (currentSkill >= 10) return false; // Max skill level
        if (
          !["technical", "business", "social", "creativity"].includes(skillName)
        )
          return false;

        // Apply improvement
        set((state) => ({
          character: {
            ...state.character,
            characterSkills: {
              ...state.character.characterSkills,
              [skillName]: Math.min(10, currentSkill + pointsToSpend),
            },
            availableCharacterSkillPoints: availablePoints - pointsToSpend,
          },
        }));

        return true;
      },

      // ==========================================
      // EDUCATION PROGRESSION BONUSES
      // ==========================================

      // Enhanced takeExam method with character skill bonuses
      takeExam: (examType, cost) => {
        const state = get();

        if (state.character.money < cost) return false;

        const currentEducation = state.character.education;
        const validProgressions = {
          none: "high_school",
          high_school: "college",
          college: "university",
          university: "academy",
        };

        if (validProgressions[currentEducation] !== examType) return false;

        const success = get().spendMoney(cost, `education_${examType}`);
        if (success) {
          get().setEducation(examType);

          // Education reputation bonuses
          const reputationBonuses = {
            high_school: 10,
            college: 15,
            university: 25,
            academy: 40,
          };

          // NEW: Character skill point bonuses from education
          const characterSkillBonuses = {
            high_school: 1,
            college: 2,
            university: 3,
            academy: 5,
          };

          get().addReputation(reputationBonuses[examType] || 0);

          // Add character skill points and track the bonus
          const skillBonus = characterSkillBonuses[examType] || 0;
          if (skillBonus > 0) {
            get().addCharacterSkillPoints(skillBonus, `education_${examType}`);

            // Track this education bonus
            set((state) => ({
              character: {
                ...state.character,
                skillProgression: {
                  ...state.character.skillProgression,
                  educationBonusesReceived: [
                    ...state.character.skillProgression
                      .educationBonusesReceived,
                    {
                      education: examType,
                      points: skillBonus,
                      date: Date.now(),
                    },
                  ],
                },
              },
            }));
          }

          return true;
        }

        return false;
      },

      // ==========================================
      // JOB EXPERIENCE PROGRESSION
      // ==========================================

      // Track job experience and award character skill improvements
      gainJobExperience: (jobType, performanceRating) => {
        const state = get();

        // Define which character skills each job type improves
        const jobSkillMapping = {
          frontend: "technical",
          backend: "technical",
          fullstack: "technical",
          ui_designer: "creativity",
          product_manager: "business",
          team_lead: "social",
          sales: "social",
          startup_founder: "business",
        };

        const skillToImprove = jobSkillMapping[jobType] || "technical";

        // Experience gain based on performance (0.1 to 0.3 per workday)
        const experienceGain = (performanceRating / 100) * 0.2;

        set((state) => ({
          character: {
            ...state.character,
            skillProgression: {
              ...state.character.skillProgression,
              jobExperienceGained: {
                ...state.character.skillProgression.jobExperienceGained,
                [skillToImprove]:
                  state.character.skillProgression.jobExperienceGained[
                    skillToImprove
                  ] + experienceGain,
              },
            },
          },
        }));

        // Award character skill point when experience reaches threshold
        const newExperience =
          state.skillProgression.jobExperienceGained[skillToImprove] +
          experienceGain;
        if (
          Math.floor(newExperience) >
          Math.floor(state.skillProgression.jobExperienceGained[skillToImprove])
        ) {
          get().addCharacterSkillPoints(1, `job_experience_${skillToImprove}`);
        }
      },

      // ==========================================
      // LIFE ACTIVITIES PROGRESSION
      // ==========================================

      // Take online course (costs money and time, improves technical skill)
      takeOnlineCourse: (courseName, cost = 200) => {
        const state = get();
        if (state.character.money < cost) return false;
        if (state.character.energy < 30) return false;

        const success = get().spendMoney(cost, "online_course");
        if (success) {
          get().consumeEnergy(30);
          get().addCharacterSkillPoints(1, `course_${courseName}`);
          return true;
        }
        return false;
      },

      // Attend networking event (costs money and energy, improves social skill)
      attendNetworkingEvent: (cost = 100) => {
        const state = get();
        if (state.character.money < cost) return false;
        if (state.character.energy < 25) return false;

        const success = get().spendMoney(cost, "networking_event");
        if (success) {
          get().consumeEnergy(25);
          get().addCharacterSkillPoints(1, "networking_event");
          return true;
        }
        return false;
      },

      // Read business book (costs time and energy, improves business skill)
      readBusinessBook: () => {
        const state = get();
        if (state.character.energy < 20) return false;

        get().consumeEnergy(20);
        get().addCharacterSkillPoints(1, "business_book");
        return true;
      },

      // Creative hobby activity (costs money and energy, improves creativity)
      doCreativeHobby: (hobbyType, cost = 50) => {
        const state = get();
        if (state.character.money < cost) return false;
        if (state.character.energy < 15) return false;

        const success = get().spendMoney(cost, `creative_hobby_${hobbyType}`);
        if (success) {
          get().consumeEnergy(15);
          get().addCharacterSkillPoints(1, `hobby_${hobbyType}`);
          return true;
        }
        return false;
      },

      // ==========================================
      // ACHIEVEMENT SYSTEM
      // ==========================================

      // Unlock achievement and award character skill points
      unlockAchievement: (
        achievementId,
        skillPointsAwarded = 0,
        description = ""
      ) => {
        const state = get();

        // Check if already unlocked
        if (
          state.character.skillProgression.achievementsUnlocked.includes(
            achievementId
          )
        ) {
          return false;
        }

        // Add to unlocked achievements
        set((state) => ({
          character: {
            ...state.character,
            skillProgression: {
              ...state.character.skillProgression,
              achievementsUnlocked: [
                ...state.character.skillProgression.achievementsUnlocked,
                {
                  id: achievementId,
                  unlockedDate: Date.now(),
                  description,
                  skillPointsAwarded,
                },
              ],
            },
          },
        }));

        // Award skill points if any
        if (skillPointsAwarded > 0) {
          get().addCharacterSkillPoints(
            skillPointsAwarded,
            `achievement_${achievementId}`
          );
        }

        return true;
      },

      // ==========================================
      // BUSINESS SUCCESS PROGRESSION
      // ==========================================

      // Award skill points for business/product success
      awardBusinessSuccess: (successType, amount = 1) => {
        const skillMapping = {
          first_product: { creativity: 2, business: 1 },
          successful_product: { creativity: 1, business: 1 },
          high_revenue: { business: 2 },
          company_founded: { business: 3, social: 1 },
        };

        const skillsToAward = skillMapping[successType];
        if (skillsToAward) {
          Object.entries(skillsToAward).forEach(([skill, points]) => {
            get().addCharacterSkillPoints(
              points,
              `business_${successType}_${skill}`
            );
          });
        }
      },

      // ==========================================
      // CHARACTER SKILL QUERIES
      // ==========================================

      // Get character skill with bonus calculations
      getEffectiveCharacterSkill: (skillName) => {
        const state = get();
        const baseSkill = state.character.characterSkills[skillName] || 0;

        // Could add equipment/temporary bonuses here in the future
        return baseSkill;
      },

      // Get character skill progression summary
      getSkillProgressionSummary: () => {
        const state = get();
        return {
          availablePoints: state.character.availableCharacterSkillPoints,
          currentSkills: state.character.characterSkills,
          educationBonuses:
            state.character.skillProgression.educationBonusesReceived,
          jobExperience: state.character.skillProgression.jobExperienceGained,
          achievements: state.character.skillProgression.achievementsUnlocked,
        };
      },

      // ==========================================
      // EXISTING METHODS (unchanged)
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
              [skillName]: Math.max(1, Math.min(10, value)),
            },
          },
        })),

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

      createCharacter: (characterData) =>
        set((state) => ({
          character: {
            ...state.character,
            ...characterData,
            avatar: {
              ...state.character.avatar,
              ...characterData.avatar,
            },
            characterSkills: {
              ...state.character.characterSkills,
              ...characterData.characterSkills,
            },
          },
        })),

      // Money, energy, skill points, reputation management (unchanged)
      addMoney: (amount, source = "unknown") => {
        set((state) => ({
          character: {
            ...state.character,
            money: state.character.money + amount,
          },
        }));

        const newState = get();
        if (newState.character.money >= 1000000) {
          get().unlockAchievement("millionaire", 5, "Reached 1 million manat!");
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

        return newEnergy > 0;
      },

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

      addReputation: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            reputation: Math.min(100, state.character.reputation + amount),
          },
        })),

      setEducation: (educationLevel) =>
        set((state) => ({
          character: {
            ...state.character,
            education: educationLevel,
          },
        })),

      setCurrentJob: (jobId) =>
        set((state) => ({
          character: {
            ...state.character,
            currentJob: jobId,
          },
        })),

      resetCharacter: () =>
        set(() => ({
          character: {
            name: "Alex Developer",
            age: 21,
            money: 1500,
            reputation: 10,
            energy: 75,
            skillPoints: 12,
            education: "none",
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
            availableCharacterSkillPoints: 0,
            skillProgression: {
              educationBonusesReceived: [],
              jobExperienceGained: {
                technical: 0,
                business: 0,
                social: 0,
                creativity: 0,
              },
              achievementsUnlocked: [],
            },
          },
        })),

      debug: {
        addMoney: (amount) => get().addMoney(amount, "debug"),
        addSkillPoints: (amount) => get().addSkillPoints(amount),
        addCharacterSkillPoints: (amount) =>
          get().addCharacterSkillPoints(amount, "debug"),
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
        setEducation: (level) => get().setEducation(level),
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
