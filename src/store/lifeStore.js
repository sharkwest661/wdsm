// src/store/lifeStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLifeStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // LIFE SYSTEM
      // ==========================================
      life: {
        housing: {
          type: "basic_apartment",
          cost: 50, // per day
          energyBonus: 0,
          reputationBonus: 0,
        },
        relationshipStatus: "single",
        relationships: [],
        pets: [],
        hobbies: [],
        lifestyle: {
          healthRating: 75,
          happinessRating: 60,
          stressLevel: 30,
        },
      },

      // ==========================================
      // HOUSING SYSTEM
      // ==========================================
      upgradeHousing: (housingType, characterStore) => {
        const housingCosts = {
          basic_apartment: 0,
          nice_apartment: 2000,
          house: 5000,
          mansion: 15000,
        };

        const cost = housingCosts[housingType];
        if (!cost) return false;

        const success = characterStore
          .getState()
          .spendMoney(cost, `housing_${housingType}`);
        if (success) {
          set((state) => ({
            life: {
              ...state.life,
              housing: {
                type: housingType,
                cost: cost / 100, // Daily cost
                energyBonus:
                  housingType === "mansion"
                    ? 10
                    : housingType === "house"
                    ? 5
                    : 0,
                reputationBonus:
                  housingType === "mansion"
                    ? 15
                    : housingType === "house"
                    ? 8
                    : 0,
              },
            },
          }));

          // Apply reputation bonus
          if (get().life.housing.reputationBonus > 0) {
            characterStore
              .getState()
              .addReputation(get().life.housing.reputationBonus);
          }
        }

        return success;
      },

      getHousingOptions: () => {
        return [
          { type: "basic_apartment", name: "Basic Apartment", cost: 0 },
          { type: "nice_apartment", name: "Nice Apartment", cost: 2000 },
          { type: "house", name: "House", cost: 5000 },
          { type: "mansion", name: "Mansion", cost: 15000 },
        ];
      },

      // ==========================================
      // ENERGY ACTIVITIES
      // ==========================================
      eatFood: (characterStore) => {
        const cost = 25;
        const energyGain = 20;

        if (characterStore.getState().spendMoney(cost, "food")) {
          characterStore.getState().restoreEnergy(energyGain);
          return { success: true, energyGain };
        }
        return { success: false, message: "Not enough money" };
      },

      playGames: (characterStore) => {
        const cost = 15;
        const energyGain = 15;

        if (characterStore.getState().spendMoney(cost, "entertainment")) {
          characterStore.getState().restoreEnergy(energyGain);
          return { success: true, energyGain };
        }
        return { success: false, message: "Not enough money" };
      },

      sleep: (characterStore) => {
        const energyGain = 30 + (get().life.housing.energyBonus || 0);
        characterStore.getState().restoreEnergy(energyGain);
        return { success: true, energyGain };
      },

      // ==========================================
      // DAILY LIFE COSTS
      // ==========================================
      payDailyCosts: (characterStore) => {
        const state = get();
        const housingCost = state.life.housing.cost || 0;

        if (housingCost > 0) {
          return characterStore
            .getState()
            .spendMoney(housingCost, "housing_daily");
        }
        return true;
      },

      // ==========================================
      // LIFESTYLE MANAGEMENT
      // ==========================================
      updateLifestyle: (updates) => {
        set((state) => ({
          life: {
            ...state.life,
            lifestyle: {
              ...state.life.lifestyle,
              ...updates,
            },
          },
        }));
      },

      // ==========================================
      // LIFE QUERIES
      // ==========================================
      getLifeStatistics: () => {
        const state = get();
        return {
          housing: state.life.housing,
          relationshipStatus: state.life.relationshipStatus,
          lifestyle: state.life.lifestyle,
          dailyHousingCost: state.life.housing.cost,
          energyBonus: state.life.housing.energyBonus,
        };
      },

      // ==========================================
      // RESET LIFE
      // ==========================================
      resetLife: () =>
        set(() => ({
          life: {
            housing: {
              type: "basic_apartment",
              cost: 50,
              energyBonus: 0,
              reputationBonus: 0,
            },
            relationshipStatus: "single",
            relationships: [],
            pets: [],
            hobbies: [],
            lifestyle: {
              healthRating: 75,
              happinessRating: 60,
              stressLevel: 30,
            },
          },
        })),
    }),
    {
      name: "web-dev-sim-life",
      partialize: (state) => ({
        life: state.life,
      }),
    }
  )
);

export default useLifeStore;
