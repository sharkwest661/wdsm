// ==============================================
// components/ProgressBar/ProgressBar.jsx
// ==============================================
import React from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({
  progress = 0,
  max = 100,
  variant = "success",
  label = "",
  showPercentage = true,
  size = "medium",
  animated = true,
}) => {
  const percentage = Math.min((progress / max) * 100, 100);

  const barClasses = [styles.progressBar, styles[`progressBar--${size}`]]
    .filter(Boolean)
    .join(" ");

  const fillClasses = [
    styles.progressFill,
    styles[`progressFill--${variant}`],
    animated ? styles["progressFill--animated"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.progressContainer}>
      {label && (
        <div className={styles.progressLabel}>
          <span className={styles.progressLabel__text}>{label}</span>
          {showPercentage && (
            <span className={styles.progressLabel__percentage}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={barClasses}>
        <div className={fillClasses} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
