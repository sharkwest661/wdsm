// src/store/index.js
// Export all stores for clean imports
// Usage: import { useAppStore, useCharacterStore, useSkillsStore } from '../store';

export { default as useAppStore } from "./appStore";
export { default as useCharacterStore } from "./characterStore";
export { default as useSkillsStore } from "./skillsStore";
export { default as useCareerStore } from "./careerStore";
export { default as useBusinessStore } from "./businessStore";
export { default as useLifeStore } from "./lifeStore";
export { default as useNotificationStore } from "./notificationStore";

// Legacy export for backward compatibility during migration
export { default as useGameStore } from "./gameStore";
