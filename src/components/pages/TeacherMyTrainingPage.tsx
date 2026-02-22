import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Award } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'available';
  progress: number;
  certificate?: string;
}

export default function TeacherMyTrainingPage() {
  const [courses] = useState<TrainingCourse[]>([
    {
      id: '1',
      title: 'Advanced Robotics Teaching',
      provider: 'STEM Academy',
      duration: '40 hours',
      status: 'completed',
      progress: 100,
      certificate: 'CERT-2024-001'
    },
    {
      id: '2',
      title: 'VR in Education',
      provider: 'EdTech Institute',
      duration: '30 hours',
      status: 'in-progress',
      progress: 75
    },
    {
      id: '3',
      title: 'AI & Machine Learning Basics',
      provider: 'Tech Learning Center',
      duration: '50 hours',
      status: 'available',
      progress: 0
    },
    {
      id: '4',
      title: 'Student Assessment Techniques',
      provider: 'Education Plus',
      duration: '25 hours',
      status: 'available',
      progress: 0
    }
  ]);

  return (
    <TeacherPortalLayout pageTitle="My Training">
      <div className="space-y-6">
        {/* Training Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Completed Courses</p>
                <p className="font-heading text-3xl text-foreground">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-paragraph text-sm text-foreground/60 mb-1">In Progress</p>
                <p className="font-heading text-3xl text-foreground">1</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Total Hours</p>
                <p className="font-heading text-3xl text-foreground">115</p>
              </div>
              <Award className="w-8 h-8 text-primary/60" />
            </div>
          </motion.div>
        </div>

        {/* Training Courses */}
        <div className="space-y-4">
          <h3 className="font-heading text-2xl text-foreground">Training Courses</h3>
          
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-heading text-lg text-foreground">{course.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-paragraph border ${
                      course.status === 'completed'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : course.status === 'in-progress'
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'bg-foreground/10 border-foreground/20 text-foreground/60'
                    }`}>
                      {course.status === 'completed' ? 'Completed' : course.status === 'in-progress' ? 'In Progress' : 'Available'}
                    </span>
                  </div>
                  <p className="font-paragraph text-foreground/70 mb-2">{course.provider}</p>
                  <p className="font-paragraph text-sm text-foreground/60">{course.duration}</p>
                </div>
              </div>

              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-paragraph text-xs text-foreground/60">Progress</p>
                    <p className="font-paragraph text-xs text-foreground/60">{course.progress}%</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {course.status === 'completed' && course.certificate && (
                  <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-sm">
                    Download Certificate
                  </button>
                )}
                {course.status === 'in-progress' && (
                  <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-sm">
                    Continue Course
                  </button>
                )}
                {course.status === 'available' && (
                  <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-sm">
                    Enroll Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TeacherPortalLayout>
  );
}
