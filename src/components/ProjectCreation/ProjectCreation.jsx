// src/components/ProjectCreation/ProjectCreation.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import ProgressBar from "../../ui/ProgressBar/ProgressBar";
import StatDisplay from "../../ui/StatDisplay/StatDisplay";
import styles from "./ProjectCreation.module.scss";

// Import modular stores
import {
  useBusinessStore,
  useCharacterStore,
  useSkillsStore,
  useNotificationStore,
} from "../../store";

const ProjectCreation = ({ onClose }) => {
  const { t } = useTranslation();

  // Store hooks
  const character = useCharacterStore((state) => state.character);
  const generateProductIdea = useBusinessStore(
    (state) => state.generateProductIdea
  );
  const startProductDevelopment = useBusinessStore(
    (state) => state.startProductDevelopment
  );
  const continueProductDevelopment = useBusinessStore(
    (state) => state.continueProductDevelopment
  );
  const debugProduct = useBusinessStore((state) => state.debugProduct);
  const launchProduct = useBusinessStore((state) => state.launchProduct);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  // Local state
  const [currentIdeas, setCurrentIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [stage, setStage] = useState("ideation"); // ideation, development, debugging, launching, complete
  const [currentProduct, setCurrentProduct] = useState(null);
  const [devGameActive, setDevGameActive] = useState(false);
  const [debugGameActive, setDebugGameActive] = useState(false);
  const [devGameScore, setDevGameScore] = useState(0);
  const [bugsFixed, setBugsFixed] = useState(0);
  const [launchResults, setLaunchResults] = useState(null);

  // Get the product from the business store
  const getCurrentProduct = useBusinessStore(
    (state) => state.business.currentDevelopment
  );

  // Get player's learned skills
  const learnedSkills = useSkillsStore((state) => state.skills.learned);

  // Sync with business store's current development
  useEffect(() => {
    if (getCurrentProduct) {
      setCurrentProduct(getCurrentProduct);

      // Update stage based on product development stage
      if (getCurrentProduct.developmentStage === "development") {
        setStage("development");
      } else if (getCurrentProduct.developmentStage === "debugging") {
        setStage("debugging");
      } else if (getCurrentProduct.developmentStage === "ready") {
        setStage("launching");
      }
    }
  }, [getCurrentProduct]);

  // Generate new idea
  const handleGenerateIdea = () => {
    if (character.energy < 10) {
      addNotification("warning", t("business.notEnoughEnergy"));
      return;
    }

    useCharacterStore.getState().consumeEnergy(10);
    const newIdea = generateProductIdea(useCharacterStore);
    setCurrentIdeas((prev) => [...prev, newIdea]);
    addNotification("success", t("business.ideaGenerated"));
  };

  // Select an idea
  const handleSelectIdea = (ideaId) => {
    setSelectedIdeaId(ideaId);
  };

  // Start development on selected idea
  const handleStartDevelopment = () => {
    if (!selectedIdeaId) return;

    const result = startProductDevelopment(
      selectedIdeaId,
      useCharacterStore,
      useSkillsStore
    );

    if (result.success) {
      setStage("development");
      setCurrentProduct(result.product);
      addNotification("success", t("business.developmentStarted"));
    } else {
      addNotification("warning", result.message);
    }
  };

  // Simulate development mini-game
  const handleDevelopmentCycle = () => {
    if (stage !== "development") return;

    // Start development mini-game
    setDevGameActive(true);

    // Simulate a random score for demo purposes
    // In a real implementation, this would be a proper mini-game
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 40) + 60; // 60-100
      setDevGameScore(randomScore);

      const result = continueProductDevelopment(randomScore, useCharacterStore);

      if (result.success) {
        setCurrentProduct(result.product);

        // Show progress notification
        addNotification(
          "info",
          `+${result.progressGain}% Development Progress ${
            result.newBugs > 0 ? `(${result.newBugs} new bugs found)` : ""
          }`
        );

        // If development complete, move to debugging
        if (result.isComplete) {
          setStage("debugging");
          addNotification("success", t("business.developmentComplete"));
        }
      } else {
        addNotification("warning", result.message);
      }

      // End mini-game
      setTimeout(() => {
        setDevGameActive(false);
        setDevGameScore(0);
      }, 1500);
    }, 1500);
  };

  // Simulate debugging mini-game
  const handleDebuggingCycle = () => {
    if (stage !== "debugging") return;

    // Start debugging mini-game
    setDebugGameActive(true);

    // Simulate a random number of bugs fixed for demo purposes
    // In a real implementation, this would be a proper mini-game
    setTimeout(() => {
      const fixedCount = Math.min(
        Math.floor(Math.random() * 3) + 1,
        currentProduct.bugs
      );
      setBugsFixed(fixedCount);

      const result = debugProduct(fixedCount, useCharacterStore);

      if (result.success) {
        setCurrentProduct(result.product);

        // Show progress notification
        addNotification(
          "info",
          `Fixed ${result.bugsFixed} bugs! ${result.product.bugs} remaining.`
        );

        // If debugging complete, move to launching
        if (result.isComplete) {
          setStage("launching");
          addNotification("success", t("business.debuggingComplete"));
        }
      } else {
        addNotification("warning", result.message);
      }

      // End mini-game
      setTimeout(() => {
        setDebugGameActive(false);
        setBugsFixed(0);
      }, 1500);
    }, 1500);
  };

  // Launch product
  const handleLaunchProduct = () => {
    if (stage !== "launching") return;

    const result = launchProduct(useCharacterStore);

    if (result.success) {
      setStage("complete");
      setLaunchResults(result);
      addNotification(
        result.isProductSuccessful ? "success" : "info",
        result.message
      );
    } else {
      addNotification("warning", result.message);
    }
  };

  // Check if player has required skills for an idea
  const hasRequiredSkills = (skills) => {
    return skills.every((skill) => learnedSkills.includes(skill));
  };

  // Render different stages
  const renderIdeationStage = () => (
    <div className={styles.ideationStage}>
      <div className={styles.stageHeader}>
        <h3 className={styles.stageTitle}>💡 Generate Product Ideas</h3>
        <Button
          variant="warning"
          onClick={handleGenerateIdea}
          disabled={character.energy < 10}
        >
          Generate New Idea (10 Energy)
        </Button>
      </div>

      <div className={styles.ideasList}>
        {currentIdeas.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              No ideas yet. Click the button above to generate your first
              product idea!
            </p>
          </div>
        ) : (
          currentIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`${styles.ideaItem} ${
                selectedIdeaId === idea.id ? styles.ideaItemSelected : ""
              }`}
              onClick={() => handleSelectIdea(idea.id)}
            >
              <div className={styles.ideaHeader}>
                <h4 className={styles.ideaTitle}>{idea.name}</h4>
                <span className={styles.ideaType}>{idea.typeName}</span>
              </div>

              <p className={styles.ideaDescription}>{idea.description}</p>

              <div className={styles.ideaDetails}>
                <div className={styles.ideaQuality}>
                  <span className={styles.qualityLabel}>Quality:</span>
                  <span className={styles.qualityValue}>{idea.quality}/10</span>
                </div>

                <div className={styles.ideaSkills}>
                  <span className={styles.skillsLabel}>Required Skills:</span>
                  <div className={styles.skillsList}>
                    {idea.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className={`${styles.skillBadge} ${
                          learnedSkills.includes(skill)
                            ? styles.skillKnown
                            : styles.skillUnknown
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedIdeaId && (
        <div className={styles.actionSection}>
          <Button
            variant="success"
            size="large"
            onClick={handleStartDevelopment}
            disabled={
              !hasRequiredSkills(
                currentIdeas.find((i) => i.id === selectedIdeaId)
                  ?.requiredSkills || []
              )
            }
          >
            Start Development
          </Button>
          {!hasRequiredSkills(
            currentIdeas.find((i) => i.id === selectedIdeaId)?.requiredSkills ||
              []
          ) && (
            <p className={styles.warningText}>
              You don't have all the required skills for this project.
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderDevelopmentStage = () => (
    <div className={styles.developmentStage}>
      <div className={styles.stageHeader}>
        <h3 className={styles.stageTitle}>🏗️ Development Stage</h3>
      </div>

      <div className={styles.productInfo}>
        <h4 className={styles.productTitle}>{currentProduct?.name}</h4>
        <p className={styles.productType}>{currentProduct?.type}</p>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Development Progress:</span>
          <span className={styles.progressValue}>
            {currentProduct?.developmentProgress}%
          </span>
        </div>
        <ProgressBar
          progress={currentProduct?.developmentProgress || 0}
          max={100}
          variant="success"
          size="large"
          animated={true}
        />
      </div>

      <div className={styles.bugsSection}>
        <span className={styles.bugsLabel}>Bugs Found:</span>
        <span className={styles.bugsValue}>{currentProduct?.bugs || 0}</span>
      </div>

      {devGameActive ? (
        <div className={styles.miniGame}>
          <div className={styles.miniGameContent}>
            <h4 className={styles.miniGameTitle}>Coding in progress...</h4>
            <div className={styles.miniGameAnimation}>
              {/* Mini-game animation would go here */}
              <div className={styles.codingAnimation}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={styles.codingLine}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
            <div className={styles.miniGameScore}>
              {devGameScore > 0 && (
                <div className={styles.scoreDisplay}>
                  Performance: {devGameScore}%
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.actionSection}>
          <Button
            variant="primary"
            size="large"
            onClick={handleDevelopmentCycle}
            disabled={character.energy < 25}
          >
            Write Code (25 Energy)
          </Button>
          {character.energy < 25 && (
            <p className={styles.warningText}>
              Not enough energy to continue development.
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderDebuggingStage = () => (
    <div className={styles.debuggingStage}>
      <div className={styles.stageHeader}>
        <h3 className={styles.stageTitle}>🐛 Debugging Stage</h3>
      </div>

      <div className={styles.productInfo}>
        <h4 className={styles.productTitle}>{currentProduct?.name}</h4>
        <p className={styles.productType}>{currentProduct?.type}</p>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Debugging Progress:</span>
          <span className={styles.progressValue}>
            {currentProduct?.debuggingProgress}%
          </span>
        </div>
        <ProgressBar
          progress={currentProduct?.debuggingProgress || 0}
          max={100}
          variant="warning"
          size="large"
          animated={true}
        />
      </div>

      <div className={styles.bugsSection}>
        <span className={styles.bugsLabel}>Remaining Bugs:</span>
        <span className={styles.bugsValue}>{currentProduct?.bugs || 0}</span>
      </div>

      {debugGameActive ? (
        <div className={styles.miniGame}>
          <div className={styles.miniGameContent}>
            <h4 className={styles.miniGameTitle}>Hunting bugs...</h4>
            <div className={styles.miniGameAnimation}>
              {/* Debug mini-game animation would go here */}
              <div className={styles.debugAnimation}>
                <div className={styles.bugIcon}>🐛</div>
              </div>
            </div>
            <div className={styles.miniGameScore}>
              {bugsFixed > 0 && (
                <div className={styles.scoreDisplay}>
                  Bugs fixed: {bugsFixed}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.actionSection}>
          <Button
            variant="warning"
            size="large"
            onClick={handleDebuggingCycle}
            disabled={character.energy < 20 || currentProduct?.bugs === 0}
          >
            Debug Code (20 Energy)
          </Button>
          {character.energy < 20 && (
            <p className={styles.warningText}>
              Not enough energy to continue debugging.
            </p>
          )}
          {currentProduct?.bugs === 0 && (
            <p className={styles.infoText}>
              No bugs to fix! Continue debugging to reach 100%.
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderLaunchingStage = () => (
    <div className={styles.launchingStage}>
      <div className={styles.stageHeader}>
        <h3 className={styles.stageTitle}>🚀 Ready to Launch</h3>
      </div>

      <div className={styles.productInfo}>
        <h4 className={styles.productTitle}>{currentProduct?.name}</h4>
        <p className={styles.productType}>{currentProduct?.type}</p>
      </div>

      <div className={styles.launchPreview}>
        <div className={styles.previewItem}>
          <span className={styles.previewLabel}>Development:</span>
          <span className={styles.previewValue}>100% Complete</span>
        </div>
        <div className={styles.previewItem}>
          <span className={styles.previewLabel}>Debugging:</span>
          <span className={styles.previewValue}>100% Complete</span>
        </div>
        <div className={styles.previewItem}>
          <span className={styles.previewLabel}>Remaining Bugs:</span>
          <span className={styles.previewValue}>
            {currentProduct?.bugs || 0}
          </span>
        </div>
        <div className={styles.previewItem}>
          <span className={styles.previewLabel}>Quality Rating:</span>
          <span className={styles.previewValue}>
            {currentProduct?.quality}/10
          </span>
        </div>
      </div>

      <div className={styles.actionSection}>
        <p className={styles.launchDescription}>
          Your product is ready to launch! The market success will depend on its
          quality, your business skills, and a bit of luck.
        </p>
        <Button variant="success" size="large" onClick={handleLaunchProduct}>
          🚀 Launch Product
        </Button>
      </div>
    </div>
  );

  const renderCompleteStage = () => (
    <div className={styles.completeStage}>
      <div className={styles.stageHeader}>
        <h3 className={styles.stageTitle}>
          {launchResults?.isProductSuccessful
            ? "🎉 Product Launch Successful!"
            : "📊 Product Launched"}
        </h3>
      </div>

      <div className={styles.launchResults}>
        <div className={styles.resultSection}>
          <h4 className={styles.resultTitle}>{launchResults?.product.name}</h4>
          <p className={styles.resultType}>
            {launchResults?.product.type} Project
          </p>

          <div className={styles.resultDetails}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Market Success:</span>
              <span className={styles.resultValue}>
                {launchResults?.isProductSuccessful
                  ? "✅ Successful"
                  : "⚠️ Limited Success"}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Monthly Revenue:</span>
              <span className={styles.resultValue}>
                {launchResults?.monthlyRevenue}₼
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Reputation Gained:</span>
              <span className={styles.resultValue}>
                +{launchResults?.product.quality || 0}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Skills Improved:</span>
              <span className={styles.resultValue}>
                +3 Technical Skill Points
              </span>
            </div>
          </div>

          <div className={styles.revenueNote}>
            <p>
              Revenue from this product will be added to your income
              automatically.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.actionSection}>
        <Button variant="primary" size="large" onClick={onClose}>
          Back to Business Dashboard
        </Button>
      </div>
    </div>
  );

  // Render the current stage
  const renderCurrentStage = () => {
    switch (stage) {
      case "ideation":
        return renderIdeationStage();
      case "development":
        return renderDevelopmentStage();
      case "debugging":
        return renderDebuggingStage();
      case "launching":
        return renderLaunchingStage();
      case "complete":
        return renderCompleteStage();
      default:
        return renderIdeationStage();
    }
  };

  return (
    <div className={styles.projectCreationOverlay}>
      <Card className={styles.projectCreationCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>🏗️ Create New Product</h2>
          <Button variant="secondary" size="small" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className={styles.content}>{renderCurrentStage()}</div>
      </Card>
    </div>
  );
};

export default ProjectCreation;
