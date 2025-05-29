// src/components/CharacterCreation/CharacterCreation.jsx
import React, { useMemo, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import useGameStore from "../../store/gameStore";
import styles from "./CharacterCreation.module.scss";

const CharacterCreation = () => {
  const character = useGameStore((state) => state.character);
  const updateAvatar = useGameStore((state) => state.updateAvatar);
  const generateRandomAvatar = useGameStore(
    (state) => state.generateRandomAvatar
  );
  const createCharacter = useGameStore((state) => state.createCharacter);
  const [characterName, setCharacterName] = useState("");
  const [selectedGender, setSelectedGender] = useState(character.avatar.sex);

  const avatarConfig = useMemo(
    () =>
      genConfig({
        sex: selectedGender,
        seed: character.avatar.seed,
      }),
    [selectedGender, character.avatar.seed]
  );

  const handleGenderChange = (newGender) => {
    setSelectedGender(newGender);
    updateAvatar({ sex: newGender });
  };

  const handleRandomizeAvatar = () => {
    generateRandomAvatar(selectedGender);
  };

  const handleStartGame = () => {
    if (!characterName.trim()) {
      alert("Please enter your character name!");
      return;
    }

    createCharacter({
      name: characterName.trim(),
      avatar: {
        sex: selectedGender,
        seed: character.avatar.seed,
      },
    });
  };

  return (
    <div className={styles.characterCreation}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className="text-game-title">🚀 Welcome to Web Dev Life!</h1>
          <p className={styles.subtitle}>
            Create your character and begin your coding journey
          </p>
        </header>

        <div className={styles.content}>
          <Card className={styles.avatarCard}>
            <h2 className={styles.cardTitle}>👤 Choose Your Avatar</h2>

            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                <Avatar
                  style={{ width: "180px", height: "180px" }}
                  {...avatarConfig}
                />
              </div>

              <div className={styles.avatarControls}>
                <div className={styles.genderSelection}>
                  <h3 className={styles.controlTitle}>Gender</h3>
                  <div className={styles.genderButtons}>
                    <Button
                      variant={
                        selectedGender === "man" ? "primary" : "secondary"
                      }
                      size="medium"
                      onClick={() => handleGenderChange("man")}
                    >
                      👨 Male
                    </Button>
                    <Button
                      variant={
                        selectedGender === "woman" ? "primary" : "secondary"
                      }
                      size="medium"
                      onClick={() => handleGenderChange("woman")}
                    >
                      👩 Female
                    </Button>
                  </div>
                </div>

                <div className={styles.randomizeSection}>
                  <h3 className={styles.controlTitle}>Appearance</h3>
                  <Button
                    variant="info"
                    size="large"
                    onClick={handleRandomizeAvatar}
                    fullWidth
                  >
                    🎲 Randomize Avatar
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.detailsCard}>
            <h2 className={styles.cardTitle}>📝 Character Details</h2>

            <div className={styles.nameSection}>
              <label className={styles.inputLabel} htmlFor="characterName">
                Character Name
              </label>
              <input
                id="characterName"
                type="text"
                className={styles.nameInput}
                placeholder="Enter your developer name..."
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className={styles.startingStats}>
              <h3 className={styles.controlTitle}>Starting Stats</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>💰</span>
                  <span className={styles.statLabel}>Money</span>
                  <span className={styles.statValue}>1,500 ₼</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>⭐</span>
                  <span className={styles.statLabel}>Reputation</span>
                  <span className={styles.statValue}>45</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>🔧</span>
                  <span className={styles.statLabel}>Skill Points</span>
                  <span className={styles.statValue}>12</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statEmoji}>⚡</span>
                  <span className={styles.statLabel}>Energy</span>
                  <span className={styles.statValue}>75/100</span>
                </div>
              </div>
            </div>

            <div className={styles.startingSkills}>
              <h3 className={styles.controlTitle}>Starting Skills</h3>
              <div className={styles.skillsList}>
                <span className={styles.skillBadge}>🟧 HTML</span>
                <span className={styles.skillBadge}>🟦 CSS</span>
              </div>
              <p className={styles.skillsNote}>
                💡 Learn more skills as you progress through your career!
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
            🚀 Start My Developer Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
