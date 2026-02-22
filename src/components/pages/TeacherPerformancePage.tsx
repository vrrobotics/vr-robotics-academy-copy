import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

export default function TeacherPerformancePage() {
  const [performanceData] = useState({
    overallRating: 9.2,
    studentSatisfaction: 4.8,
    attendanceRate: 92,
    completionRate: 87,
    improvementTrend: '+8%'
  });

  return (
    <TeacherPortalLayout pageTitle="Performance">
      <div className="space-y-6">
        {/* Overall Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-2xl text-foreground mb-2">Overall Performance</h3>
              <p className="font-paragraph text-foreground/60">Your teaching performance metrics</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Overall Rating</p>
              <p className="font-heading text-5xl text-primary mb-2">{performanceData.overallRating}</p>
              <p className="font-paragraph text-sm text-green-400">Excellent performance</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Improvement Trend</p>
              <p className="font-heading text-5xl text-green-400 mb-2">{performanceData.improvementTrend}</p>
              <p className="font-paragraph text-sm text-foreground/60">Compared to last quarter</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-paragraph text-sm text-foreground/60">Student Satisfaction</p>
              <Award className="w-6 h-6 text-primary/60" />
            </div>
            <p className="font-heading text-4xl text-foreground mb-2">{performanceData.studentSatisfaction}/5</p>
            <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '96%' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-paragraph text-sm text-foreground/60">Attendance Rate</p>
              <Target className="w-6 h-6 text-primary/60" />
            </div>
            <p className="font-heading text-4xl text-foreground mb-2">{performanceData.attendanceRate}%</p>
            <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-paragraph text-sm text-foreground/60">Completion Rate</p>
              <BarChart3 className="w-6 h-6 text-primary/60" />
            </div>
            <p className="font-heading text-4xl text-foreground mb-2">{performanceData.completionRate}%</p>
            <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-paragraph text-sm text-foreground/60">Classes Taught</p>
              <BarChart3 className="w-6 h-6 text-primary/60" />
            </div>
            <p className="font-heading text-4xl text-foreground mb-2">3</p>
            <p className="font-paragraph text-sm text-foreground/60">Active classes this semester</p>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6">Performance Insights</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-paragraph font-medium text-green-400 mb-1">✓ Strength: Student Engagement</p>
              <p className="font-paragraph text-sm text-foreground/70">Your interactive teaching methods are highly appreciated by students</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-paragraph font-medium text-primary mb-1">→ Area to Improve: Assessment Variety</p>
              <p className="font-paragraph text-sm text-foreground/70">Consider incorporating more diverse assessment methods</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-paragraph font-medium text-green-400 mb-1">✓ Strength: Professional Development</p>
              <p className="font-paragraph text-sm text-foreground/70">Excellent commitment to continuous learning and skill improvement</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3"
        >
          <button className="flex-1 px-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph font-medium">
            View Detailed Analytics
          </button>
          <button className="flex-1 px-6 py-3 rounded-lg bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-300 font-paragraph font-medium">
            Schedule Feedback Session
          </button>
        </motion.div>
      </div>
    </TeacherPortalLayout>
  );
}
