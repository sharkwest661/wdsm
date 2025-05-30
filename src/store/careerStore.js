// Updated Career Store with Simplified Job System
// src/store/careerStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCareerStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // SIMPLIFIED CAREER SYSTEM
      // ==========================================
      career: {
        currentPosition: null,
        experience: 0,
        workDaysCompleted: 0,
        performanceRating: 50, // 0-100
        applications: [],
        interviews: [],
        jobHistory: [],

        // Simplified Job Market
        availableJobs: [
          // JUNIOR LEVEL JOBS
          {
            id: "junior-frontend-1",
            title: "Junior Frontend Developer",
            company: "WebStart Inc.",
            level: "junior",
            track: "frontend",
            salary: 120,
            requirements: {
              education: "high_school",
              skills: ["HTML", "CSS", "JavaScript"],
              reputation: 15,
            },
            description: "Build user interfaces with HTML, CSS, and JavaScript",
          },
          {
            id: "junior-backend-1",
            title: "Junior Backend Developer",
            company: "DataCorp",
            level: "junior",
            track: "backend",
            salary: 130,
            requirements: {
              education: "high_school",
              skills: ["JavaScript", "Node.js"],
              reputation: 15,
            },
            description: "Develop server-side applications and APIs",
          },
          {
            id: "junior-fullstack-1",
            title: "Junior Full-Stack Developer",
            company: "TechFlow",
            level: "junior",
            track: "fullstack",
            salary: 140,
            requirements: {
              education: "high_school",
              skills: ["HTML", "CSS", "JavaScript", "Node.js"],
              reputation: 20,
            },
            description: "Work on both frontend and backend development",
          },

          // MIDDLE LEVEL JOBS
          {
            id: "middle-frontend-1",
            title: "Frontend Developer",
            company: "UIDesign Pro",
            level: "middle",
            track: "frontend",
            salary: 220,
            requirements: {
              education: "college",
              skills: ["HTML", "CSS", "JavaScript", "React"],
              reputation: 35,
            },
            description:
              "Create complex user interfaces with modern frameworks",
          },
          {
            id: "middle-backend-1",
            title: "Backend Developer",
            company: "ServerTech Ltd",
            level: "middle",
            track: "backend",
            salary: 240,
            requirements: {
              education: "college",
              skills: ["JavaScript", "Node.js", "SQL", "MongoDB"],
              reputation: 35,
            },
            description: "Build scalable backend systems and databases",
          },
          {
            id: "middle-mobile-1",
            title: "Mobile Developer",
            company: "AppMakers",
            level: "middle",
            track: "mobile",
            salary: 250,
            requirements: {
              education: "college",
              skills: ["JavaScript", "React", "React Native"],
              reputation: 40,
            },
            description: "Develop cross-platform mobile applications",
          },
          {
            id: "middle-fullstack-1",
            title: "Full-Stack Developer",
            company: "DevSolutions",
            level: "middle",
            track: "fullstack",
            salary: 260,
            requirements: {
              education: "college",
              skills: ["JavaScript", "React", "Node.js", "SQL"],
              reputation: 40,
            },
            description: "Handle complete web application development",
          },

          // SENIOR LEVEL JOBS
          {
            id: "senior-frontend-1",
            title: "Senior Frontend Developer",
            company: "Elite UI Corp",
            level: "senior",
            track: "frontend",
            salary: 380,
            requirements: {
              education: "university",
              skills: ["JavaScript", "React", "TypeScript"],
              reputation: 60,
            },
            description:
              "Lead frontend architecture and mentor junior developers",
          },
          {
            id: "senior-backend-1",
            title: "Senior Backend Developer",
            company: "ScaleTech",
            level: "senior",
            track: "backend",
            salary: 400,
            requirements: {
              education: "university",
              skills: ["Node.js", "SQL", "MongoDB", "Docker"],
              reputation: 60,
            },
            description: "Design scalable backend architectures",
          },
          {
            id: "senior-mobile-1",
            title: "Senior Mobile Developer",
            company: "MobileFirst Inc",
            level: "senior",
            track: "mobile",
            salary: 420,
            requirements: {
              education: "university",
              skills: ["React Native", "JavaScript", "React"],
              reputation: 65,
            },
            description: "Lead mobile development projects and architecture",
          },
          {
            id: "senior-fullstack-1",
            title: "Senior Full-Stack Developer",
            company: "TechLeaders",
            level: "senior",
            track: "fullstack",
            salary: 450,
            requirements: {
              education: "university",
              skills: ["JavaScript", "React", "Node.js", "SQL", "Docker"],
              reputation: 65,
            },
            description: "Lead full-stack development and mentor team members",
          },

          // TEAM LEAD JOBS
          {
            id: "lead-frontend-1",
            title: "Frontend Team Lead",
            company: "Innovation Labs",
            level: "team_lead",
            track: "frontend",
            salary: 550,
            requirements: {
              education: "university",
              skills: ["JavaScript", "React", "TypeScript"],
              reputation: 80,
            },
            description: "Lead frontend team and make technical decisions",
          },
          {
            id: "lead-backend-1",
            title: "Backend Team Lead",
            company: "CloudTech Solutions",
            level: "team_lead",
            track: "backend",
            salary: 580,
            requirements: {
              education: "university",
              skills: ["Node.js", "SQL", "MongoDB", "Docker", "AWS"],
              reputation: 80,
            },
            description: "Lead backend team and system architecture",
          },
          {
            id: "lead-mobile-1",
            title: "Mobile Team Lead",
            company: "AppInnovators",
            level: "team_lead",
            track: "mobile",
            salary: 600,
            requirements: {
              education: "university",
              skills: ["React Native", "JavaScript", "React"],
              reputation: 85,
            },
            description: "Lead mobile development team and strategy",
          },
          {
            id: "lead-fullstack-1",
            title: "Full-Stack Team Lead",
            company: "TechVision",
            level: "team_lead",
            track: "fullstack",
            salary: 650,
            requirements: {
              education: "university",
              skills: [
                "JavaScript",
                "React",
                "Node.js",
                "SQL",
                "Docker",
                "AWS",
              ],
              reputation: 85,
            },
            description: "Lead development team across full technology stack",
          },
        ],
      },

      // ==========================================
      // SIMPLIFIED JOB ACTIONS
      // ==========================================

      // Apply for job with simplified requirements check
      applyForJob: (jobId, characterStore, skillsStore) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);
        const character = characterStore.getState().character;

        if (!job) return { success: false, message: "Job not found" };

        // Check if already applied
        if (state.career.applications.some((app) => app.jobId === jobId)) {
          return { success: false, message: "Already applied to this job" };
        }

        // Check requirements
        if (job.requirements.reputation > character.reputation) {
          return { success: false, message: "Not enough reputation" };
        }

        // Check education requirements
        const educationOrder = [
          "none",
          "high_school",
          "college",
          "university",
          "academy",
        ];
        const requiredLevel = educationOrder.indexOf(
          job.requirements.education
        );
        const currentLevel = educationOrder.indexOf(character.education);
        if (currentLevel < requiredLevel) {
          return { success: false, message: "Education requirements not met" };
        }

        // Check skill requirements
        const hasRequiredSkills = skillsStore
          .getState()
          .hasRequiredSkills(job.requirements.skills);
        if (!hasRequiredSkills) {
          return {
            success: false,
            message: "Missing required technical skills",
          };
        }

        // Add application
        set((state) => ({
          career: {
            ...state.career,
            applications: [
              ...state.career.applications,
              {
                jobId,
                appliedDate: Date.now(),
                status: "pending",
              },
            ],
          },
        }));

        // 70% chance for interview
        setTimeout(() => {
          if (Math.random() < 0.7) {
            get().scheduleInterview(jobId);
          }
        }, 1000);

        return { success: true, message: "Application submitted successfully" };
      },

      scheduleInterview: (jobId) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);

        if (!job) return false;

        set((state) => ({
          career: {
            ...state.career,
            interviews: [
              ...state.career.interviews,
              {
                jobId,
                scheduledDate: Date.now() + 24 * 60 * 60 * 1000,
                status: "scheduled",
              },
            ],
          },
        }));

        return `Interview scheduled for ${job.title} at ${job.company}!`;
      },

      // Accept job and start working
      acceptJob: (jobId, characterStore) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);

        if (!job) return false;

        characterStore.getState().setCurrentJob(jobId);

        set((state) => ({
          career: {
            ...state.career,
            currentPosition: job,
            performanceRating: 50,
            workDaysCompleted: 0,
          },
        }));

        return true;
      },

      // Work a day and gain experience/money
      completeWorkDay: (characterStore) => {
        const state = get();
        const character = characterStore.getState().character;

        if (!state.career.currentPosition) return false;
        if (character.energy < 30) return false;

        const job = state.career.currentPosition;
        const technicalSkill = character.characterSkills.technical;
        const socialSkill = character.characterSkills.social;

        // Performance calculation (technical skill is most important for dev jobs)
        const energyFactor = character.energy / 100;
        const technicalFactor = technicalSkill / 10;
        const socialFactor = socialSkill / 10;

        // Technical skill weighted more heavily for development jobs
        const performanceScore =
          (technicalFactor * 0.6 + energyFactor * 0.25 + socialFactor * 0.15) *
          100;

        // Update performance rating (moving average)
        const newPerformanceRating =
          state.career.performanceRating * 0.8 + performanceScore * 0.2;

        // Calculate pay and bonuses
        const basePay = job.salary;
        const performanceMultiplier =
          performanceScore > 75 ? 1.2 : performanceScore < 40 ? 0.6 : 1.0;
        const dailyPay = Math.floor(basePay * performanceMultiplier);

        // Skill points earned (based on technical skill and performance)
        const skillPointsEarned =
          Math.floor(technicalSkill / 4) + (performanceScore > 80 ? 2 : 1);

        // Character skill experience (varies by job track)
        const trackSkillMapping = {
          frontend: "technical",
          backend: "technical",
          mobile: "technical",
          fullstack: "technical",
        };

        const primarySkill = trackSkillMapping[job.track] || "technical";

        // Award character skill experience
        characterStore
          .getState()
          .gainJobExperience(job.track, performanceScore);

        // Update character
        characterStore.getState().consumeEnergy(30);
        characterStore.getState().addSkillPoints(skillPointsEarned);
        characterStore.getState().addMoney(dailyPay, "job_salary");

        // Update career progress
        set((state) => ({
          career: {
            ...state.career,
            performanceRating: newPerformanceRating,
            workDaysCompleted: state.career.workDaysCompleted + 1,
            experience: state.career.experience + 1,
          },
        }));

        // Check for promotion or termination
        if (newPerformanceRating < 25 && state.career.workDaysCompleted >= 5) {
          setTimeout(() => {
            get().quitJob(characterStore);
          }, 500);

          return {
            performanceScore: Math.round(performanceScore),
            dailyPay,
            skillPointsEarned,
            fired: true,
            message: "You were fired for poor performance!",
          };
        }

        return {
          performanceScore: Math.round(performanceScore),
          dailyPay,
          skillPointsEarned,
          fired: false,
          newRating: Math.round(newPerformanceRating),
        };
      },

      quitJob: (characterStore) => {
        const state = get();
        if (!state.career.currentPosition) return false;

        // Add to job history
        const jobRecord = {
          ...state.career.currentPosition,
          startDate:
            Date.now() - state.career.workDaysCompleted * 24 * 60 * 60 * 1000,
          endDate: Date.now(),
          daysWorked: state.career.workDaysCompleted,
          finalPerformance: state.career.performanceRating,
        };

        characterStore.getState().setCurrentJob(null);

        set((state) => ({
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
      // JOB QUERIES
      // ==========================================

      // Get jobs available based on player's qualifications
      getAvailableJobs: (characterStore, skillsStore) => {
        const state = get();
        const character = characterStore.getState().character;

        return state.career.availableJobs.filter((job) => {
          // Check education requirements
          const educationOrder = [
            "none",
            "high_school",
            "college",
            "university",
            "academy",
          ];
          const requiredLevel = educationOrder.indexOf(
            job.requirements.education
          );
          const currentLevel = educationOrder.indexOf(character.education);

          return currentLevel >= requiredLevel;
        });
      },

      // Get jobs player is fully qualified for
      getEligibleJobs: (characterStore, skillsStore) => {
        const state = get();
        const character = characterStore.getState().character;

        return state.career.availableJobs.filter((job) => {
          // Check all requirements
          if (job.requirements.reputation > character.reputation) return false;

          // Check education
          const educationOrder = [
            "none",
            "high_school",
            "college",
            "university",
            "academy",
          ];
          const requiredLevel = educationOrder.indexOf(
            job.requirements.education
          );
          const currentLevel = educationOrder.indexOf(character.education);
          if (currentLevel < requiredLevel) return false;

          // Check skills
          return skillsStore
            .getState()
            .hasRequiredSkills(job.requirements.skills);
        });
      },

      getCurrentJob: () => {
        const state = get();
        return state.career.currentPosition;
      },

      getCareerStatistics: () => {
        const state = get();
        return {
          totalExperience: state.career.experience,
          currentPerformance: Math.round(state.career.performanceRating),
          totalJobsHeld:
            state.career.jobHistory.length +
            (state.career.currentPosition ? 1 : 0),
          currentJobLevel: state.career.currentPosition?.level || "none",
          currentJobTrack: state.career.currentPosition?.track || "none",
        };
      },

      // ==========================================
      // RESET CAREER
      // ==========================================
      resetCareer: () =>
        set((state) => ({
          career: {
            ...state.career,
            currentPosition: null,
            experience: 0,
            workDaysCompleted: 0,
            performanceRating: 50,
            applications: [],
            interviews: [],
            jobHistory: [],
          },
        })),
    }),
    {
      name: "web-dev-sim-career",
      partialize: (state) => ({
        career: state.career,
      }),
    }
  )
);

export default useCareerStore;
