import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';

interface Sensor {
  id: string;
  name: string;
  correctState: boolean;
  currentState: boolean;
}

export default function SensorToggleGame({ onComplete }: { onComplete: (xpEarned: number) => void }) {
  const { addXP } = useGamificationStore();
  const [sensors, setSensors] = useState<Sensor[]>([
    { id: '1', name: 'Motion Sensor', correctState: true, currentState: false },
    { id: '2', name: 'Temperature Sensor', correctState: false, currentState: false },
    { id: '3', name: 'Light Sensor', correctState: true, currentState: false },
    { id: '4', name: 'Distance Sensor', correctState: true, currentState: false },
    { id: '5', name: 'Pressure Sensor', correctState: false, currentState: false },
  ]);

  const [completed, setCompleted] = useState(false);

  const toggleSensor = (sensorId: string) => {
    setSensors((prev) =>
      prev.map((sensor) =>
        sensor.id === sensorId
          ? { ...sensor, currentState: !sensor.currentState }
          : sensor
      )
    );
  };

  useEffect(() => {
    const allCorrect = sensors.every((s) => s.currentState === s.correctState);
    if (allCorrect && sensors.some((s) => s.currentState !== false)) {
      setCompleted(true);
      const xpReward = 45;
      addXP(xpReward);
      setTimeout(() => onComplete(xpReward), 1000);
    }
  }, [sensors, addXP, onComplete]);

  const correctCount = sensors.filter((s) => s.currentState === s.correctState).length;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Sensor Configuration</h2>
      <p className="text-gray-400 mb-6">Toggle each sensor to the correct state (ON/OFF)</p>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sensors.map((sensor, index) => {
          const isCorrect = sensor.currentState === sensor.correctState;
          return (
            <motion.div
              key={sensor.id}
              className={`rounded-lg p-4 border-2 transition-all ${
                isCorrect
                  ? 'bg-green-900/30 border-green-600'
                  : 'bg-gray-700/30 border-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{sensor.name}</h3>
                {isCorrect && (
                  <motion.span
                    className="text-green-400 text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>

              {/* Toggle Button */}
              <motion.button
                onClick={() => toggleSensor(sensor.id)}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  sensor.currentState
                    ? 'bg-primary text-secondary-foreground'
                    : 'bg-gray-600 text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sensor.currentState ? '🔴 ON' : '⚫ OFF'}
              </motion.button>

              {/* Hint */}
              <p className="text-xs text-gray-400 mt-2 text-center">
                Should be: {sensor.correctState ? 'ON' : 'OFF'}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Sensors Configured</span>
          <span className="text-primary font-bold">
            {correctCount} / {sensors.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(correctCount / sensors.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Completion Message */}
      {completed && (
        <motion.div
          className="bg-primary/20 border-2 border-primary rounded-lg p-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-primary font-bold text-lg">🎉 All Sensors Configured!</p>
          <p className="text-gray-300 mt-2">You earned 45 XP!</p>
        </motion.div>
      )}
    </div>
  );
}
