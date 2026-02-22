import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';

interface Wire {
  id: string;
  from: string;
  to: string;
  correct: boolean;
}

interface Component {
  id: string;
  name: string;
  x: number;
  y: number;
}

export default function WiringPuzzle({ onComplete }: { onComplete: (xpEarned: number) => void }) {
  const { addXP } = useGamificationStore();
  const [wires, setWires] = useState<Wire[]>([
    { id: '1', from: 'battery', to: 'motor', correct: true },
    { id: '2', from: 'sensor', to: 'controller', correct: true },
    { id: '3', from: 'battery', to: 'led', correct: true },
  ]);

  const [connectedWires, setConnectedWires] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const components: Component[] = [
    { id: 'battery', name: 'Battery', x: 50, y: 50 },
    { id: 'motor', name: 'Motor', x: 350, y: 50 },
    { id: 'sensor', name: 'Sensor', x: 50, y: 200 },
    { id: 'controller', name: 'Controller', x: 350, y: 200 },
    { id: 'led', name: 'LED', x: 200, y: 350 },
  ];

  const handleWireConnect = (wireId: string) => {
    if (!connectedWires.includes(wireId)) {
      const newConnected = [...connectedWires, wireId];
      setConnectedWires(newConnected);

      // Check if all wires are connected
      if (newConnected.length === wires.length) {
        const allCorrect = wires.every((wire) => newConnected.includes(wire.id));
        if (allCorrect) {
          setCompleted(true);
          const xpReward = 50;
          addXP(xpReward);
          setTimeout(() => onComplete(xpReward), 1000);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Wiring Puzzle</h2>
      <p className="text-gray-400 mb-6">Connect all the components correctly to complete the circuit!</p>

      {/* Game Board */}
      <motion.div
        className="relative bg-secondary-foreground rounded-lg border-2 border-primary/30 p-4 mb-6"
        style={{ minHeight: '400px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Components */}
        {components.map((comp) => (
          <motion.div
            key={comp.id}
            className="absolute w-20 h-20 bg-primary/20 border-2 border-primary rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-all"
            style={{ left: `${comp.x}px`, top: `${comp.y}px` }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="text-center">
              <div className="text-2xl">⚙️</div>
              <div className="text-xs font-semibold text-foreground">{comp.name}</div>
            </div>
          </motion.div>
        ))}

        {/* Wires */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {wires.map((wire) => {
            const fromComp = components.find((c) => c.id === wire.from);
            const toComp = components.find((c) => c.id === wire.to);
            const isConnected = connectedWires.includes(wire.id);

            if (!fromComp || !toComp) return null;

            return (
              <line
                key={wire.id}
                x1={fromComp.x + 40}
                y1={fromComp.y + 40}
                x2={toComp.x + 40}
                y2={toComp.y + 40}
                stroke={isConnected ? '#FF8C42' : '#404040'}
                strokeWidth={isConnected ? '3' : '2'}
                strokeDasharray={isConnected ? '0' : '5,5'}
                opacity={isConnected ? 1 : 0.5}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Wire Connection Buttons */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {wires.map((wire) => {
          const isConnected = connectedWires.includes(wire.id);
          return (
            <motion.button
              key={wire.id}
              onClick={() => handleWireConnect(wire.id)}
              disabled={isConnected}
              className={`p-3 rounded-lg font-semibold transition-all ${
                isConnected
                  ? 'bg-primary/30 text-primary border-2 border-primary'
                  : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:bg-gray-700'
              }`}
              whileHover={!isConnected ? { scale: 1.02 } : {}}
              whileTap={!isConnected ? { scale: 0.98 } : {}}
            >
              {isConnected ? '✓' : '○'} Connect {wire.from} → {wire.to}
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-primary font-bold">
            {connectedWires.length} / {wires.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(connectedWires.length / wires.length) * 100}%` }}
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
          <p className="text-primary font-bold text-lg">🎉 Puzzle Complete!</p>
          <p className="text-gray-300 mt-2">You earned 50 XP!</p>
        </motion.div>
      )}
    </div>
  );
}
