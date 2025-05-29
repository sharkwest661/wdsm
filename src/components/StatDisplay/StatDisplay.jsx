// ==============================================
// components/StatDisplay/StatDisplay.jsx
// ==============================================
import React from "react";
import styles from "./StatDisplay.module.scss";

const StatDisplay = ({
  emoji,
  label,
  value,
  maxValue = null,
  format = "number",
  variant = "default",
  size = "medium",
}) => {
  const formatValue = (val) => {
    switch (format) {
      case "currency":
        return `${val.toLocaleString()} ₼`;
      case "percentage":
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const displayClasses = [
    styles.statDisplay,
    styles[`statDisplay--${variant}`],
    styles[`statDisplay--${size}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={displayClasses}>
      <div className={styles.statDisplay__emoji}>{emoji}</div>
      <div className={styles.statDisplay__content}>
        <div className={styles.statDisplay__label}>{label}</div>
        <div className={styles.statDisplay__value}>
          {formatValue(value)}
          {maxValue && (
            <span className={styles.statDisplay__max}>
              /{formatValue(maxValue)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatDisplay;
