import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';

interface GridCell {
  x: number;
  y: number;
  type: 'empty' | 'wall' | 'start' | 'goal';
}

export default function RobotMazeGame({ onComplete }: { onComplete: (xpEarned: number) => void }) {
  const { addXP } = useGamificationStore();
  const GRID_SIZE = 5;
  const CELL_SIZE = 50;

  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [goalPos] = useState({ x: 4, y: 4 });
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  const maze: GridCell[] = [
    // Start
    { x: 0, y: 0, type: 'start' },
    // Walls
    { x: 1, y: 1, type: 'wall' },
    { x: 1, y: 2, type: 'wall' },
    { x: 2, y: 2, type: 'wall' },
    { x: 3, y: 1, type: 'wall' },
    // Goal
    { x: 4, y: 4, type: 'goal' },
  ];

  const isWall = (x: number, y: number) => {
    return maze.some((cell) => cell.x === x && cell.y === y && cell.type === 'wall');
  };

  const moveRobot = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (completed) return;

    let newX = robotPos.x;
    let newY = robotPos.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, robotPos.y - 1);
        break;
      case 'down':
        newY = Math.min(GRID_SIZE - 1, robotPos.y + 1);
        break;
      case 'left':
        newX = Math.max(0, robotPos.x - 1);
        break;
      case 'right':
        newX = Math.min(GRID_SIZE - 1, robotPos.x + 1);
        break;
    }

    // Check if new position is a wall
    if (!isWall(newX, newY)) {
      setRobotPos({ x: newX, y: newY });
      setMoves((prev) => prev + 1);

      // Check if reached goal
      if (newX === goalPos.x && newY === goalPos.y) {
        setCompleted(true);
        const xpReward = Math.max(30, 100 - moves * 5); // Bonus for fewer moves
        addXP(xpReward);
        setTimeout(() => onComplete(xpReward), 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Robot Maze</h2>
      <p className="text-gray-400 mb-6">Navigate the robot to the goal!</p>

      {/* Maze Grid */}
      <motion.div
        className="bg-secondary-foreground rounded-lg border-2 border-primary/30 p-4 mb-6 inline-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="relative bg-gray-800 rounded"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Grid Cells */}
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => {
              const isWallCell = isWall(x, y);
              const isStart = x === 0 && y === 0;
              const isGoal = x === goalPos.x && y === goalPos.y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`absolute border border-gray-700 ${
                    isWallCell
                      ? 'bg-gray-600'
                      : isStart
                      ? 'bg-green-900/30'
                      : isGoal
                      ? 'bg-primary/30'
                      : 'bg-gray-800'
                  }`}
                  style={{
                    left: x * CELL_SIZE,
                    top: y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                >
                  {isStart && <span className="absolute inset-0 flex items-center justify-center text-lg">🟢</span>}
                  {isGoal && <span className="absolute inset-0 flex items-center justify-center text-lg">🎯</span>}
                </div>
              );
            })
          )}

          {/* Robot */}
          <motion.div
            className="absolute flex items-center justify-center text-2xl"
            style={{
              left: robotPos.x * CELL_SIZE,
              top: robotPos.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              zIndex: 10,
            }}
            animate={{
              left: robotPos.x * CELL_SIZE,
              top: robotPos.y * CELL_SIZE,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            🤖
          </motion.div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="mb-6">
        <p className="text-gray-400 mb-3">Controls:</p>
        <div className="grid grid-cols-3 gap-2 w-32">
          <div />
          <motion.button
            onClick={() => moveRobot('up')}
            className="bg-primary text-secondary-foreground font-bold py-2 rounded hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↑
          </motion.button>
          <div />

          <motion.button
            onClick={() => moveRobot('left')}
            className="bg-primary text-secondary-foreground font-bold py-2 rounded hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>
          <motion.button
            onClick={() => setRobotPos({ x: 0, y: 0 })}
            className="bg-gray-600 text-gray-300 font-bold py-2 rounded hover:bg-gray-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            R
          </motion.button>
          <motion.button
            onClick={() => moveRobot('right')}
            className="bg-primary text-secondary-foreground font-bold py-2 rounded hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>

          <div />
          <motion.button
            onClick={() => moveRobot('down')}
            className="bg-primary text-secondary-foreground font-bold py-2 rounded hover:bg-primary/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↓
          </motion.button>
          <div />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Moves:</span>
          <span className="text-primary font-bold text-lg">{moves}</span>
        </div>
      </div>

      {/* Completion Message */}
      {completed && (
        <motion.div
          className="bg-primary/20 border-2 border-primary rounded-lg p-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-primary font-bold text-lg">🎉 Maze Complete!</p>
          <p className="text-gray-300 mt-2">You earned {Math.max(30, 100 - moves * 5)} XP!</p>
        </motion.div>
      )}
    </div>
  );
}
