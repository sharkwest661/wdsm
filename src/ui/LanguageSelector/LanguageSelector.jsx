// src/ui/LanguageSelector/LanguageSelector.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import styles from "./LanguageSelector.module.scss";

const LanguageSelector = ({ variant = "button" }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: t("language.english"), flag: "🇺🇸" },
    { code: "az", name: t("language.azerbaijani"), flag: "🇦🇿" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (variant === "dropdown") {
    return (
      <div className={styles.languageSelector}>
        <button
          className={styles.languageSelector__trigger}
          onClick={toggleDropdown}
        >
          <span className={styles.languageSelector__flag}>
            {currentLanguage.flag}
          </span>
          <span className={styles.languageSelector__name}>
            {currentLanguage.name}
          </span>
          <span className={styles.languageSelector__arrow}>
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className={styles.languageSelector__dropdown}>
            {languages.map((language) => (
              <button
                key={language.code}
                className={`${styles.languageSelector__option} ${
                  i18n.language === language.code
                    ? styles["languageSelector__option--active"]
                    : ""
                }`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <span className={styles.languageSelector__flag}>
                  {language.flag}
                </span>
                <span className={styles.languageSelector__name}>
                  {language.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Button variant
  return (
    <div className={styles.languageSelectorButtons}>
      <span className={styles.languageSelectorButtons__label}>
        {t("language.selectLanguage")}
      </span>
      <div className={styles.languageSelectorButtons__buttons}>
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={i18n.language === language.code ? "primary" : "secondary"}
            size="small"
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.flag} {language.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
