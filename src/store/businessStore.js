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

      // src/store/businessStore.js - add new methods

      // 1. Generate product ideas based on creativity skill
      generateProductIdea: (characterStore) => {
        const creativity =
          characterStore.getState().character.characterSkills.creativity;
        const technical =
          characterStore.getState().character.characterSkills.technical;

        // Higher creativity = better ideas
        const ideaQuality = Math.min(
          10,
          Math.floor(creativity * 0.7 + technical * 0.3 + Math.random() * 3)
        );

        const ideaTypes = [
          { type: "portfolio", minQuality: 1, name: "Portfolio Project" },
          { type: "commercial", minQuality: 4, name: "Commercial Product" },
          { type: "startup", minQuality: 7, name: "Startup Idea" },
          { type: "disruptive", minQuality: 9, name: "Revolutionary Platform" },
        ];

        // Get all possible idea types based on quality
        const possibleTypes = ideaTypes.filter(
          (t) => t.minQuality <= ideaQuality
        );

        // Select a random type from possible types
        const selectedType =
          possibleTypes[Math.floor(Math.random() * possibleTypes.length)];

        // Generate a more specific idea name based on the type
        const ideaNames = {
          portfolio: [
            "Personal Blog",
            "Portfolio Website",
            "Weather App",
            "Task Manager",
            "Recipe Collection",
          ],
          commercial: [
            "E-commerce Platform",
            "SaaS Dashboard",
            "Productivity Tool",
            "Educational App",
            "Fitness Tracker",
          ],
          startup: [
            "Social Network",
            "Marketplace Platform",
            "Fintech Solution",
            "Collaborative Tool",
            "On-demand Service",
          ],
          disruptive: [
            "AI Assistant Platform",
            "Blockchain Solution",
            "Virtual Reality Experience",
            "IoT Ecosystem",
            "Autonomous System",
          ],
        };

        // Select a random name from the appropriate category
        const names = ideaNames[selectedType.type] || ideaNames.portfolio;
        const ideaName = names[Math.floor(Math.random() * names.length)];

        const newIdea = {
          id: `idea_${Date.now()}`,
          name: ideaName,
          type: selectedType.type,
          typeName: selectedType.name,
          quality: ideaQuality,
          description: `A ${selectedType.name.toLowerCase()} that solves real problems.`,
          requiredSkills: [],
          generatedAt: Date.now(),
        };

        // Add some required skills based on the idea
        const allSkills = [
          "JavaScript",
          "React",
          "Node.js",
          "HTML",
          "CSS",
          "Python",
        ];
        const skillCount = Math.floor(Math.random() * 3) + 1; // 1-3 skills

        // Randomly select skills
        for (let i = 0; i < skillCount; i++) {
          const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
          if (!newIdea.requiredSkills.includes(skill)) {
            newIdea.requiredSkills.push(skill);
          }
        }

        // Add to ideas list in store
        set((state) => ({
          business: {
            ...state.business,
            ideas: [...state.business.ideas, newIdea],
          },
        }));

        return newIdea;
      },

      // 2. Start product development
      startProductDevelopment: (ideaId, characterStore, skillsStore) => {
        const state = get();
        const idea = state.business.ideas.find((i) => i.id === ideaId);

        if (!idea) return { success: false, message: "Idea not found" };

        // Check if player has required skills
        const hasSkills = skillsStore
          .getState()
          .hasRequiredSkills(idea.requiredSkills);
        if (!hasSkills) {
          return {
            success: false,
            message: `Missing required skills: ${idea.requiredSkills.join(
              ", "
            )}`,
          };
        }

        // Create in-progress product
        const newProduct = {
          id: `product_${Date.now()}`,
          ideaId: idea.id,
          name: idea.name,
          type: idea.type,
          quality: idea.quality,
          developmentStage: "development", // development, debugging, launched
          developmentProgress: 0,
          debuggingProgress: 0,
          bugs: 0,
          createdAt: Date.now(),
          launchedAt: null,
          revenue: 0,
          totalRevenue: 0,
        };

        set((state) => ({
          business: {
            ...state.business,
            currentDevelopment: newProduct,
          },
        }));

        return { success: true, product: newProduct };
      },

      // 3. Continue product development (mini-game result)
      continueProductDevelopment: (performanceScore, characterStore) => {
        const state = get();
        const product = state.business.currentDevelopment;

        if (!product)
          return { success: false, message: "No product in development" };
        if (product.developmentStage !== "development") {
          return {
            success: false,
            message: "Product not in development stage",
          };
        }

        // Energy cost for development
        const energyCost = 25;
        const character = characterStore.getState().character;

        if (character.energy < energyCost) {
          return {
            success: false,
            message: "Not enough energy to work on project",
          };
        }

        // Consume energy
        characterStore.getState().consumeEnergy(energyCost);

        // Calculate progress based on performance and technical skill
        const technicalSkill = character.characterSkills.technical;
        const progressGain =
          Math.floor((performanceScore / 100) * 20) + technicalSkill / 2;

        // Random chance to generate bugs based on skill and performance
        const bugChance = Math.max(
          0.05,
          0.4 - technicalSkill * 0.03 - performanceScore / 500
        );
        const newBugs =
          Math.random() < bugChance ? Math.floor(Math.random() * 3) + 1 : 0;

        // Update product
        const updatedProgress = Math.min(
          100,
          product.developmentProgress + progressGain
        );
        const updatedProduct = {
          ...product,
          developmentProgress: updatedProgress,
          bugs: product.bugs + newBugs,
        };

        // Check if development is complete
        if (updatedProgress >= 100) {
          updatedProduct.developmentStage = "debugging";
        }

        set((state) => ({
          business: {
            ...state.business,
            currentDevelopment: updatedProduct,
          },
        }));

        // Award skill points for development work
        characterStore.getState().addSkillPoints(1);

        return {
          success: true,
          progressGain,
          newBugs,
          isComplete: updatedProgress >= 100,
          product: updatedProduct,
        };
      },

      // 4. Debug product (mini-game result)
      debugProduct: (bugsFixed, characterStore) => {
        const state = get();
        const product = state.business.currentDevelopment;

        if (!product)
          return { success: false, message: "No product in development" };
        if (product.developmentStage !== "debugging") {
          return { success: false, message: "Product not in debugging stage" };
        }

        // Energy cost for debugging
        const energyCost = 20;
        const character = characterStore.getState().character;

        if (character.energy < energyCost) {
          return {
            success: false,
            message: "Not enough energy to debug project",
          };
        }

        // Consume energy
        characterStore.getState().consumeEnergy(energyCost);

        // Fix bugs (can't fix more than exist)
        const fixedBugs = Math.min(bugsFixed, product.bugs);

        // Update debugging progress (each bug fix = 20% progress)
        const progressGain = fixedBugs * 20;
        const updatedProgress = Math.min(
          100,
          product.debuggingProgress + progressGain
        );

        // Update product
        const updatedProduct = {
          ...product,
          bugs: product.bugs - fixedBugs,
          debuggingProgress: updatedProgress,
        };

        // Award skill points for debugging
        characterStore.getState().addSkillPoints(1);

        // Check if debugging is complete and all bugs are fixed
        if (updatedProgress >= 100 && updatedProduct.bugs === 0) {
          updatedProduct.developmentStage = "ready";
        }

        set((state) => ({
          business: {
            ...state.business,
            currentDevelopment: updatedProduct,
          },
        }));

        return {
          success: true,
          bugsFixed,
          progressGain,
          isComplete: updatedProgress >= 100 && updatedProduct.bugs === 0,
          product: updatedProduct,
        };
      },

      // 5. Launch product
      launchProduct: (characterStore) => {
        const state = get();
        const product = state.business.currentDevelopment;

        if (!product)
          return { success: false, message: "No product in development" };
        if (product.developmentStage !== "ready") {
          return { success: false, message: "Product not ready for launch" };
        }

        // Calculate product success based on quality, bugs, and business skill
        const quality = product.quality;
        const businessSkill =
          characterStore.getState().character.characterSkills.business;

        // Calculate success percentage
        const successChance = Math.min(
          0.95,
          (quality / 10) * 0.6 + (businessSkill / 10) * 0.3 + 0.1
        );
        const isSuccessful = Math.random() < successChance;

        // Calculate monthly revenue based on product type, quality and success
        let monthlyRevenue = 0;

        if (isSuccessful) {
          switch (product.type) {
            case "portfolio":
              // Portfolio projects don't generate direct revenue
              monthlyRevenue = Math.floor(Math.random() * 50);
              break;
            case "commercial":
              monthlyRevenue = Math.floor(quality * 50 + Math.random() * 200);
              break;
            case "startup":
              monthlyRevenue = Math.floor(quality * 100 + Math.random() * 500);
              break;
            case "disruptive":
              monthlyRevenue = Math.floor(quality * 300 + Math.random() * 1000);
              break;
            default:
              monthlyRevenue = Math.floor(Math.random() * 100);
          }

          // Apply business skill bonus
          monthlyRevenue = Math.floor(
            monthlyRevenue * (1 + businessSkill / 20)
          );
        } else {
          // Even unsuccessful products might generate some revenue
          monthlyRevenue = Math.floor(Math.random() * 50);
        }

        // Launch product
        const launchedProduct = {
          ...product,
          developmentStage: "launched",
          launchedAt: Date.now(),
          isSuccessful,
          monthlyRevenue,
        };

        // Remove from current development and add to products list
        set((state) => ({
          business: {
            ...state.business,
            currentDevelopment: null,
            products: [...state.business.products, launchedProduct],
          },
        }));

        // Award reputation and skill points for launching
        characterStore.getState().addReputation(quality);
        characterStore.getState().addSkillPoints(3);

        // Award character skill points if product is successful
        if (isSuccessful) {
          characterStore
            .getState()
            .addCharacterSkillPoints(1, "product_launch");
        }

        return {
          success: true,
          product: launchedProduct,
          isProductSuccessful: isSuccessful,
          monthlyRevenue,
          message: isSuccessful
            ? `Product launched successfully! Estimated monthly revenue: ${monthlyRevenue}₼`
            : "Product launched but received minimal market interest.",
        };
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
