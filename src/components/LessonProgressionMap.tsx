import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { CourseModules } from '@/entities';
import { Image } from '@/components/ui/image';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';

interface LessonNode {
  _id: string;
  title?: string;
  description?: string;
  orderNumber?: number;
  estimatedDuration?: string;
  isPublished?: boolean;
  isCompleted?: boolean;
  isUnlocked?: boolean;
}

interface ProgressionMapProps {
  courseId: string;
  courseName?: string;
  completedLessons?: string[];
  onLessonSelect?: (lessonId: string) => void;
}

export default function LessonProgressionMap({
  courseId,
  courseName = 'Course Progression',
  completedLessons = [],
  onLessonSelect,
}: ProgressionMapProps) {
  const [lessons, setLessons] = useState<LessonNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<LessonNode | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const { items } = await BaseCrudService.getAll<CourseModules>('coursemodules');
        const courseLessons = items
          .filter((item) => item.courseId === courseId && item.isPublished)
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
          .map((lesson, index) => ({
            _id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            orderNumber: lesson.orderNumber,
            estimatedDuration: lesson.estimatedDuration,
            isPublished: lesson.isPublished,
            isCompleted: completedLessons.includes(lesson._id),
            isUnlocked: index === 0 || completedLessons.includes(items[index - 1]?._id),
          }));

        setLessons(courseLessons);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load lessons:', error);
        setLoading(false);
      }
    };

    loadLessons();
  }, [courseId, completedLessons]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-primary mb-2">{courseName}</h2>
        <p className="text-gray-400">Complete each class to level up and unlock the next challenge</p>
      </div>

      {/* Horizontal Progression Path */}
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG Path Container */}
        <div className="relative h-48 w-full mb-8">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 ${Math.max(lessons.length * 120, 800)} 200`}
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
          >
            {/* Animated Path Line */}
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 140, 66, 0.3)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(255, 140, 66, 0.3)" />
              </linearGradient>
            </defs>
            
            {/* Main Path - Wavy Line */}
            <motion.path
              d={`M 40 100 ${lessons.map((_, i) => {
                const x = 40 + (i * (100 / Math.max(lessons.length - 1, 1)));
                const y = 100 + (Math.sin(i * 0.8) * 20);
                return `Q ${x + 30} ${y - 30}, ${x + 60} ${y}`;
              }).join(' ')}`}
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </svg>

          {/* Lesson Nodes - Positioned on the Path */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson._id);
              const isUnlocked = index === 0 || completedLessons.includes(lessons[index - 1]?._id);
              const progress = (index / Math.max(lessons.length - 1, 1)) * 100;
              const yOffset = Math.sin(index * 0.8) * 20;

              return (
                <motion.div
                  key={lesson._id}
                  className="flex-1 flex justify-center relative"
                  style={{
                    transform: `translateY(${yOffset}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Node Circle - Layered Effect */}
                  <motion.div
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedLesson(lesson);
                        onLessonSelect?.(lesson._id);
                      }
                    }}
                    className={`relative flex-shrink-0 cursor-pointer transition-all ${
                      isUnlocked ? 'hover:scale-110' : 'opacity-60'
                    }`}
                    whileHover={isUnlocked ? { scale: 1.15 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {/* Outer Large Circle */}
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-lg transition-all border-2 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-secondary/30 to-primary/20 border-secondary/60'
                          : isUnlocked
                          ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/50'
                          : 'bg-gray-700/20 border-gray-600/40'
                      }`}
                    >
                      {/* Inner Small Circle - Centered on top */}
                      <motion.div
                        className={`absolute w-16 h-16 rounded-full flex items-center justify-center font-bold text-base transition-all border-2 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-secondary to-primary text-secondary-foreground border-secondary shadow-lg shadow-secondary/60'
                            : isUnlocked
                            ? 'bg-gradient-to-br from-blue-500/60 to-blue-600/50 text-blue-100 border-blue-300 shadow-lg shadow-blue-500/50'
                            : 'bg-gray-700/60 text-gray-400 border-gray-500'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.05 }}
                      >
                        {isCompleted ? '👑' : index + 1}
                      </motion.div>
                    </div>

                    {/* Glow Effect for Unlocked */}
                    {isUnlocked && !isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(59, 130, 246, 0.4)',
                            '0 0 45px rgba(59, 130, 246, 0.8)',
                            '0 0 20px rgba(59, 130, 246, 0.4)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Lock Icon for Locked */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-500" />
                      </div>
                    )}

                    {/* Tooltip on Hover */}
                    <motion.div
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900/95 border border-primary/50 rounded-lg px-3 py-2 whitespace-nowrap text-xs text-foreground pointer-events-none"
                      initial={{ opacity: 0, y: 5 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="font-bold">{lesson.title}</p>
                      <p className="text-gray-400">{lesson.estimatedDuration || '5 min'}</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 border border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Total Levels</p>
            <p className="text-4xl font-bold text-primary">{lessons.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-secondary">
              {completedLessons.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Progress</p>
            <p className="text-4xl font-bold text-primary">
              {lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{
                width: lessons.length > 0 ? `${(completedLessons.length / lessons.length) * 100}%` : '0%',
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedLesson(null)}
        >
          <motion.div
            className="bg-secondary-foreground rounded-2xl p-8 max-w-md w-full border-2 border-primary/50"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-primary">
                Level {selectedLesson.orderNumber}
              </h3>
              {completedLessons.includes(selectedLesson._id) && (
                <span className="text-3xl">✓</span>
              )}
            </div>

            <h4 className="text-xl font-semibold text-foreground mb-3">
              {selectedLesson.title}
            </h4>

            <p className="text-gray-300 mb-6">{selectedLesson.description}</p>

            {/* Lesson Info */}
            <div className="space-y-3 mb-6 bg-primary/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration:</span>
                <span className="text-primary font-bold">
                  {selectedLesson.estimatedDuration || '5 minutes'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status:</span>
                <span className="text-secondary font-bold">
                  {completedLessons.includes(selectedLesson._id)
                    ? 'Completed ✓'
                    : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={() => {
                setSelectedLesson(null);
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary text-secondary-foreground font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {completedLessons.includes(selectedLesson._id)
                ? 'Review Level'
                : 'Start Level'}
            </motion.button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedLesson(null)}
              className="w-full mt-3 text-gray-400 hover:text-foreground transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
