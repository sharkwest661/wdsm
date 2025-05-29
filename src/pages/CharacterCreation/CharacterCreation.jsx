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
    // Gender is for gameplay only, doesn't affect avatar
  };

  const handleRandomizeAvatar = () => {
    generateRandomAvatar();
  };

  const handleStartGame = () => {
    if (!characterName.trim()) {
      alert(t("characterCreation.pleaseEnterName"));
      return;
    }

    // Create character with current avatar state and name
    createCharacter({
      name: characterName.trim(),
      gender: selectedGender, // Gender for gameplay
      avatar: {
        ...character.avatar, // Use current avatar state
        seed: characterName.trim(), // Set seed to character name for consistency
      },
    });

    // Set character as created in app store
    setCharacterCreated(true);
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

            <div className={styles.startingStats}>
              <h3 className={styles.controlTitle}>
                {t("characterCreation.startingStats")}
              </h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>💰</span>
                  <span className={styles.statLabel}>{t("stats.money")}</span>
                  <span className={styles.statValue}>
                    {character.money.toLocaleString()} ₼
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>⭐</span>
                  <span className={styles.statLabel}>
                    {t("stats.reputation")}
                  </span>
                  <span className={styles.statValue}>
                    {character.reputation}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>🔧</span>
                  <span className={styles.statLabel}>
                    {t("stats.skillPoints")}
                  </span>
                  <span className={styles.statValue}>
                    {character.skillPoints}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>⚡</span>
                  <span className={styles.statLabel}>{t("stats.energy")}</span>
                  <span className={styles.statValue}>
                    {character.energy}/100
                  </span>
                </div>
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
            disabled={!characterName.trim()}
          >
            {t("characterCreation.startJourney")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
