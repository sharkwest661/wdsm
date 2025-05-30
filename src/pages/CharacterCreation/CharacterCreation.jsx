// src/pages/CharacterCreation/CharacterCreation.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import Avatar from "../../ui/Avatar/Avatar";
import LanguageSelector from "../../ui/LanguageSelector/LanguageSelector";

// Import modular stores
import { useAppStore, useCharacterStore } from "../../store";

import styles from "./CharacterCreation.module.scss";

const CharacterCreation = () => {
  const { t, i18n } = useTranslation();

  // Correct Zustand usage - selective state picking from modular stores
  const character = useCharacterStore((state) => state.character);
  const updateAvatar = useCharacterStore((state) => state.updateAvatar);
  const generateRandomAvatar = useCharacterStore(
    (state) => state.generateRandomAvatar
  );
  const createCharacter = useCharacterStore((state) => state.createCharacter);

  // App store for language and game setup
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setCharacterCreated = useAppStore((state) => state.setCharacterCreated);

  const [characterName, setCharacterName] = useState("");
  const [selectedGender, setSelectedGender] = useState(character.gender);

  // Character Skills Distribution State
  const [characterSkills, setCharacterSkills] = useState({
    technical: 3,
    business: 2,
    social: 2,
    creativity: 3,
  });

  const TOTAL_SKILL_POINTS = 10;
  const MIN_SKILL_VALUE = 1;
  const MAX_SKILL_VALUE = 7;

  // Calculate remaining points
  const usedPoints = Object.values(characterSkills).reduce(
    (sum, value) => sum + value,
    0
  );
  const remainingPoints = TOTAL_SKILL_POINTS - usedPoints;

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

  const handleGenderChange = (newGender) => {
    setSelectedGender(newGender);
  };

  const handleRandomizeAvatar = () => {
    generateRandomAvatar();
  };

  const handleSkillChange = (skillName, change) => {
    setCharacterSkills((prev) => {
      const currentValue = prev[skillName];
      const newValue = currentValue + change;

      // Check constraints
      if (newValue < MIN_SKILL_VALUE || newValue > MAX_SKILL_VALUE) {
        return prev;
      }

      // Check if we have points available (for increasing)
      if (change > 0 && remainingPoints <= 0) {
        return prev;
      }

      return {
        ...prev,
        [skillName]: newValue,
      };
    });
  };

  const resetSkillDistribution = () => {
    setCharacterSkills({
      technical: 3,
      business: 2,
      social: 2,
      creativity: 3,
    });
  };

  const canStartGame = characterName.trim() && remainingPoints === 0;

  const handleStartGame = () => {
    if (!canStartGame) {
      if (!characterName.trim()) {
        alert(t("characterCreation.pleaseEnterName"));
        return;
      }
      if (remainingPoints !== 0) {
        alert(t("characterCreation.pleaseDistributeAllPoints"));
        return;
      }
    }

    // Create character with current avatar state, name, and skill distribution
    createCharacter({
      name: characterName.trim(),
      gender: selectedGender,
      avatar: {
        ...character.avatar,
      },
      characterSkills: characterSkills,
    });

    // Set character as created in app store
    setCharacterCreated(true);
  };

  const skillDescriptions = {
    technical: t("characterCreation.skills.technical"),
    business: t("characterCreation.skills.business"),
    social: t("characterCreation.skills.social"),
    creativity: t("characterCreation.skills.creativity"),
  };

  const skillEmojis = {
    technical: "🔧",
    business: "💼",
    social: "🤝",
    creativity: "💡",
  };

  return (
    <div className={styles.characterCreation}>
      <div className={styles.container}>
        {/* Language Selector */}
        <div className={styles.languageSelector}>
          <LanguageSelector variant="dropdown" />
        </div>

        <header className={styles.header}>
          <h1 className="text-game-title">{t("characterCreation.title")}</h1>
          <p className={styles.subtitle}>{t("characterCreation.subtitle")}</p>
        </header>

        <div className={styles.content}>
          <Card className={styles.avatarCard}>
            <h2 className={styles.cardTitle}>
              {t("characterCreation.chooseAvatar")}
            </h2>

            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                <Avatar
                  size={180}
                  seed={character.avatar.seed}
                  backgroundColor={character.avatar.backgroundColor}
                  primaryColor={character.avatar.primaryColor}
                />
              </div>

              <div className={styles.avatarControls}>
                <div className={styles.genderSelection}>
                  <h3 className={styles.controlTitle}>
                    {t("characterCreation.gender")}
                  </h3>
                  <div className={styles.genderButtons}>
                    <Button
                      variant={
                        selectedGender === "male" ? "primary" : "secondary"
                      }
                      size="medium"
                      onClick={() => handleGenderChange("male")}
                    >
                      {t("characterCreation.male")}
                    </Button>
                    <Button
                      variant={
                        selectedGender === "female" ? "primary" : "secondary"
                      }
                      size="medium"
                      onClick={() => handleGenderChange("female")}
                    >
                      {t("characterCreation.female")}
                    </Button>
                  </div>
                </div>

                <div className={styles.randomizeSection}>
                  <h3 className={styles.controlTitle}>
                    {t("characterCreation.appearance")}
                  </h3>
                  <Button
                    variant="info"
                    size="large"
                    onClick={handleRandomizeAvatar}
                    fullWidth
                  >
                    {t("characterCreation.randomizeAvatar")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.detailsCard}>
            <h2 className={styles.cardTitle}>
              {t("characterCreation.characterDetails")}
            </h2>

            <div className={styles.nameSection}>
              <label className={styles.inputLabel} htmlFor="characterName">
                {t("characterCreation.characterName")}
              </label>
              <input
                id="characterName"
                type="text"
                className={styles.nameInput}
                placeholder={t("characterCreation.characterNamePlaceholder")}
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                maxLength={30}
              />
            </div>

            {/* Character Skills Distribution */}
            <div className={styles.skillDistribution}>
              <div className={styles.skillDistributionHeader}>
                <h3 className={styles.controlTitle}>
                  {t("characterCreation.distributeSkillPoints")}
                </h3>
                <div className={styles.skillPointsInfo}>
                  <span className={styles.remainingPoints}>
                    {t("characterCreation.remainingPoints", {
                      points: remainingPoints,
                    })}
                  </span>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={resetSkillDistribution}
                  >
                    {t("characterCreation.resetDistribution")}
                  </Button>
                </div>
              </div>

              <div className={styles.skillsGrid}>
                {Object.entries(characterSkills).map(([skillName, value]) => (
                  <div key={skillName} className={styles.skillDistributionItem}>
                    <div className={styles.skillInfo}>
                      <span className={styles.skillEmoji}>
                        {skillEmojis[skillName]}
                      </span>
                      <div className={styles.skillDetails}>
                        <span className={styles.skillName}>
                          {t(`characterCreation.skillNames.${skillName}`)}
                        </span>
                        <span className={styles.skillDescription}>
                          {skillDescriptions[skillName]}
                        </span>
                      </div>
                    </div>

                    <div className={styles.skillControls}>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleSkillChange(skillName, -1)}
                        disabled={value <= MIN_SKILL_VALUE}
                      >
                        −
                      </Button>
                      <span className={styles.skillValue}>{value}</span>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleSkillChange(skillName, 1)}
                        disabled={
                          value >= MAX_SKILL_VALUE || remainingPoints <= 0
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.skillDistributionNote}>
                <p className={styles.skillsNote}>
                  {t("characterCreation.skillDistributionNote")}
                </p>
              </div>
            </div>

            <div className={styles.startingSkills}>
              <h3 className={styles.controlTitle}>
                {t("characterCreation.startingSkills")}
              </h3>
              <div className={styles.skillsList}>
                <span className={styles.skillBadge}>🟧 HTML</span>
                <span className={styles.skillBadge}>🟦 CSS</span>
              </div>
              <p className={styles.skillsNote}>
                {t("characterCreation.skillsNote")}
              </p>
            </div>
          </Card>
        </div>

        <div className={styles.footer}>
          <Button
            variant="success"
            size="large"
            onClick={handleStartGame}
            fullWidth
            disabled={!canStartGame}
          >
            {t("characterCreation.startJourney")}
          </Button>

          {remainingPoints !== 0 && (
            <p className={styles.warningText}>
              {remainingPoints > 0
                ? t("characterCreation.mustUseAllPoints", {
                    points: remainingPoints,
                  })
                : t("characterCreation.tooManyPoints")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
