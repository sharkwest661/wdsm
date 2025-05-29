// ==============================================
// components/SkillItem/SkillItem.jsx
// ==============================================
import React from "react";
import Button from "../../ui/Button/Button";
import styles from "./SkillItem.module.scss";

const SkillItem = ({
  name,
  cost,
  isLearned = false,
  isLocked = false,
  onLearn = () => {},
  requirements = [],
  emoji = "🔧",
  description = "",
}) => {
  const itemClasses = [
    styles.skillItem,
    isLearned ? styles["skillItem--learned"] : "",
    isLocked ? styles["skillItem--locked"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={itemClasses}>
      <div className={styles.skillItem__header}>
        <div className={styles.skillItem__title}>
          <span className={styles.skillItem__emoji}>{emoji}</span>
          <span className={styles.skillItem__name}>{name}</span>
        </div>

        <div className={styles.skillItem__badges}>
          {isLearned && (
            <span
              className={`${styles.skillItem__badge} ${styles["skillItem__badge--learned"]}`}
            >
              ✓ Learned
            </span>
          )}
          {isLocked && (
            <span
              className={`${styles.skillItem__badge} ${styles["skillItem__badge--locked"]}`}
            >
              🔒 Locked
            </span>
          )}
        </div>
      </div>

      {description && (
        <div className={styles.skillItem__description}>{description}</div>
      )}

      {requirements.length > 0 && (
        <div className={styles.skillItem__requirements}>
          <small>Requires: {requirements.join(", ")}</small>
        </div>
      )}

      <div className={styles.skillItem__footer}>
        <span className={styles.skillItem__cost}>{cost} points</span>
        <Button
          variant={isLearned ? "success" : "primary"}
          size="small"
          disabled={isLocked || isLearned}
          onClick={onLearn}
        >
          {isLearned ? "Learned" : isLocked ? "Locked" : "Learn"}
        </Button>
      </div>
    </div>
  );
};

export default SkillItem;
