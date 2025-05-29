// ==============================================
// components/TabNavigation/TabNavigation.jsx
// ==============================================
import React from "react";
import styles from "./TabNavigation.module.scss";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabBtn} ${
            activeTab === tab.id ? styles["tabBtn--active"] : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.tabBtn__emoji}>{tab.emoji}</span>
          <span className={styles.tabBtn__label}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
