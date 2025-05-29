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

  // Life store actions
  const eatFood = useLifeStore((state) => state.eatFood);
  const playGames = useLifeStore((state) => state.playGames);
  const sleep = useLifeStore((state) => state.sleep);

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
    // Pass the character store to the skills store learn function
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

  // Mock skills data - TODO: Move to skills store or fetch from store
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
              </Card>
            </div>
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
        return (
          <div className="tab-content">
            <Card>
              <h3 className="text-card-title mb-lg">{t("career.title")}</h3>
              <div className="career-info">
                <p
                  className="text-body mb-md"
                  dangerouslySetInnerHTML={{
                    __html: t("career.currentStatus", {
                      status: t("career.statuses.highSchoolGraduate"),
                    }),
                  }}
                />
                <p className="text-secondary mb-lg">
                  {t("career.statusDescription")}
                </p>

                <div className="action-buttons">
                  <Button variant="primary" size="large">
                    {t("career.takeCollegeExam")}
                  </Button>
                  <Button variant="secondary" size="large">
                    {t("career.browseJobs")}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );

      case "business":
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

                <Button variant="warning" size="large" disabled>
                  {t("business.createFirstProduct")}
                </Button>
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

                <div className="energy-actions">
                  <h4 className="text-subsection-title mb-md">
                    {t("life.restoreEnergy")}
                  </h4>
                  <div className="action-buttons">
                    <Button
                      variant="info"
                      size="medium"
                      onClick={handleEatFood}
                    >
                      {t("life.eatFood")}
                    </Button>
                    <Button
                      variant="info"
                      size="medium"
                      onClick={handlePlayGames}
                    >
                      {t("life.playGames")}
                    </Button>
                    <Button variant="info" size="medium" onClick={handleSleep}>
                      {t("life.sleep")}
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
        {notifications.map((notification) => (
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
