import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Clean imports from organized folders
import {
  Card,
  Button,
  ProgressBar,
  TabNavigation,
  StatDisplay,
  Notification,
  Avatar,
} from "./ui";

import LanguageSelector from "./ui/LanguageSelector/LanguageSelector";

import { SkillItem } from "./components";
import CharacterSkillManager from "./components/CharacterSkillManager/CharacterSkillManager";
import { CharacterCreation } from "./pages";

// Import modular stores
import {
  useAppStore,
  useCharacterStore,
  useSkillsStore,
  useCareerStore,
  useLifeStore,
  useNotificationStore,
} from "./store";

import "./App.scss";

const WebDevLifeSimulator = () => {
  const { t, i18n } = useTranslation();

  // Correct Zustand usage - selective state picking from modular stores
  const character = useCharacterStore((state) => state.character);
  const gameSetup = useAppStore((state) => state.gameSetup);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  // Skills store
  const skillTree = useSkillsStore((state) => state.skills.skillTree);
  const learnSkill = useSkillsStore((state) => state.learnSkill);

  // Career store
  const getAvailableJobs = useCareerStore((state) => state.getAvailableJobs);
  const getCurrentJob = useCareerStore((state) => state.getCurrentJob);
  const applyForJob = useCareerStore((state) => state.applyForJob);
  const completeWorkDay = useCareerStore((state) => state.completeWorkDay);

  // Life store actions
  const eatFood = useLifeStore((state) => state.eatFood);
  const playGames = useLifeStore((state) => state.playGames);
  const sleep = useLifeStore((state) => state.sleep);

  // Character store actions
  const takeExam = useCharacterStore((state) => state.takeExam);
  const improveCharacterSkill = useCharacterStore(
    (state) => state.improveCharacterSkill
  );
  const takeOnlineCourse = useCharacterStore((state) => state.takeOnlineCourse);
  const attendNetworkingEvent = useCharacterStore(
    (state) => state.attendNetworkingEvent
  );
  const readBusinessBook = useCharacterStore((state) => state.readBusinessBook);
  const doCreativeHobby = useCharacterStore((state) => state.doCreativeHobby);
  const startNewDay = useCharacterStore((state) => state.startNewDay);

  // Notification store
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const notifications = useNotificationStore(
    (state) => state.notifications.queue
  );
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  );

  const [activeTab, setActiveTab] = useState("character");
  const [showSkillManager, setShowSkillManager] = useState(false);

  // Get current job
  const currentJob = getCurrentJob();
  const availableJobs = getAvailableJobs(useCharacterStore, useSkillsStore);

  // Initialize language from store
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Sync language changes with store
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n, setLanguage]);

  // Show character creation if character hasn't been created yet
  if (!gameSetup.isCharacterCreated) {
    return <CharacterCreation />;
  }

  const tabs = [
    { id: "character", emoji: "👤", label: t("tabs.character") },
    { id: "skills", emoji: "🔧", label: t("tabs.skills") },
    { id: "career", emoji: "🏢", label: t("tabs.career") },
    { id: "business", emoji: "💼", label: t("tabs.business") },
    { id: "life", emoji: "🏠", label: t("tabs.life") },
  ];

  const showNotification = (type, message) => {
    addNotification(type, message);
  };

  const closeNotification = (notificationId) => {
    removeNotification(notificationId);
  };

  const handleLearnSkill = (skillName, cost) => {
    const success = learnSkill(skillName, useCharacterStore);
    if (success) {
      showNotification(
        "success",
        t("skills.learnSuccess", { skill: skillName })
      );
    } else {
      showNotification(
        "warning",
        t("skills.learnFailed", { skill: skillName })
      );
    }
  };

  // Handle new day
  const handleNewDay = () => {
    startNewDay();
    showNotification("info", t("game.newDay"));
  };

  // Handle character skill improvement
  const handleImproveCharacterSkill = (skillName, pointsToSpend) => {
    const success = improveCharacterSkill(skillName, pointsToSpend);
    if (success) {
      showNotification(
        "success",
        `🎉 Improved ${t(`characterCreation.skillNames.${skillName}`)}!`
      );
      return true;
    } else {
      showNotification("warning", "❌ Cannot improve this skill right now");
      return false;
    }
  };

  // Handle life activities
  const handleEatFood = () => {
    const result = eatFood(useCharacterStore);
    if (result.success) {
      showNotification("success", t("life.energyRestored.food"));
    } else {
      showNotification("warning", "Not enough money for food!");
    }
  };

  const handlePlayGames = () => {
    const result = playGames(useCharacterStore);
    if (result.success) {
      showNotification("success", t("life.energyRestored.games"));
    } else {
      showNotification("warning", "Not enough money for games!");
    }
  };

  const handleSleep = () => {
    const result = sleep(useCharacterStore);
    showNotification("success", t("life.energyRestored.sleep"));
  };

  // Handle skill development activities
  const handleTakeOnlineCourse = () => {
    const result = takeOnlineCourse("Web Development");
    if (result.success) {
      showNotification("success", t("life.skillActivities.onlineCourse"));
    } else {
      showNotification("warning", result.message);
    }
  };

  const handleAttendNetworking = () => {
    const result = attendNetworkingEvent();
    if (result.success) {
      showNotification("success", t("life.skillActivities.networking"));
    } else {
      showNotification("warning", result.message);
    }
  };

  const handleReadBusinessBook = () => {
    const result = readBusinessBook();
    if (result.success) {
      showNotification("success", t("life.skillActivities.businessBook"));
    } else {
      showNotification("warning", result.message);
    }
  };

  const handleCreativeHobby = () => {
    const result = doCreativeHobby("Drawing");
    if (result.success) {
      showNotification("success", t("life.skillActivities.creativeHobby"));
    } else {
      showNotification("warning", result.message);
    }
  };

  // Handle career actions
  const handleTakeExam = (examType, cost) => {
    const success = takeExam(examType, cost);
    if (success) {
      showNotification(
        "success",
        t("career.examSuccess", { examType: t(`career.statuses.${examType}`) })
      );
    } else {
      showNotification(
        "warning",
        t("career.examFailed", {
          examType: t(`career.statuses.${examType}`),
          cost,
        })
      );
    }
  };

  const handleApplyForJob = (jobId) => {
    const result = applyForJob(jobId, useCharacterStore, useSkillsStore);
    if (result.success) {
      showNotification("success", result.message);
    } else {
      showNotification("warning", result.message);
    }
  };

  const handleWorkDay = () => {
    const result = completeWorkDay(useCharacterStore);
    if (result) {
      if (result.fired) {
        showNotification("warning", t("career.workDayFired"));
      } else {
        showNotification(
          "success",
          t("career.workDaySuccess", {
            performance: result.performanceScore,
            pay: result.dailyPay,
            skillPoints: result.skillPointsEarned,
          })
        );
      }
    } else {
      showNotification(
        "warning",
        "Cannot work today - need more energy or no job!"
      );
    }
  };

  // Mock skills data
  const mockSkills = [
    {
      name: "JavaScript",
      cost: 3,
      emoji: "🟨",
      requirements: ["HTML", "CSS"],
      description: t("skills.skills.JavaScript"),
    },
    {
      name: "React",
      cost: 4,
      emoji: "⚛️",
      requirements: ["JavaScript"],
      description: t("skills.skills.React"),
    },
    {
      name: "Python",
      cost: 4,
      emoji: "🐍",
      requirements: [],
      description: t("skills.skills.Python"),
    },
    {
      name: "Node.js",
      cost: 3,
      emoji: "🟢",
      requirements: ["JavaScript"],
      description: t("skills.skills.Node.js"),
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "character":
        return (
          <div className="tab-content">
            <div className="character-layout">
              <Card variant="character" className="character-card">
                <div className="character-card__avatar">
                  <div className="avatar-placeholder">
                    <Avatar
                      size={120}
                      seed={character.avatar.seed}
                      backgroundColor={character.avatar.backgroundColor}
                      primaryColor={character.avatar.primaryColor}
                    />
                  </div>
                  <h2 className="character-name">{character.name}</h2>
                  <p className="character-age">
                    {t("character.age", { age: character.age })}
                  </p>
                </div>
              </Card>

              <Card className="stats-card">
                <h3 className="text-card-title mb-lg">
                  {t("character.characterStats")}
                </h3>
                <div className="stats-grid">
                  <StatDisplay
                    emoji="💰"
                    label={t("stats.money")}
                    value={character.money}
                    format="currency"
                    variant="highlighted"
                  />
                  <StatDisplay
                    emoji="⭐"
                    label={t("stats.reputation")}
                    value={character.reputation}
                    maxValue={100}
                    format="number"
                  />
                  <StatDisplay
                    emoji="🔧"
                    label={t("stats.skillPoints")}
                    value={character.skillPoints}
                    format="number"
                    variant="highlighted"
                  />
                </div>

                <div className="energy-section mt-lg">
                  <ProgressBar
                    progress={character.energy}
                    max={100}
                    variant="energy"
                    label={`⚡ ${t("stats.energy")}`}
                    showPercentage={true}
                    size="large"
                    animated={true}
                  />
                </div>

                {/* Character Skills Section */}
                <div className="character-skills-section mt-lg">
                  <div className="character-skills-header">
                    <h4 className="text-subsection-title">
                      📊 Character Skills
                    </h4>
                    {character.availableCharacterSkillPoints > 0 && (
                      <Button
                        variant="warning"
                        size="small"
                        onClick={() => setShowSkillManager(true)}
                      >
                        💪 Improve Skills (
                        {character.availableCharacterSkillPoints})
                      </Button>
                    )}
                  </div>

                  <div className="character-skills-grid">
                    {Object.entries(character.characterSkills).map(
                      ([skillName, level]) => (
                        <div key={skillName} className="character-skill-item">
                          <span className="skill-name">
                            {t(`characterCreation.skillNames.${skillName}`)}
                          </span>
                          <span className="skill-level">{level}/10</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Game Controls */}
                <div className="game-controls mt-lg">
                  <Button
                    variant="info"
                    size="large"
                    fullWidth
                    onClick={handleNewDay}
                  >
                    🌅 Start New Day
                  </Button>
                </div>
              </Card>
            </div>

            {/* Character Skill Manager Modal */}
            {showSkillManager && (
              <div className="modal-overlay">
                <CharacterSkillManager
                  character={character}
                  onImproveSkill={handleImproveCharacterSkill}
                  onClose={() => setShowSkillManager(false)}
                />
              </div>
            )}
          </div>
        );

      case "skills":
        return (
          <div className="tab-content">
            <Card>
              <h3 className="text-card-title mb-lg">{t("skills.title")}</h3>
              <div className="skills-info mb-lg">
                <StatDisplay
                  emoji="🔧"
                  label={t("stats.availableSkillPoints")}
                  value={character.skillPoints}
                  size="large"
                  variant="highlighted"
                />
              </div>

              <div className="skills-grid">
                {mockSkills.map((skill) => {
                  const skillData = skillTree[skill.name];
                  const isLearned = skillData?.learned || false;
                  const isLocked = skill.requirements.some(
                    (req) => !skillTree[req]?.learned
                  );

                  return (
                    <SkillItem
                      key={skill.name}
                      name={skill.name}
                      cost={skill.cost}
                      emoji={skill.emoji}
                      description={skill.description}
                      requirements={skill.requirements}
                      isLearned={isLearned}
                      isLocked={isLocked}
                      onLearn={() => handleLearnSkill(skill.name, skill.cost)}
                    />
                  );
                })}
              </div>
            </Card>
          </div>
        );

      case "career":
        const currentEducation = character.education;
        const educationStatusKey = `career.statuses.${currentEducation}`;

        const examOptions = {
          none: {
            next: "high_school",
            cost: 500,
            examKey: "takeHighSchoolExam",
          },
          high_school: {
            next: "college",
            cost: 1000,
            examKey: "takeCollegeExam",
          },
          college: {
            next: "university",
            cost: 2500,
            examKey: "takeUniversityExam",
          },
        };

        const currentExamOption = examOptions[currentEducation];
        const canBrowseJobs = currentEducation !== "none";

        return (
          <div className="tab-content">
            <Card>
              <h3 className="text-card-title mb-lg">{t("career.title")}</h3>

              {/* Current Status */}
              <div className="career-info mb-lg">
                <p
                  className="text-body mb-md"
                  dangerouslySetInnerHTML={{
                    __html: t("career.currentStatus", {
                      status: t(educationStatusKey),
                    }),
                  }}
                />

                {currentJob ? (
                  <div className="current-job-info">
                    <p className="text-body mb-md">
                      {t("career.currentJob", {
                        title: currentJob.title,
                        company: currentJob.company,
                      })}
                    </p>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleWorkDay}
                      disabled={character.energy < 30}
                    >
                      {t("career.workDay")}
                    </Button>
                  </div>
                ) : (
                  <p className="text-secondary mb-md">
                    {t("career.noCurrentJob")}
                  </p>
                )}
              </div>

              {/* Education */}
              {currentExamOption && (
                <div className="education-section mb-lg">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() =>
                      handleTakeExam(
                        currentExamOption.next,
                        currentExamOption.cost
                      )
                    }
                    disabled={character.money < currentExamOption.cost}
                  >
                    {t(`career.${currentExamOption.examKey}`)}
                  </Button>

                  {character.money < currentExamOption.cost && (
                    <p
                      className="text-secondary mt-md"
                      style={{ color: "#fa709a" }}
                    >
                      💰 Need {currentExamOption.cost}₼ for exam (You have{" "}
                      {character.money}₼)
                    </p>
                  )}
                </div>
              )}

              {/* Jobs */}
              {canBrowseJobs && (
                <div className="jobs-section">
                  <h4 className="text-subsection-title mb-md">
                    💼 Available Jobs
                  </h4>
                  <div className="jobs-grid">
                    {availableJobs.slice(0, 6).map((job) => (
                      <div key={job.id} className="job-item">
                        <h5 className="job-title">{job.title}</h5>
                        <p className="job-company">{job.company}</p>
                        <p className="job-salary">{job.salary}₼/day</p>
                        <p className="job-level">
                          {t(`career.jobLevels.${job.level}`)}{" "}
                          {t(`career.jobTracks.${job.track}`)}
                        </p>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleApplyForJob(job.id)}
                        >
                          {t("career.applyForJob")}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!canBrowseJobs && (
                <p className="text-secondary">{t("career.noJobsAvailable")}</p>
              )}
            </Card>
          </div>
        );

      case "business":
        const canCreateProducts =
          character.education === "university" ||
          character.education === "academy";

        return (
          <div className="tab-content">
            <Card variant="business">
              <h3 className="text-card-title mb-lg">{t("business.title")}</h3>
              <div className="business-info">
                <p className="text-body mb-md">{t("business.readyToStart")}</p>
                <p className="text-secondary mb-lg">
                  {t("business.description")}
                </p>

                <div className="progress-section mb-lg">
                  <ProgressBar
                    progress={0}
                    max={100}
                    variant="warning"
                    label={t("business.productIdeas")}
                    showPercentage={false}
                  />
                </div>

                {canCreateProducts ? (
                  <Button variant="warning" size="large">
                    {t("business.createFirstProduct")}
                  </Button>
                ) : (
                  <div>
                    <Button variant="warning" size="large" disabled>
                      {t("business.createFirstProduct")}
                    </Button>
                    <p
                      className="text-secondary mt-md"
                      style={{ color: "#fa709a" }}
                    >
                      {t("business.requiresUniversity")}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case "life":
        return (
          <div className="tab-content">
            <Card variant="life">
              <h3 className="text-card-title mb-lg">{t("life.title")}</h3>
              <div className="life-sections">
                <div className="life-stats mb-lg">
                  <div className="life-stat-row">
                    <StatDisplay
                      emoji="🏠"
                      label={t("life.housing")}
                      value={t("life.basicApartment")}
                      format="text"
                    />
                  </div>
                  <div className="life-stat-row">
                    <StatDisplay
                      emoji="💕"
                      label={t("life.relationshipStatus")}
                      value={t("life.single")}
                      format="text"
                    />
                  </div>
                </div>

                {/* Energy Activities */}
                <div className="energy-actions mb-lg">
                  <h4 className="text-subsection-title mb-md">
                    {t("life.restoreEnergy")}
                  </h4>
                  <div className="action-buttons">
                    <Button
                      variant="info"
                      size="medium"
                      onClick={handleEatFood}
                      disabled={character.money < 25}
                    >
                      {t("life.eatFood")}
                    </Button>
                    <Button
                      variant="info"
                      size="medium"
                      onClick={handlePlayGames}
                      disabled={character.money < 15}
                    >
                      {t("life.playGames")}
                    </Button>
                    <Button variant="info" size="medium" onClick={handleSleep}>
                      {t("life.sleep")}
                    </Button>
                  </div>
                </div>

                {/* Skill Development Activities */}
                <div className="skill-development-actions">
                  <h4 className="text-subsection-title mb-md">
                    {t("life.developSkills")}
                  </h4>
                  <div className="action-buttons">
                    <Button
                      variant="success"
                      size="medium"
                      onClick={handleTakeOnlineCourse}
                      disabled={character.money < 200 || character.energy < 30}
                    >
                      {t("life.takeOnlineCourse")}
                    </Button>
                    <Button
                      variant="success"
                      size="medium"
                      onClick={handleAttendNetworking}
                      disabled={character.money < 100 || character.energy < 25}
                    >
                      {t("life.attendNetworking")}
                    </Button>
                    <Button
                      variant="success"
                      size="medium"
                      onClick={handleReadBusinessBook}
                      disabled={character.energy < 20}
                    >
                      {t("life.readBusinessBook")}
                    </Button>
                    <Button
                      variant="success"
                      size="medium"
                      onClick={handleCreativeHobby}
                      disabled={character.money < 50 || character.energy < 15}
                    >
                      {t("life.doCreativeHobby")}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Language Selector */}
        <div className="app-language-selector">
          <LanguageSelector variant="dropdown" />
        </div>

        <header className="app-header">
          <h1 className="text-game-title">{t("game.title")}</h1>
          <p className="app-subtitle">
            {t("game.subtitle", { name: character.name })}
          </p>
        </header>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="app-main">{renderTabContent()}</main>

        {/* Render notifications from notification store */}
        {notifications?.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            isVisible={true}
            onClose={() => closeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default WebDevLifeSimulator;
