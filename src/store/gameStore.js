// src/store/gameStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGameStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // LANGUAGE STATE
      // ==========================================
      language: "en",

      // ==========================================
      // CHARACTER STATE
      // ==========================================
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
          social: 2, // Job interviews, salary negotiation
          creativity: 3, // Better product ideas and success probability
        },
      },

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
      // TECHNICAL SKILLS SYSTEM
      // ==========================================
      skills: {
        learned: ["HTML", "CSS"], // Skills already learned
        available: [], // Dynamically calculated
        skillTree: {
          // Frontend Foundation
          HTML: {
            cost: 0,
            learned: true,
            prerequisites: [],
            category: "frontend",
            description: "The foundation of web development",
          },
          CSS: {
            cost: 0,
            learned: true,
            prerequisites: [],
            category: "frontend",
            description: "Styling and layout for web pages",
          },
          JavaScript: {
            cost: 3,
            learned: false,
            prerequisites: ["HTML", "CSS"],
            category: "frontend",
            description: "The programming language of the web",
          },
          TypeScript: {
            cost: 2,
            learned: false,
            prerequisites: ["JavaScript"],
            category: "frontend",
            description: "Typed superset of JavaScript",
          },

          // Frontend Frameworks
          React: {
            cost: 4,
            learned: false,
            prerequisites: ["JavaScript"],
            category: "frontend",
            description: "Popular library for building user interfaces",
          },
          Redux: {
            cost: 3,
            learned: false,
            prerequisites: ["React"],
            category: "frontend",
            description: "Predictable state container for JavaScript apps",
          },
          "Vue.js": {
            cost: 4,
            learned: false,
            prerequisites: ["JavaScript"],
            category: "frontend",
            description: "Progressive framework for building UIs",
          },
          Angular: {
            cost: 5,
            learned: false,
            prerequisites: ["JavaScript", "TypeScript"],
            category: "frontend",
            description: "Platform for building mobile and desktop apps",
          },
          Svelte: {
            cost: 3,
            learned: false,
            prerequisites: ["JavaScript"],
            category: "frontend",
            description: "Cybernetically enhanced web apps",
          },

          // Backend Languages
          "Node.js": {
            cost: 3,
            learned: false,
            prerequisites: ["JavaScript"],
            category: "backend",
            description: "JavaScript runtime for server-side development",
          },
          Python: {
            cost: 4,
            learned: false,
            prerequisites: [],
            category: "backend",
            description: "Versatile language for backend and data science",
          },
          PHP: {
            cost: 3,
            learned: false,
            prerequisites: [],
            category: "backend",
            description: "Server-side scripting language",
          },
          "C#": {
            cost: 5,
            learned: false,
            prerequisites: [],
            category: "backend",
            description: "Microsoft's object-oriented programming language",
          },
          Java: {
            cost: 5,
            learned: false,
            prerequisites: [],
            category: "backend",
            description: "Write once, run anywhere",
          },
          Go: {
            cost: 4,
            learned: false,
            prerequisites: [],
            category: "backend",
            description: "Fast, simple, and efficient",
          },

          // Backend Frameworks
          "Express.js": {
            cost: 2,
            learned: false,
            prerequisites: ["Node.js"],
            category: "backend",
            description: "Fast, minimalist web framework for Node.js",
          },
          Django: {
            cost: 3,
            learned: false,
            prerequisites: ["Python"],
            category: "backend",
            description: "High-level Python web framework",
          },
          Laravel: {
            cost: 3,
            learned: false,
            prerequisites: ["PHP"],
            category: "backend",
            description: "PHP framework for web artisans",
          },
          "ASP.NET": {
            cost: 3,
            learned: false,
            prerequisites: ["C#"],
            category: "backend",
            description: "Microsoft's web framework",
          },
          Spring: {
            cost: 4,
            learned: false,
            prerequisites: ["Java"],
            category: "backend",
            description: "Java application framework",
          },

          // Databases
          SQL: {
            cost: 3,
            learned: false,
            prerequisites: [],
            category: "database",
            description: "Structured Query Language for databases",
          },
          MongoDB: {
            cost: 2,
            learned: false,
            prerequisites: ["Node.js"],
            category: "database",
            description: "NoSQL document database",
          },
          PostgreSQL: {
            cost: 2,
            learned: false,
            prerequisites: ["SQL"],
            category: "database",
            description: "Advanced open source relational database",
          },
          Redis: {
            cost: 2,
            learned: false,
            prerequisites: [],
            category: "database",
            description: "In-memory data structure store",
          },

          // Mobile Development
          "React Native": {
            cost: 4,
            learned: false,
            prerequisites: ["React", "JavaScript"],
            category: "mobile",
            description: "Build mobile apps with React",
          },
          Flutter: {
            cost: 5,
            learned: false,
            prerequisites: [],
            category: "mobile",
            description: "Google's UI toolkit for mobile, web, and desktop",
          },

          // DevOps & Tools
          Git: {
            cost: 2,
            learned: false,
            prerequisites: [],
            category: "tools",
            description: "Version control system",
          },
          Docker: {
            cost: 4,
            learned: false,
            prerequisites: [],
            category: "devops",
            description:
              "Platform for developing, shipping, and running applications",
          },
          AWS: {
            cost: 5,
            learned: false,
            prerequisites: [],
            category: "devops",
            description: "Amazon Web Services cloud platform",
          },
          "CI/CD": {
            cost: 3,
            learned: false,
            prerequisites: ["Git"],
            category: "devops",
            description: "Continuous Integration and Continuous Deployment",
          },

          // Advanced Skills
          "Machine Learning": {
            cost: 6,
            learned: false,
            prerequisites: ["Python", "SQL"],
            category: "advanced",
            description: "AI and machine learning algorithms",
          },
          Blockchain: {
            cost: 6,
            learned: false,
            prerequisites: ["JavaScript"],
            category: "advanced",
            description: "Decentralized applications and smart contracts",
          },
          Microservices: {
            cost: 5,
            learned: false,
            prerequisites: ["Docker"],
            category: "advanced",
            description: "Architectural approach to building applications",
          },
        },
        skillCategories: {
          frontend: "Frontend Development",
          backend: "Backend Development",
          database: "Database Management",
          mobile: "Mobile Development",
          tools: "Development Tools",
          devops: "DevOps & Infrastructure",
          advanced: "Advanced Technologies",
        },
      },

      // ==========================================
      // CAREER SYSTEM
      // ==========================================
      career: {
        currentPosition: null,
        experience: 0,
        workDaysCompleted: 0,
        performanceRating: 50, // 0-100
        availableJobs: [
          {
            id: "junior-web-dev-1",
            title: "Junior Web Developer",
            company: "TechStart Inc.",
            salary: 150, // per day
            requirements: {
              education: "high_school",
              skills: ["HTML", "CSS", "JavaScript"],
              reputation: 10,
            },
            description: "Entry-level position for web development",
          },
          {
            id: "junior-web-dev-2",
            title: "Junior Frontend Developer",
            company: "WebCorp",
            salary: 180,
            requirements: {
              education: "high_school",
              skills: ["HTML", "CSS", "JavaScript", "React"],
              reputation: 25,
            },
            description: "Frontend focused development role",
          },
        ],
        applications: [], // Applied jobs
        interviews: [], // Scheduled interviews
        jobHistory: [], // Previous jobs
      },

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
      // EDUCATION SYSTEM
      // ==========================================
      education: {
        availableExams: [
          {
            type: "college",
            name: "College Degree",
            cost: 500,
            duration: 7, // days
            requirements: ["high_school"],
            benefits: {
              reputation: 15,
              jobAccess: "middle_level",
            },
          },
          {
            type: "university",
            name: "University Degree",
            cost: 1500,
            duration: 14,
            requirements: ["college"],
            benefits: {
              reputation: 30,
              jobAccess: "senior_level",
              businessAccess: true,
            },
          },
          {
            type: "academy",
            name: "Advanced Academy",
            cost: 3000,
            duration: 21,
            requirements: ["university"],
            benefits: {
              reputation: 50,
              jobAccess: "executive_level",
              skillPointBonus: 5,
            },
          },
        ],
        currentStudy: null, // If currently studying
        studyProgress: 0,
      },

      // ==========================================
      // GAME PROGRESS
      // ==========================================
      gameProgress: {
        currentDay: 1,
        achievements: [],
        completedGoals: [],
        milestones: {
          firstJob: false,
          firstBusiness: false,
          firstProduct: false,
          millionaire: false,
          skillMaster: false,
        },
        statistics: {
          totalMoneyEarned: 0,
          totalSkillsLearned: 2, // HTML, CSS
          totalJobsCompleted: 0,
          totalProductsCreated: 0,
          daysPlayed: 1,
        },
      },

      // ==========================================
      // NOTIFICATIONS SYSTEM
      // ==========================================
      notifications: {
        queue: [],
        history: [],
      },

      // ==========================================
      // LANGUAGE ACTIONS
      // ==========================================
      setLanguage: (languageCode) =>
        set(() => ({
          language: languageCode,
        })),

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
          gameSetup: {
            ...state.gameSetup,
            isCharacterCreated: true,
            gameStarted: true,
          },
        })),

      // ==========================================
      // SKILLS SYSTEM ACTIONS
      // ==========================================
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

        // Calculate skill point bonus from technical skill
        const technicalBonus = Math.floor(
          state.character.characterSkills.technical / 2
        );
        const reputationGain = 2 + technicalBonus;

        set((state) => ({
          character: {
            ...state.character,
            skillPoints: state.character.skillPoints - skill.cost,
            reputation: state.character.reputation + reputationGain,
          },
          skills: {
            ...state.skills,
            skillTree: {
              ...state.skills.skillTree,
              [skillName]: { ...skill, learned: true },
            },
            learned: [...state.skills.learned, skillName],
          },
          gameProgress: {
            ...state.gameProgress,
            statistics: {
              ...state.gameProgress.statistics,
              totalSkillsLearned:
                state.gameProgress.statistics.totalSkillsLearned + 1,
            },
          },
        }));
        return true;
      },

      getAvailableSkills: () => {
        const state = get();
        return Object.entries(state.skills.skillTree)
          .filter(([name, skill]) => {
            if (skill.learned) return false;
            return skill.prerequisites.every(
              (req) => state.skills.skillTree[req]?.learned
            );
          })
          .map(([name, skill]) => ({ name, ...skill }));
      },

      getSkillsByCategory: (category) => {
        const state = get();
        return Object.entries(state.skills.skillTree)
          .filter(([name, skill]) => skill.category === category)
          .map(([name, skill]) => ({ name, ...skill }));
      },

      // ==========================================
      // MONEY MANAGEMENT
      // ==========================================
      addMoney: (amount, source = "unknown") => {
        set((state) => ({
          character: {
            ...state.character,
            money: state.character.money + amount,
          },
          gameProgress: {
            ...state.gameProgress,
            statistics: {
              ...state.gameProgress.statistics,
              totalMoneyEarned:
                state.gameProgress.statistics.totalMoneyEarned + amount,
            },
          },
        }));

        // Check for millionaire achievement
        const newState = get();
        if (
          newState.character.money >= 1000000 &&
          !newState.gameProgress.milestones.millionaire
        ) {
          get().unlockAchievement("millionaire", "Reached 1 million manat!");
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
      // EDUCATION ACTIONS
      // ==========================================
      takeExam: (examType) => {
        const state = get();
        const exam = state.education.availableExams.find(
          (e) => e.type === examType
        );

        if (!exam) return false;
        if (state.character.money < exam.cost) return false;

        // Check requirements
        if (
          exam.requirements.includes("high_school") &&
          state.character.education === "none"
        )
          return false;
        if (
          exam.requirements.includes("college") &&
          state.character.education !== "college" &&
          state.character.education !== "university"
        )
          return false;
        if (
          exam.requirements.includes("university") &&
          state.character.education !== "university"
        )
          return false;

        const success = get().spendMoney(exam.cost, `education_${examType}`);
        if (success) {
          set((state) => ({
            character: {
              ...state.character,
              education: examType,
              reputation: state.character.reputation + exam.benefits.reputation,
              skillPoints:
                state.character.skillPoints +
                (exam.benefits.skillPointBonus || 0),
            },
            education: {
              ...state.education,
              currentStudy: null,
              studyProgress: 0,
            },
          }));
          return true;
        }
        return false;
      },

      // ==========================================
      // JOB SYSTEM ACTIONS
      // ==========================================
      applyForJob: (jobId) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);

        if (!job) return false;

        // Check if already applied
        if (state.career.applications.some((app) => app.jobId === jobId))
          return false;

        // Check requirements
        if (job.requirements.reputation > state.character.reputation)
          return false;

        // Check education requirements
        const educationOrder = [
          "none",
          "high_school",
          "college",
          "university",
          "academy",
        ];
        const requiredEducationLevel = educationOrder.indexOf(
          job.requirements.education
        );
        const currentEducationLevel = educationOrder.indexOf(
          state.character.education
        );
        if (currentEducationLevel < requiredEducationLevel) return false;

        // Check skill requirements
        const hasRequiredSkills = job.requirements.skills.every(
          (skill) => state.skills.skillTree[skill]?.learned
        );
        if (!hasRequiredSkills) return false;

        set((state) => ({
          career: {
            ...state.career,
            applications: [
              ...state.career.applications,
              {
                jobId,
                appliedDate: state.gameProgress.currentDay,
                status: "pending",
              },
            ],
          },
        }));

        // Random chance for interview
        setTimeout(() => {
          if (Math.random() < 0.7) {
            // 70% chance
            get().scheduleInterview(jobId);
          }
        }, 1000);

        return true;
      },

      scheduleInterview: (jobId) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);

        if (!job) return;

        set((state) => ({
          career: {
            ...state.career,
            interviews: [
              ...state.career.interviews,
              {
                jobId,
                scheduledDay: state.gameProgress.currentDay + 1,
                status: "scheduled",
              },
            ],
          },
        }));

        get().addNotification(
          "success",
          `Interview scheduled for ${job.title} at ${job.company}!`
        );
      },

      acceptJob: (jobId) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);

        if (!job) return false;

        set((state) => ({
          character: {
            ...state.character,
            currentJob: jobId,
          },
          career: {
            ...state.career,
            currentPosition: job,
            performanceRating: 50,
            workDaysCompleted: 0,
          },
        }));

        if (!state.gameProgress.milestones.firstJob) {
          get().unlockAchievement("firstJob", "Got your first job!");
        }

        return true;
      },

      quitJob: () => {
        const state = get();
        if (!state.career.currentPosition) return false;

        // Add to job history
        const jobRecord = {
          ...state.career.currentPosition,
          startDate:
            state.gameProgress.currentDay - state.career.workDaysCompleted,
          endDate: state.gameProgress.currentDay,
          daysWorked: state.career.workDaysCompleted,
          finalPerformance: state.career.performanceRating,
        };

        set((state) => ({
          character: {
            ...state.character,
            currentJob: null,
          },
          career: {
            ...state.career,
            currentPosition: null,
            jobHistory: [...state.career.jobHistory, jobRecord],
            workDaysCompleted: 0,
            performanceRating: 50,
          },
        }));

        return true;
      },

      // ==========================================
      // WORK PERFORMANCE
      // ==========================================
      completeWorkDay: () => {
        const state = get();
        if (!state.career.currentPosition) return false;
        if (state.character.energy < 20) return false;

        const job = state.career.currentPosition;
        const technicalSkill = state.character.characterSkills.technical;

        // Performance calculation based on energy and technical skill
        const energyFactor = state.character.energy / 100;
        const skillFactor = technicalSkill / 10;
        const performanceScore = (energyFactor * 0.6 + skillFactor * 0.4) * 100;

        // Update performance rating (moving average)
        const newPerformanceRating =
          state.career.performanceRating * 0.8 + performanceScore * 0.2;

        // Calculate pay (can be reduced for poor performance)
        const payMultiplier = performanceScore < 50 ? 0.5 : 1.0;
        const dailyPay = job.salary * payMultiplier;

        // Earn skill points based on technical skill
        const skillPointsEarned = Math.floor(technicalSkill / 3) + 1;

        set((state) => ({
          character: {
            ...state.character,
            energy: Math.max(0, state.character.energy - 25),
            skillPoints: state.character.skillPoints + skillPointsEarned,
          },
          career: {
            ...state.career,
            performanceRating: newPerformanceRating,
            workDaysCompleted: state.career.workDaysCompleted + 1,
            experience: state.career.experience + 1,
          },
        }));

        get().addMoney(dailyPay, "job_salary");

        // Check for termination
        if (newPerformanceRating < 30 && state.career.workDaysCompleted >= 5) {
          setTimeout(() => {
            get().addNotification(
              "warning",
              "You've been fired for poor performance!"
            );
            get().quitJob();
          }, 500);
        }

        return {
          performanceScore,
          dailyPay,
          skillPointsEarned,
        };
      },

      // ==========================================
      // BUSINESS SYSTEM ACTIONS
      // ==========================================
      createProduct: (productData) => {
        const state = get();

        // Check requirements
        if (
          state.character.education !== "university" &&
          state.character.education !== "academy"
        ) {
          return false;
        }

        const creativitySkill = state.character.characterSkills.creativity;
        const businessSkill = state.character.characterSkills.business;

        // Generate product success chance
        const successChance =
          creativitySkill * 0.4 + businessSkill * 0.3 + Math.random() * 0.3;
        const isSuccessful = successChance > 0.5;

        const product = {
          id: `product_${Date.now()}`,
          name: productData.name || "New Product",
          type: productData.type || "web_app",
          createdDate: state.gameProgress.currentDay,
          successLevel: successChance,
          isSuccessful,
          monthlyRevenue: isSuccessful
            ? Math.floor(Math.random() * 1000 + 500)
            : Math.floor(Math.random() * 100),
          totalRevenue: 0,
        };

        set((state) => ({
          business: {
            ...state.business,
            products: [...state.business.products, product],
          },
          gameProgress: {
            ...state.gameProgress,
            statistics: {
              ...state.gameProgress.statistics,
              totalProductsCreated:
                state.gameProgress.statistics.totalProductsCreated + 1,
            },
          },
        }));

        if (!state.gameProgress.milestones.firstProduct) {
          get().unlockAchievement(
            "firstProduct",
            "Created your first product!"
          );
        }

        return product;
      },

      // ==========================================
      // LIFE SYSTEM ACTIONS
      // ==========================================
      upgradeHousing: (housingType) => {
        const state = get();
        const housingCosts = {
          basic_apartment: 0,
          nice_apartment: 2000,
          house: 5000,
          mansion: 15000,
        };

        const cost = housingCosts[housingType];
        if (!cost || state.character.money < cost) return false;

        const success = get().spendMoney(cost, `housing_${housingType}`);
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
        }

        return success;
      },

      // Life activities for energy restoration
      eatFood: () => {
        const cost = 25;
        const energyGain = 20;

        if (get().spendMoney(cost, "food")) {
          get().restoreEnergy(energyGain);
          return true;
        }
        return false;
      },

      playGames: () => {
        const cost = 15;
        const energyGain = 15;

        if (get().spendMoney(cost, "entertainment")) {
          get().restoreEnergy(energyGain);
          return true;
        }
        return false;
      },

      sleep: () => {
        const energyGain = 30 + (get().life.housing.energyBonus || 0);
        get().restoreEnergy(energyGain);
        return true;
      },

      // ==========================================
      // GAME PROGRESSION
      // ==========================================
      advanceDay: () => {
        const state = get();

        set((state) => ({
          gameSetup: {
            ...state.gameSetup,
            currentDay: state.gameSetup.currentDay + 1,
          },
          gameProgress: {
            ...state.gameProgress,
            currentDay: state.gameProgress.currentDay + 1,
            daysPlayed: state.gameProgress.daysPlayed + 1,
          },
        }));

        // Daily costs
        const housingCost = state.life.housing.cost || 0;
        if (housingCost > 0) {
          get().spendMoney(housingCost, "housing_daily");
        }

        // Passive income from products
        state.business.products.forEach((product) => {
          if (product.isSuccessful && Math.random() < 0.8) {
            // 80% chance of daily income
            const dailyIncome = Math.floor(product.monthlyRevenue / 30);
            get().addMoney(dailyIncome, `product_${product.id}`);
          }
        });

        // Natural energy decay
        set((state) => ({
          character: {
            ...state.character,
            energy: Math.max(0, state.character.energy - 5),
          },
        }));
      },

      // ==========================================
      // ACHIEVEMENTS SYSTEM
      // ==========================================
      unlockAchievement: (achievementId, message) => {
        const state = get();
        if (state.gameProgress.achievements.includes(achievementId)) return;

        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            achievements: [...state.gameProgress.achievements, achievementId],
            milestones: {
              ...state.gameProgress.milestones,
              [achievementId]: true,
            },
          },
        }));

        get().addNotification("success", message);
      },

      // ==========================================
      // NOTIFICATIONS SYSTEM
      // ==========================================
      addNotification: (type, message) => {
        const notification = {
          id: Date.now(),
          type,
          message,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          notifications: {
            ...state.notifications,
            queue: [...state.notifications.queue, notification],
            history: [...state.notifications.history, notification],
          },
        }));
      },

      removeNotification: (notificationId) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            queue: state.notifications.queue.filter(
              (n) => n.id !== notificationId
            ),
          },
        }));
      },

      // ==========================================
      // GAME MANAGEMENT
      // ==========================================
      saveGame: () => {
        // Zustand persist middleware handles this automatically
        console.log("Game saved automatically");
      },

      resetGame: () =>
        set(() => ({
          language: "en",
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
          gameSetup: {
            isCharacterCreated: false,
            gameStarted: false,
            currentDay: 1,
            gameSpeed: 1,
          },
          skills: {
            learned: ["HTML", "CSS"],
            available: [],
            skillTree: {
              // Reset all skills to initial state
              HTML: {
                cost: 0,
                learned: true,
                prerequisites: [],
                category: "frontend",
                description: "The foundation of web development",
              },
              CSS: {
                cost: 0,
                learned: true,
                prerequisites: [],
                category: "frontend",
                description: "Styling and layout for web pages",
              },
              // ... other skills reset to learned: false
            },
          },
          career: {
            currentPosition: null,
            experience: 0,
            workDaysCompleted: 0,
            performanceRating: 50,
            availableJobs: [],
            applications: [],
            interviews: [],
            jobHistory: [],
          },
          business: {
            ownedBusinesses: [],
            products: [],
            ideas: [],
            totalEarnings: 0,
            businessSkillBonus: 0,
          },
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
          education: {
            availableExams: [],
            currentStudy: null,
            studyProgress: 0,
          },
          gameProgress: {
            currentDay: 1,
            achievements: [],
            completedGoals: [],
            milestones: {
              firstJob: false,
              firstBusiness: false,
              firstProduct: false,
              millionaire: false,
              skillMaster: false,
            },
            statistics: {
              totalMoneyEarned: 0,
              totalSkillsLearned: 2,
              totalJobsCompleted: 0,
              totalProductsCreated: 0,
              daysPlayed: 1,
            },
          },
          notifications: {
            queue: [],
            history: [],
          },
        })),

      // ==========================================
      // DEBUG METHODS (for development)
      // ==========================================
      debug: {
        addMoney: (amount) => get().addMoney(amount, "debug"),
        addSkillPoints: (amount) =>
          set((state) => ({
            character: {
              ...state.character,
              skillPoints: state.character.skillPoints + amount,
            },
          })),
        setEnergy: (amount) =>
          set((state) => ({
            character: {
              ...state.character,
              energy: Math.max(0, Math.min(100, amount)),
            },
          })),
        unlockAllSkills: () => {
          const state = get();
          const updatedSkillTree = { ...state.skills.skillTree };
          Object.keys(updatedSkillTree).forEach((skillName) => {
            updatedSkillTree[skillName] = {
              ...updatedSkillTree[skillName],
              learned: true,
            };
          });

          set((state) => ({
            skills: {
              ...state.skills,
              skillTree: updatedSkillTree,
              learned: Object.keys(updatedSkillTree),
            },
          }));
        },
      },
    }),
    {
      name: "web-dev-sim-storage",
      partialize: (state) => ({
        language: state.language,
        character: state.character,
        gameSetup: state.gameSetup,
        skills: state.skills,
        career: state.career,
        business: state.business,
        life: state.life,
        education: state.education,
        gameProgress: state.gameProgress,
        notifications: state.notifications,
      }),
    }
  )
);

export default useGameStore;
