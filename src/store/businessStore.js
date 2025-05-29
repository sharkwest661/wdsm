// src/store/businessStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBusinessStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // BUSINESS SYSTEM
      // ==========================================
      business: {
        ownedBusinesses: [],
        products: [],
        ideas: [],
        totalEarnings: 0,
        businessSkillBonus: 0, // Based on character business skill
      },

      // ==========================================
      // PRODUCT DEVELOPMENT
      // ==========================================
      createProduct: (productData, characterStore) => {
        const character = characterStore.getState().character;

        // Check requirements
        if (
          character.education !== "university" &&
          character.education !== "academy"
        ) {
          return { success: false, message: "University education required" };
        }

        const creativitySkill = character.characterSkills.creativity;
        const businessSkill = character.characterSkills.business;

        // Generate product success chance
        const successChance =
          creativitySkill * 0.4 + businessSkill * 0.3 + Math.random() * 0.3;
        const isSuccessful = successChance > 0.5;

        const product = {
          id: `product_${Date.now()}`,
          name: productData.name || "New Product",
          type: productData.type || "web_app",
          createdDate: Date.now(),
          successLevel: successChance,
          isSuccessful,
          monthlyRevenue: isSuccessful
            ? Math.floor(Math.random() * 1000 + 500)
            : Math.floor(Math.random() * 100),
          totalRevenue: 0,
          developmentCost: productData.cost || 100,
        };

        // Spend money on development
        const spentMoney = characterStore
          .getState()
          .spendMoney(product.developmentCost, "product_development");
        if (!spentMoney) {
          return {
            success: false,
            message: "Not enough money for development",
          };
        }

        set((state) => ({
          business: {
            ...state.business,
            products: [...state.business.products, product],
          },
        }));

        return { success: true, product };
      },

      // ==========================================
      // BUSINESS OPERATIONS
      // ==========================================
      generateDailyIncome: (characterStore) => {
        const state = get();
        let totalIncome = 0;

        // Generate income from products
        state.business.products.forEach((product) => {
          if (product.isSuccessful && Math.random() < 0.8) {
            // 80% chance of daily income
            const dailyIncome = Math.floor(product.monthlyRevenue / 30);
            totalIncome += dailyIncome;

            // Update product total revenue
            set((state) => ({
              business: {
                ...state.business,
                products: state.business.products.map((p) =>
                  p.id === product.id
                    ? { ...p, totalRevenue: p.totalRevenue + dailyIncome }
                    : p
                ),
              },
            }));
          }
        });

        if (totalIncome > 0) {
          characterStore.getState().addMoney(totalIncome, "business_income");

          set((state) => ({
            business: {
              ...state.business,
              totalEarnings: state.business.totalEarnings + totalIncome,
            },
          }));
        }

        return totalIncome;
      },

      // ==========================================
      // BUSINESS QUERIES
      // ==========================================
      getProducts: () => {
        const state = get();
        return state.business.products;
      },

      getSuccessfulProducts: () => {
        const state = get();
        return state.business.products.filter((p) => p.isSuccessful);
      },

      getTotalBusinessValue: () => {
        const state = get();
        return state.business.products.reduce((total, product) => {
          return total + product.totalRevenue;
        }, 0);
      },

      getMonthlyBusinessIncome: () => {
        const state = get();
        return state.business.products.reduce((total, product) => {
          return total + (product.isSuccessful ? product.monthlyRevenue : 0);
        }, 0);
      },

      // ==========================================
      // BUSINESS STATS
      // ==========================================
      getBusinessStatistics: () => {
        const state = get();
        return {
          totalProducts: state.business.products.length,
          successfulProducts: state.business.products.filter(
            (p) => p.isSuccessful
          ).length,
          totalEarnings: state.business.totalEarnings,
          monthlyIncome: get().getMonthlyBusinessIncome(),
          businessValue: get().getTotalBusinessValue(),
        };
      },

      // ==========================================
      // RESET BUSINESS
      // ==========================================
      resetBusiness: () =>
        set(() => ({
          business: {
            ownedBusinesses: [],
            products: [],
            ideas: [],
            totalEarnings: 0,
            businessSkillBonus: 0,
          },
        })),
    }),
    {
      name: "web-dev-sim-business",
      partialize: (state) => ({
        business: state.business,
      }),
    }
  )
);

export default useBusinessStore;
