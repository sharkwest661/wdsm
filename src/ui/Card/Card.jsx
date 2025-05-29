// ==============================================
// components/Card/Card.jsx
// ==============================================
import React from "react";
import styles from "./Card.module.scss";

const Card = ({
  children,
  variant = "default",
  className = "",
  onClick = null,
  hoverable = false,
}) => {
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    hoverable ? styles["card--hoverable"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
