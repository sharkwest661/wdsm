// ==============================================
// components/Notification/Notification.jsx
// ==============================================
import React, { useEffect } from "react";
import styles from "./Notification.module.scss";

const Notification = ({
  type = "info",
  message,
  isVisible = false,
  onClose = () => {},
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const notificationClasses = [
    styles.notification,
    styles[`notification--${type}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={notificationClasses}>
      <span className={styles.notification__message}>{message}</span>
      <button className={styles.notification__close} onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
