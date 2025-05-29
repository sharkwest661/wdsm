import React, { useState } from "react";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import TabNavigation from "./components/TabNavigation/TabNavigation";
import StatDisplay from "./components/StatDisplay/StatDisplay";
import Notification from "./components/Notification/Notification";
import SkillItem from "./components/SkillItem/SkillItem";
import "./App.scss";

const WebDevLifeSimulator = () => {
  const [activeTab, setActiveTab] = useState("character");
  const [notification, setNotification] = useState({
    visible: false,
    type: "info",
    message: "",
  });
  const [gameState, setGameState] = useState({
    character: {
      name: "Alex Developer",
      age: 21,
      money: 1500,
      reputation: 45,
      energy: 75,
      skillPoints: 12,
    },
    skills: {
      learned: ["HTML", "CSS"],
      available: ["JavaScript", "React", "Python", "Node.js"],
    },
  });

  const tabs = [
    { id: "character", emoji: "👤", label: "Character" },
    { id: "skills", emoji: "🔧", label: "Skills" },
    { id: "career", emoji: "🏢", label: "Career" },
    { id: "business", emoji: "💼", label: "Business" },
    { id: "life", emoji: "🏠", label: "Life" },
  ];

  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });
  };

  const closeNotification = () => {
    setNotification({ visible: false, type: "info", message: "" });
  };

  const learnSkill = (skillName, cost) => {
    if (gameState.character.skillPoints >= cost) {
      setGameState((prev) => ({
        ...prev,
        character: {
          ...prev.character,
          skillPoints: prev.character.skillPoints - cost,
        },
        skills: {
          ...prev.skills,
          learned: [...prev.skills.learned, skillName],
          available: prev.skills.available.filter(
            (skill) => skill !== skillName
          ),
        },
      }));
      showNotification("success", `🎉 Successfully learned ${skillName}!`);
    } else {
      showNotification(
        "warning",
        `❌ Not enough skill points to learn ${skillName}`
      );
    }
  };

  const mockSkills = [
    {
      name: "JavaScript",
      cost: 3,
      emoji: "🟨",
      requirements: ["HTML", "CSS"],
      description: "The programming language of the web",
    },
    {
      name: "React",
      cost: 4,
      emoji: "⚛️",
      requirements: ["JavaScript"],
      description: "Popular front-end library for building UIs",
    },
    {
      name: "Python",
      cost: 4,
      emoji: "🐍",
      requirements: [],
      description:
        "Versatile programming language for backend and data science",
    },
    {
      name: "Node.js",
      cost: 3,
      emoji: "🟢",
      requirements: ["JavaScript"],
      description: "JavaScript runtime for server-side development",
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
                  <div className="avatar-placeholder">👨‍💻</div>
                  <h2 className="character-name">{gameState.character.name}</h2>
                  <p className="character-age">
                    Age: {gameState.character.age}
                  </p>
                </div>
              </Card>

              <Card className="stats-card">
                <h3 className="text-card-title mb-lg">📊 Character Stats</h3>
                <div className="stats-grid">
                  <StatDisplay
                    emoji="💰"
                    label="Money"
                    value={gameState.character.money}
                    format="currency"
                    variant="highlighted"
                  />
                  <StatDisplay
                    emoji="⭐"
                    label="Reputation"
                    value={gameState.character.reputation}
                    maxValue={100}
                    format="number"
                  />
                  <StatDisplay
                    emoji="🔧"
                    label="Skill Points"
                    value={gameState.character.skillPoints}
                    format="number"
                    variant="highlighted"
                  />
                </div>

                <div className="energy-section mt-lg">
                  <ProgressBar
                    progress={gameState.character.energy}
                    max={100}
                    variant="energy"
                    label="⚡ Energy"
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
              <h3 className="text-card-title mb-lg">🔧 Technical Skills</h3>
              <div className="skills-info mb-lg">
                <StatDisplay
                  emoji="🔧"
                  label="Available Skill Points"
                  value={gameState.character.skillPoints}
                  size="large"
                  variant="highlighted"
                />
              </div>

              <div className="skills-grid">
                {mockSkills.map((skill) => {
                  const isLearned = gameState.skills.learned.includes(
                    skill.name
                  );
                  const isLocked = skill.requirements.some(
                    (req) => !gameState.skills.learned.includes(req)
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
                      onLearn={() => learnSkill(skill.name, skill.cost)}
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
              <h3 className="text-card-title mb-lg">🏢 Career Dashboard</h3>
              <div className="career-info">
                <p className="text-body mb-md">
                  👨‍🎓 Current Status: <strong>High School Graduate</strong>
                </p>
                <p className="text-secondary mb-lg">
                  Complete your education and build skills to unlock better job
                  opportunities!
                </p>

                <div className="action-buttons">
                  <Button variant="primary" size="large">
                    📚 Take College Exam
                  </Button>
                  <Button variant="secondary" size="large">
                    💼 Browse Jobs
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
              <h3 className="text-card-title mb-lg">💼 Business Empire</h3>
              <div className="business-info">
                <p className="text-body mb-md">
                  🚀 Ready to start your entrepreneurial journey?
                </p>
                <p className="text-secondary mb-lg">
                  Build products, start companies, and create your tech empire!
                </p>

                <div className="progress-section mb-lg">
                  <ProgressBar
                    progress={0}
                    max={100}
                    variant="warning"
                    label="💡 Product Ideas Generated"
                    showPercentage={false}
                  />
                </div>

                <Button variant="warning" size="large" disabled>
                  🏗️ Create First Product (University Required)
                </Button>
              </div>
            </Card>
          </div>
        );

      case "life":
        return (
          <div className="tab-content">
            <Card variant="life">
              <h3 className="text-card-title mb-lg">🏠 Life & Lifestyle</h3>
              <div className="life-sections">
                <div className="life-stats mb-lg">
                  <div className="life-stat-row">
                    <StatDisplay
                      emoji="🏠"
                      label="Housing"
                      value="Basic Apartment"
                      format="text"
                    />
                  </div>
                  <div className="life-stat-row">
                    <StatDisplay
                      emoji="💕"
                      label="Relationship Status"
                      value="Single"
                      format="text"
                    />
                  </div>
                </div>

                <div className="energy-actions">
                  <h4 className="text-subsection-title mb-md">
                    ⚡ Restore Energy
                  </h4>
                  <div className="action-buttons">
                    <Button
                      variant="info"
                      size="medium"
                      onClick={() =>
                        showNotification(
                          "success",
                          "🍕 Enjoyed a delicious meal! +20 Energy"
                        )
                      }
                    >
                      🍕 Eat Food
                    </Button>
                    <Button
                      variant="info"
                      size="medium"
                      onClick={() =>
                        showNotification(
                          "success",
                          "🎮 Had fun gaming! +15 Energy"
                        )
                      }
                    >
                      🎮 Play Games
                    </Button>
                    <Button
                      variant="info"
                      size="medium"
                      onClick={() =>
                        showNotification(
                          "success",
                          "😴 Good night sleep! +30 Energy"
                        )
                      }
                    >
                      😴 Sleep
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
        <header className="app-header">
          <h1 className="text-game-title">💻 Web Dev Life Simulator</h1>
          <p className="app-subtitle">
            Build your coding career, one skill at a time!
          </p>
        </header>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="app-main">{renderTabContent()}</main>

        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.visible}
          onClose={closeNotification}
        />
      </div>
    </div>
  );
};

export default WebDevLifeSimulator;
