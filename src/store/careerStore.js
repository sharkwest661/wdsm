// src/store/careerStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCareerStore = create(
  persist(
    (set, get) => ({
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
          {
            id: "mid-web-dev-1",
            title: "Mid-Level Web Developer",
            company: "DevSolutions",
            salary: 250,
            requirements: {
              education: "college",
              skills: ["JavaScript", "React", "Node.js", "SQL"],
              reputation: 40,
            },
            description: "Mid-level full-stack development position",
          },
          {
            id: "senior-web-dev-1",
            title: "Senior Full-Stack Developer",
            company: "TechCorp Elite",
            salary: 400,
            requirements: {
              education: "university",
              skills: ["JavaScript", "React", "Node.js", "SQL", "Docker"],
              reputation: 70,
            },
            description:
              "Senior development role with leadership responsibilities",
          },
        ],
        applications: [], // Applied jobs
        interviews: [], // Scheduled interviews
        jobHistory: [], // Previous jobs
      },

      // ==========================================
      // JOB SYSTEM ACTIONS
      // ==========================================
      applyForJob: (jobId, characterStore, skillsStore) => {
        const state = get();
        const job = state.career.availableJobs.find((j) => j.id === jobId);
        const character = characterStore.getState().character;

        if (!job) return false;

        // Check if already applied
        if (state.career.applications.some((app) => app.jobId === jobId))
          return false;

        // Check requirements
        if (job.requirements.reputation > character.reputation) return false;

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
          character.education
        );
        if (currentEducationLevel < requiredEducationLevel) return false;

        // Check skill requirements
        const hasRequiredSkills = skillsStore
          .getState()
          .hasRequiredSkills(job.requirements.skills);
        if (!hasRequiredSkills) return false;

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
                scheduledDate: Date.now() + 24 * 60 * 60 * 1000, // Next day
                status: "scheduled",
              },
            ],
          },
        }));

        return `Interview scheduled for ${job.title} at ${job.company}!`;
      },

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
      // WORK PERFORMANCE
      // ==========================================
      completeWorkDay: (characterStore) => {
        const state = get();
        const character = characterStore.getState().character;

        if (!state.career.currentPosition) return false;
        if (character.energy < 20) return false;

        const job = state.career.currentPosition;
        const technicalSkill = character.characterSkills.technical;

        // Performance calculation based on energy and technical skill
        const energyFactor = character.energy / 100;
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

        // Update character through character store
        characterStore.getState().consumeEnergy(25);
        characterStore.getState().addSkillPoints(skillPointsEarned);
        characterStore.getState().addMoney(dailyPay, "job_salary");

        set((state) => ({
          career: {
            ...state.career,
            performanceRating: newPerformanceRating,
            workDaysCompleted: state.career.workDaysCompleted + 1,
            experience: state.career.experience + 1,
          },
        }));

        // Check for termination
        if (newPerformanceRating < 30 && state.career.workDaysCompleted >= 5) {
          setTimeout(() => {
            get().quitJob(characterStore);
          }, 500);
          return {
            performanceScore,
            dailyPay,
            skillPointsEarned,
            fired: true,
          };
        }

        return {
          performanceScore,
          dailyPay,
          skillPointsEarned,
          fired: false,
        };
      },

      // ==========================================
      // JOB QUERIES
      // ==========================================
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
          const requiredEducationLevel = educationOrder.indexOf(
            job.requirements.education
          );
          const currentEducationLevel = educationOrder.indexOf(
            character.education
          );

          return currentEducationLevel >= requiredEducationLevel;
        });
      },

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
          const requiredEducationLevel = educationOrder.indexOf(
            job.requirements.education
          );
          const currentEducationLevel = educationOrder.indexOf(
            character.education
          );
          if (currentEducationLevel < requiredEducationLevel) return false;

          // Check skills
          const hasRequiredSkills = skillsStore
            .getState()
            .hasRequiredSkills(job.requirements.skills);
          return hasRequiredSkills;
        });
      },

      getCurrentJob: () => {
        const state = get();
        return state.career.currentPosition;
      },

      getJobHistory: () => {
        const state = get();
        return state.career.jobHistory;
      },

      getCareerStatistics: () => {
        const state = get();
        return {
          totalExperience: state.career.experience,
          currentPerformance: state.career.performanceRating,
          totalJobsHeld:
            state.career.jobHistory.length +
            (state.career.currentPosition ? 1 : 0),
          totalApplications: state.career.applications.length,
          totalInterviews: state.career.interviews.length,
        };
      },

      // ==========================================
      // RESET CAREER
      // ==========================================
      resetCareer: () =>
        set(() => ({
          career: {
            currentPosition: null,
            experience: 0,
            workDaysCompleted: 0,
            performanceRating: 50,
            availableJobs: get().career.availableJobs, // Keep the job listings
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
