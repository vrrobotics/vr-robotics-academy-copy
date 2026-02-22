import { create } from 'zustand';

export interface PlayerProgress {
  userId: string;
  currentLevel: number;
  totalXP: number;
  xpForNextLevel: number;
  unlockedMissions: string[];
  completedMissions: string[];
  currentAvatarSkin: string;
  unlockedSkins: string[];
  badges: string[];
  lastLoginDate: Date;
  loginStreak: number;
}

export interface Mission {
  _id: string;
  missionName: string;
  missionDescription: string;
  missionOrder: number;
  missionImage?: string;
  rewardXP: number;
  unlockConditionDescription: string;
  challengeType: string;
}

export interface AvatarSkin {
  _id: string;
  skinName: string;
  skinImage?: string;
  description: string;
  unlockConditionType: string;
  unlockConditionValue: string;
  isDefaultSkin: boolean;
}

export interface Badge {
  _id: string;
  badgeName: string;
  description: string;
  badgeImage?: string;
  pointsRequired: number;
  isActive: boolean;
}

interface GamificationState {
  playerProgress: PlayerProgress | null;
  missions: Mission[];
  avatarSkins: AvatarSkin[];
  badges: Badge[];
  
  // Actions
  setPlayerProgress: (progress: PlayerProgress) => void;
  addXP: (amount: number) => void;
  completeMission: (missionId: string, xpReward: number) => void;
  unlockMission: (missionId: string) => void;
  unlockSkin: (skinId: string) => void;
  setCurrentSkin: (skinId: string) => void;
  earnBadge: (badgeId: string) => void;
  setMissions: (missions: Mission[]) => void;
  setAvatarSkins: (skins: AvatarSkin[]) => void;
  setBadges: (badges: Badge[]) => void;
  updateLoginStreak: () => void;
  resetProgress: () => void;
}

const LEVEL_UP_XP = 100; // XP needed per level

export const useGamificationStore = create<GamificationState>((set) => ({
  playerProgress: null,
  missions: [],
  avatarSkins: [],
  badges: [],

  setPlayerProgress: (progress) => set({ playerProgress: progress }),

  addXP: (amount) =>
    set((state) => {
      if (!state.playerProgress) return state;

      let newXP = state.playerProgress.totalXP + amount;
      let newLevel = state.playerProgress.currentLevel;
      let xpForNextLevel = state.playerProgress.xpForNextLevel;

      // Check for level ups
      while (newXP >= xpForNextLevel) {
        newXP -= xpForNextLevel;
        newLevel += 1;
        xpForNextLevel = LEVEL_UP_XP * newLevel;
      }

      return {
        playerProgress: {
          ...state.playerProgress,
          totalXP: newXP,
          currentLevel: newLevel,
          xpForNextLevel: xpForNextLevel,
        },
      };
    }),

  completeMission: (missionId, xpReward) =>
    set((state) => {
      if (!state.playerProgress) return state;

      const isAlreadyCompleted = state.playerProgress.completedMissions.includes(missionId);
      
      return {
        playerProgress: {
          ...state.playerProgress,
          completedMissions: isAlreadyCompleted
            ? state.playerProgress.completedMissions
            : [...state.playerProgress.completedMissions, missionId],
        },
      };
    }),

  unlockMission: (missionId) =>
    set((state) => {
      if (!state.playerProgress) return state;

      return {
        playerProgress: {
          ...state.playerProgress,
          unlockedMissions: state.playerProgress.unlockedMissions.includes(missionId)
            ? state.playerProgress.unlockedMissions
            : [...state.playerProgress.unlockedMissions, missionId],
        },
      };
    }),

  unlockSkin: (skinId) =>
    set((state) => {
      if (!state.playerProgress) return state;

      return {
        playerProgress: {
          ...state.playerProgress,
          unlockedSkins: state.playerProgress.unlockedSkins.includes(skinId)
            ? state.playerProgress.unlockedSkins
            : [...state.playerProgress.unlockedSkins, skinId],
        },
      };
    }),

  setCurrentSkin: (skinId) =>
    set((state) => {
      if (!state.playerProgress) return state;

      return {
        playerProgress: {
          ...state.playerProgress,
          currentAvatarSkin: skinId,
        },
      };
    }),

  earnBadge: (badgeId) =>
    set((state) => {
      if (!state.playerProgress) return state;

      return {
        playerProgress: {
          ...state.playerProgress,
          badges: state.playerProgress.badges.includes(badgeId)
            ? state.playerProgress.badges
            : [...state.playerProgress.badges, badgeId],
        },
      };
    }),

  setMissions: (missions) => set({ missions }),
  setAvatarSkins: (skins) => set({ avatarSkins: skins }),
  setBadges: (badges) => set({ badges }),

  updateLoginStreak: () =>
    set((state) => {
      if (!state.playerProgress) return state;

      const today = new Date().toDateString();
      const lastLogin = new Date(state.playerProgress.lastLoginDate).toDateString();

      const newStreak = today === lastLogin ? state.playerProgress.loginStreak : state.playerProgress.loginStreak + 1;

      return {
        playerProgress: {
          ...state.playerProgress,
          loginStreak: newStreak,
          lastLoginDate: new Date(),
        },
      };
    }),

  resetProgress: () => set({ playerProgress: null, missions: [], avatarSkins: [], badges: [] }),
}));
