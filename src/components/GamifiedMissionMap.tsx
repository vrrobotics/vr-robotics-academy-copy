import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';
import { BaseCrudService } from '@/integrations';
import { Mission } from '@/stores/gamificationStore';

export default function GamifiedMissionMap() {
  const navigate = useNavigate();
  const { missions, playerProgress, unlockMission, completeMission } = useGamificationStore();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Mission>('gamemissions');
        useGamificationStore.setState({ missions: items });
        setLoading(false);
      } catch (error) {
        console.error('Failed to load missions:', error);
        setLoading(false);
      }
    };

    if (missions.length === 0) {
      loadMissions();
    } else {
      setLoading(false);
    }
  }, [missions.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sortedMissions = [...missions].sort((a, b) => (a.missionOrder || 0) - (b.missionOrder || 0));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-primary mb-12 text-center">Mission Map</h2>

      {/* Mission Grid */}
      <div className="relative">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {sortedMissions.map((mission, index) => {
            if (index === sortedMissions.length - 1) return null;

            const isCompleted = playerProgress?.completedMissions.includes(mission._id);
            const nextMissionCompleted = playerProgress?.completedMissions.includes(
              sortedMissions[index + 1]._id
            );

            return (
              <line
                key={`line-${mission._id}`}
                x1="50%"
                y1={`${index * 200 + 100}px`}
                x2="50%"
                y2={`${(index + 1) * 200 + 100}px`}
                stroke={isCompleted ? '#FF8C42' : '#404040'}
                strokeWidth="3"
                strokeDasharray={isCompleted ? '0' : '5,5'}
              />
            );
          })}
        </svg>

        {/* Mission Nodes */}
        <div className="relative z-10 space-y-32">
          {sortedMissions.map((mission, index) => {
            const isUnlocked = playerProgress?.unlockedMissions.includes(mission._id) || index === 0;
            const isCompleted = playerProgress?.completedMissions.includes(mission._id);
            const isSelected = selectedMission?._id === mission._id;

            return (
              <motion.div
                key={mission._id}
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedMission(mission);
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all ${
                    isUnlocked
                      ? 'cursor-pointer hover:scale-110'
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                >
                  {/* Glow Effect */}
                  {isUnlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(255, 140, 66, 0.5)',
                          '0 0 40px rgba(255, 140, 66, 0.8)',
                          '0 0 20px rgba(255, 140, 66, 0.5)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Node Background */}
                  <div
                    className={`absolute inset-0 rounded-full border-4 transition-all ${
                      isCompleted
                        ? 'bg-primary/30 border-primary'
                        : isUnlocked
                        ? 'bg-primary/10 border-primary'
                        : 'bg-gray-700/20 border-gray-600'
                    }`}
                  />

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      {mission.rewardXP} XP
                    </div>
                  </div>
                </motion.button>

                {/* Mission Label */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <p className="text-sm font-semibold text-foreground">{mission.missionName}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mission Details Modal */}
      {selectedMission && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedMission(null)}
        >
          <motion.div
            className="bg-secondary-foreground rounded-lg p-8 max-w-md w-full border border-primary/30"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-primary mb-4">{selectedMission.missionName}</h3>
            <p className="text-gray-300 mb-4">{selectedMission.missionDescription}</p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Reward XP:</span>
                <span className="text-primary font-bold">{selectedMission.rewardXP}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Challenge Type:</span>
                <span className="text-secondary">{selectedMission.challengeType}</span>
              </div>
            </div>

            <button
              onClick={() => {
                // Navigate to mission game
                navigate(`/mission/${selectedMission._id}`);
              }}
              className="w-full bg-primary text-secondary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all"
            >
              Start Mission
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
