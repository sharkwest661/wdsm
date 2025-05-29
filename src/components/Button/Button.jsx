// ==============================================
// components/Button/Button.jsx
// ==============================================
import React from "react";
import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick = () => {},
  className = "",
  fullWidth = false,
  loading = false,
}) => {
  const buttonClasses = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    fullWidth ? styles["btn--full-width"] : "",
    loading ? styles["btn--loading"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <span className={styles.btn__spinner}>⏳</span> : children}
    </button>
  );
};

export default Button;
