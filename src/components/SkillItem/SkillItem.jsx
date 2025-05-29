// ==============================================
// components/SkillItem/SkillItem.jsx
// ==============================================
import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
              {t("skills.learned")}
            </span>
          )}
          {isLocked && (
            <span
              className={`${styles.skillItem__badge} ${styles["skillItem__badge--locked"]}`}
            >
              {t("skills.locked")}
            </span>
          )}
        </div>
      </div>

      {description && (
        <div className={styles.skillItem__description}>{description}</div>
      )}

      {requirements.length > 0 && (
        <div className={styles.skillItem__requirements}>
          <small>
            {t("skills.requires", { requirements: requirements.join(", ") })}
          </small>
        </div>
      )}

      <div className={styles.skillItem__footer}>
        <span className={styles.skillItem__cost}>
          {t("skills.points", { cost })}
        </span>
        <Button
          variant={isLearned ? "success" : "primary"}
          size="small"
          disabled={isLocked || isLearned}
          onClick={onLearn}
        >
          {isLearned
            ? t("buttons.learned")
            : isLocked
            ? t("buttons.locked")
            : t("buttons.learn")}
        </Button>
      </div>
    </div>
  );
};

export default SkillItem;
