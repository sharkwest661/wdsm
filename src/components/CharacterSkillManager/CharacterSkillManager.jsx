// Character Skill Management Component
// src/components/CharacterSkillManager/CharacterSkillManager.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import StatDisplay from "../../ui/StatDisplay/StatDisplay";
import styles from "./CharacterSkillManager.module.scss";

const CharacterSkillManager = ({ character, onImproveSkill, onClose }) => {
  const { t } = useTranslation();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const availablePoints = character.availableCharacterSkillPoints;
  const currentSkills = character.characterSkills;

  const skillInfo = {
    technical: {
      emoji: "🔧",
      name: t("characterCreation.skillNames.technical"),
      description: t("characterCreation.skills.technical"),
      currentLevel: currentSkills.technical,
      maxLevel: 10,
    },
    business: {
      emoji: "💼",
      name: t("characterCreation.skillNames.business"),
      description: t("characterCreation.skills.business"),
      currentLevel: currentSkills.business,
      maxLevel: 10,
    },
    social: {
      emoji: "🤝",
      name: t("characterCreation.skillNames.social"),
      description: t("characterCreation.skills.social"),
      currentLevel: currentSkills.social,
      maxLevel: 10,
    },
    creativity: {
      emoji: "💡",
      name: t("characterCreation.skillNames.creativity"),
      description: t("characterCreation.skills.creativity"),
      currentLevel: currentSkills.creativity,
      maxLevel: 10,
    },
  };

  const handleImproveSkill = (skillName) => {
    const success = onImproveSkill(skillName, 1);
    if (success) {
      setSelectedSkill(null);
    }
  };

  const canImproveSkill = (skillName) => {
    const skill = skillInfo[skillName];
    return availablePoints > 0 && skill.currentLevel < skill.maxLevel;
  };

  if (availablePoints === 0) {
    return (
      <Card className={styles.noPointsCard}>
        <div className={styles.noPointsContent}>
          <h3 className={styles.title}>📊 {t("character.skillDevelopment")}</h3>
          <p className={styles.noPointsMessage}>
            {t("character.noSkillPointsAvailable")}
          </p>
          <p className={styles.earnPointsHint}>
            {t("character.earnPointsHint")}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.skillManagerCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>📊 {t("character.skillDevelopment")}</h3>
        <Button variant="secondary" size="small" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div className={styles.availablePoints}>
        <StatDisplay
          emoji="⭐"
          label={t("character.availableSkillPoints")}
          value={availablePoints}
          format="number"
          variant="highlighted"
          size="large"
        />
      </div>

      <div className={styles.skillsGrid}>
        {Object.entries(skillInfo).map(([skillName, skill]) => (
          <div
            key={skillName}
            className={`${styles.skillItem} ${
              selectedSkill === skillName ? styles.skillItemSelected : ""
            }`}
            onClick={() =>
              setSelectedSkill(selectedSkill === skillName ? null : skillName)
            }
          >
            <div className={styles.skillHeader}>
              <div className={styles.skillInfo}>
                <span className={styles.skillEmoji}>{skill.emoji}</span>
                <div className={styles.skillDetails}>
                  <h4 className={styles.skillName}>{skill.name}</h4>
                  <div className={styles.skillLevel}>
                    <span className={styles.currentLevel}>
                      {skill.currentLevel}
                    </span>
                    <span className={styles.maxLevel}>/{skill.maxLevel}</span>
                  </div>
                </div>
              </div>

              <div className={styles.skillProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${(skill.currentLevel / skill.maxLevel) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {selectedSkill === skillName && (
              <div className={styles.skillExpanded}>
                <p className={styles.skillDescription}>{skill.description}</p>

                <div className={styles.improvementSection}>
                  <div className={styles.improvementInfo}>
                    <span className={styles.improvementText}>
                      {t("character.improveSkillCost", { cost: 1 })}
                    </span>
                    <span className={styles.newLevel}>
                      {skill.currentLevel} →{" "}
                      {Math.min(skill.currentLevel + 1, skill.maxLevel)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => handleImproveSkill(skillName)}
                    disabled={!canImproveSkill(skillName)}
                  >
                    {skill.currentLevel >= skill.maxLevel
                      ? t("character.maxLevel")
                      : t("character.improveSkill")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.helpText}>
          <p className={styles.helpMessage}>
            💡 {t("character.skillImprovementNote")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CharacterSkillManager;
