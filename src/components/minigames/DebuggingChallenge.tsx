import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/stores/gamificationStore';

interface CodeLine {
  id: string;
  code: string;
  hasError: boolean;
  errorType?: string;
}

export default function DebuggingChallenge({ onComplete }: { onComplete: (xpEarned: number) => void }) {
  const { addXP } = useGamificationStore();
  const [codeLines] = useState<CodeLine[]>([
    { id: '1', code: 'function moveRobot(distance) {', hasError: false },
    { id: '2', code: '  robot.speed = 100;', hasError: false },
    { id: '3', code: '  robot.move(distance)', hasError: true, errorType: 'Missing semicolon' },
    { id: '4', code: '  if (distance > 0) {', hasError: false },
    { id: '5', code: '    robot.forward();', hasError: false },
    { id: '6', code: '  } else {', hasError: false },
    { id: '7', code: '    robot.backward()', hasError: true, errorType: 'Missing semicolon' },
    { id: '8', code: '}', hasError: false },
  ]);

  const [fixedLines, setFixedLines] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleFixLine = (lineId: string) => {
    const line = codeLines.find((l) => l.id === lineId);
    if (line?.hasError && !fixedLines.includes(lineId)) {
      const newFixed = [...fixedLines, lineId];
      setFixedLines(newFixed);

      // Check if all errors are fixed
      const errorLines = codeLines.filter((l) => l.hasError);
      if (newFixed.length === errorLines.length) {
        setCompleted(true);
        const xpReward = 60;
        addXP(xpReward);
        setTimeout(() => onComplete(xpReward), 1000);
      }
    }
  };

  const errorLines = codeLines.filter((l) => l.hasError);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Debugging Challenge</h2>
      <p className="text-gray-400 mb-6">Find and fix all the errors in the code!</p>

      {/* Code Display */}
      <motion.div
        className="bg-secondary-foreground rounded-lg border-2 border-primary/30 p-4 mb-6 font-mono text-sm overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {codeLines.map((line, index) => {
          const isFixed = fixedLines.includes(line.id);
          return (
            <motion.div
              key={line.id}
              className={`py-2 px-3 rounded mb-1 transition-all ${
                line.hasError
                  ? isFixed
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-red-900/30 text-red-400'
                  : 'text-gray-300'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-gray-500 mr-4">{index + 1}</span>
              {line.code}
              {line.hasError && !isFixed && (
                <span className="ml-2 text-xs text-red-400">← {line.errorType}</span>
              )}
              {isFixed && <span className="ml-2 text-xs text-green-400">✓ Fixed</span>}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Error List */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-3">Errors Found ({errorLines.length})</h3>
        <div className="space-y-2">
          {errorLines.map((line) => {
            const isFixed = fixedLines.includes(line.id);
            return (
              <motion.button
                key={line.id}
                onClick={() => handleFixLine(line.id)}
                disabled={isFixed}
                className={`w-full p-3 rounded-lg text-left font-semibold transition-all ${
                  isFixed
                    ? 'bg-green-900/30 text-green-400 border-2 border-green-600'
                    : 'bg-red-900/30 text-red-400 border-2 border-red-600 hover:bg-red-900/50'
                }`}
                whileHover={!isFixed ? { scale: 1.02 } : {}}
                whileTap={!isFixed ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {isFixed ? '✓' : '✗'} Line {line.id}: {line.errorType}
                  </span>
                  {!isFixed && <span className="text-sm">Click to fix</span>}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Errors Fixed</span>
          <span className="text-primary font-bold">
            {fixedLines.length} / {errorLines.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(fixedLines.length / errorLines.length) * 100}%` }}
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
          <p className="text-primary font-bold text-lg">🎉 All Bugs Fixed!</p>
          <p className="text-gray-300 mt-2">You earned 60 XP!</p>
        </motion.div>
      )}
    </div>
  );
}
