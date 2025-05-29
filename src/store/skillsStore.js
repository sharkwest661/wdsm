// src/store/skillsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSkillsStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // TECHNICAL SKILLS SYSTEM
      // ==========================================
      skills: {
        learned: ["HTML", "CSS"], // Skills already learned
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
      // SKILLS SYSTEM ACTIONS
      // ==========================================
      learnSkill: (skillName, characterStore) => {
        const state = get();
        const skill = state.skills.skillTree[skillName];

        if (!skill || skill.learned) return false;

        const character = characterStore.getState().character;
        if (character.skillPoints < skill.cost) return false;

        // Check prerequisites
        const hasPrereqs = skill.prerequisites.every(
          (req) => state.skills.skillTree[req]?.learned
        );
        if (!hasPrereqs) return false;

        // Calculate skill point bonus from technical skill
        const technicalBonus = Math.floor(
          character.characterSkills.technical / 2
        );
        const reputationGain = 2 + technicalBonus;

        // Use character store methods
        const success = characterStore.getState().spendSkillPoints(skill.cost);
        if (!success) return false;

        characterStore.getState().addReputation(reputationGain);

        set((state) => ({
          skills: {
            ...state.skills,
            skillTree: {
              ...state.skills.skillTree,
              [skillName]: { ...skill, learned: true },
            },
            learned: [...state.skills.learned, skillName],
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

      getLearnedSkills: () => {
        const state = get();
        return state.skills.learned.map((skillName) => ({
          name: skillName,
          ...state.skills.skillTree[skillName],
        }));
      },

      getSkillsInCategory: (category) => {
        const state = get();
        return Object.entries(state.skills.skillTree)
          .filter(([name, skill]) => skill.category === category)
          .reduce((acc, [name, skill]) => {
            acc[name] = skill;
            return acc;
          }, {});
      },

      // Check if character has required skills for job/business
      hasRequiredSkills: (requiredSkills) => {
        const state = get();
        return requiredSkills.every(
          (skill) => state.skills.skillTree[skill]?.learned
        );
      },

      // Get total number of skills learned
      getTotalSkillsLearned: () => {
        const state = get();
        return state.skills.learned.length;
      },

      // Get skills count by category
      getSkillsCountByCategory: () => {
        const state = get();
        const counts = {};

        Object.values(state.skills.skillCategories).forEach((category) => {
          counts[category] = 0;
        });

        state.skills.learned.forEach((skillName) => {
          const skill = state.skills.skillTree[skillName];
          if (skill) {
            const categoryName = state.skills.skillCategories[skill.category];
            counts[categoryName] = (counts[categoryName] || 0) + 1;
          }
        });

        return counts;
      },

      // ==========================================
      // RESET SKILLS
      // ==========================================
      resetSkills: () =>
        set(() => ({
          skills: {
            learned: ["HTML", "CSS"],
            skillTree: {
              // Reset all skills to initial state (only HTML and CSS learned)
              ...Object.entries(get().skills.skillTree).reduce(
                (acc, [name, skill]) => {
                  acc[name] = {
                    ...skill,
                    learned: name === "HTML" || name === "CSS",
                  };
                  return acc;
                },
                {}
              ),
            },
            skillCategories: get().skills.skillCategories,
          },
        })),

      // ==========================================
      // DEBUG METHODS (for development)
      // ==========================================
      debug: {
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
        learnSpecificSkill: (skillName) => {
          const state = get();
          const skill = state.skills.skillTree[skillName];
          if (skill) {
            set((state) => ({
              skills: {
                ...state.skills,
                skillTree: {
                  ...state.skills.skillTree,
                  [skillName]: { ...skill, learned: true },
                },
                learned: state.skills.learned.includes(skillName)
                  ? state.skills.learned
                  : [...state.skills.learned, skillName],
              },
            }));
          }
        },
      },
    }),
    {
      name: "web-dev-sim-skills",
      partialize: (state) => ({
        skills: state.skills,
      }),
    }
  )
);

export default useSkillsStore;
