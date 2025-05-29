// src/ui/Avatar/Avatar.jsx
import React, { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";
import styles from "./Avatar.module.scss";

const Avatar = ({
  seed = "default",
  backgroundColor = ["ffd93d", "6bcf7f", "ffb3ba", "bae1ff", "ffffba"],
  primaryColor = ["ffd93d", "6bcf7f", "ffb3ba", "bae1ff", "ffffba"],
  size = 120,
  className = "",
}) => {
  const avatarDataUri = useMemo(() => {
    return createAvatar(funEmoji, {
      seed,
      size,
      backgroundColor,
      primaryColor,
      radius: 20,
      scale: 100,
    }).toDataUri();
  }, [seed, size, backgroundColor, primaryColor]);

  const avatarClasses = [styles.avatar, className].filter(Boolean).join(" ");

  return (
    <div
      className={avatarClasses}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img src={avatarDataUri} alt="Avatar" className={styles.avatarImage} />
    </div>
  );
};

export default Avatar;
