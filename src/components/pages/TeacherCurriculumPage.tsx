import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, Play } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
}

export default function TeacherCurriculumPage() {
  const [modules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction to Robotics',
      description: 'Learn the fundamentals of robotics and basic programming concepts',
      lessons: 8,
      duration: '4 weeks',
      status: 'completed',
      progress: 100
    },
    {
      id: '2',
      title: 'Advanced Programming',
      description: 'Master advanced coding techniques and algorithms',
      lessons: 12,
      duration: '6 weeks',
      status: 'in-progress',
      progress: 65
    },
    {
      id: '3',
      title: 'VR Integration',
      description: 'Integrate virtual reality into robotics projects',
      lessons: 10,
      duration: '5 weeks',
      status: 'in-progress',
      progress: 40
    },
    {
      id: '4',
      title: 'AI & Machine Learning',
      description: 'Explore AI applications in robotics',
      lessons: 15,
      duration: '8 weeks',
      status: 'locked',
      progress: 0
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-primary" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-foreground/40" />;
      default:
        return null;
    }
  };

  return (
    <TeacherPortalLayout pageTitle="Curriculum">
      <div className="space-y-6">
        {/* Curriculum Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h3 className="font-heading text-2xl text-foreground">Curriculum Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-1">Total Modules</p>
              <p className="font-heading text-3xl text-foreground">4</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-1">Total Lessons</p>
              <p className="font-heading text-3xl text-foreground">45</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-1">Overall Progress</p>
              <p className="font-heading text-3xl text-foreground">51%</p>
            </div>
          </div>
        </motion.div>

        {/* Modules List */}
        <div className="space-y-4">
          <h3 className="font-heading text-2xl text-foreground">Course Modules</h3>
          
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`p-6 rounded-xl border transition-all duration-300 ${
                module.status === 'locked'
                  ? 'bg-foreground/5 border-foreground/10 opacity-60'
                  : 'bg-gradient-to-br from-foreground/5 to-foreground/10 border-foreground/10 hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(module.status)}
                  <div className="flex-1">
                    <h4 className="font-heading text-lg text-foreground mb-1">{module.title}</h4>
                    <p className="font-paragraph text-foreground/70">{module.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="font-paragraph text-foreground/60">
                  <span className="font-medium text-foreground">{module.lessons}</span> lessons
                </div>
                <div className="font-paragraph text-foreground/60">
                  <span className="font-medium text-foreground">{module.duration}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-paragraph text-xs text-foreground/60">Progress</p>
                  <p className="font-paragraph text-xs text-foreground/60">{module.progress}%</p>
                </div>
                <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={module.status === 'locked'}
                className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-all duration-300 ${
                  module.status === 'locked'
                    ? 'bg-foreground/10 border border-foreground/20 text-foreground/40 cursor-not-allowed'
                    : 'bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30'
                }`}
              >
                {module.status === 'locked' ? 'Locked' : module.status === 'completed' ? 'Review' : 'Continue'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </TeacherPortalLayout>
  );
}
