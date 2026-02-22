import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';

export default function XPLevelingSystem() {
  const { playerProgress } = useGamificationStore();

  if (!playerProgress) {
    return (
      <div className="text-center text-gray-400">
        <p>No player progress data available</p>
      </div>
    );
  }

  const xpPercentage = (playerProgress.totalXP / playerProgress.xpForNextLevel) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Level Display */}
      <motion.div
        className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 border border-primary/30 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">Current Level</p>
            <motion.h2
              className="text-5xl font-bold text-primary"
              key={playerProgress.currentLevel}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {playerProgress.currentLevel}
            </motion.h2>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-sm">Total XP</p>
            <motion.p
              className="text-3xl font-bold text-secondary"
              key={playerProgress.totalXP}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {playerProgress.totalXP.toLocaleString()}
            </motion.p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Progress to Next Level</span>
            <span className="text-sm font-semibold text-primary">
              {playerProgress.totalXP} / {playerProgress.xpForNextLevel} XP
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-primary/30">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Level Milestones */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((level) => {
          const isReached = playerProgress.currentLevel >= level;
          return (
            <motion.div
              key={level}
              className={`rounded-lg p-4 text-center border transition-all ${
                isReached
                  ? 'bg-primary/20 border-primary'
                  : 'bg-gray-700/20 border-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: level * 0.1 }}
            >
              <div className="text-2xl font-bold text-primary mb-1">Level {level}</div>
              <div className="text-xs text-gray-400">
                {level * 100} XP
              </div>
              {isReached && (
                <motion.div
                  className="text-primary text-lg mt-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* XP Breakdown */}
      <motion.div
        className="mt-6 bg-secondary-foreground rounded-lg p-4 border border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">XP Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Missions Completed:</span>
            <span className="text-primary font-semibold">
              {playerProgress.completedMissions.length * 50} XP
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Login Streak:</span>
            <span className="text-secondary font-semibold">
              {playerProgress.loginStreak * 10} XP
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Badges Earned:</span>
            <span className="text-primary font-semibold">
              {playerProgress.badges.length * 25} XP
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
