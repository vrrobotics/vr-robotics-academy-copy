import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

interface AuditMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

export default function TeacherAuditPage() {
  const [metrics] = useState<AuditMetric[]>([
    { label: 'Student Satisfaction', value: '4.8/5', change: '+0.2', icon: <Award className="w-8 h-8" /> },
    { label: 'Class Attendance', value: '92%', change: '+5%', icon: <Users className="w-8 h-8" /> },
    { label: 'Performance Rating', value: '9.2/10', change: '+0.5', icon: <TrendingUp className="w-8 h-8" /> },
    { label: 'Course Completion', value: '87%', change: '+3%', icon: <BarChart3 className="w-8 h-8" /> }
  ]);

  return (
    <TeacherPortalLayout pageTitle="Audit">
      <div className="space-y-6">
        {/* Audit Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-paragraph text-sm text-foreground/60 mb-2">{metric.label}</p>
                  <p className="font-heading text-3xl text-foreground">{metric.value}</p>
                  <p className="font-paragraph text-sm text-green-400 mt-1">{metric.change} from last period</p>
                </div>
                <div className="text-primary/60">{metric.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Audit Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6">Performance Review</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <p className="font-heading text-lg text-foreground mb-2">Teaching Effectiveness</p>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <p className="font-paragraph text-sm text-foreground/60">92% - Excellent performance in classroom management and student engagement</p>
            </div>

            <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <p className="font-heading text-lg text-foreground mb-2">Student Learning Outcomes</p>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <p className="font-paragraph text-sm text-foreground/60">87% - Students achieving learning objectives and demonstrating skill improvement</p>
            </div>

            <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <p className="font-heading text-lg text-foreground mb-2">Professional Development</p>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '95%' }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <p className="font-paragraph text-sm text-foreground/60">95% - Actively pursuing training and staying updated with latest teaching methodologies</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3"
        >
          <button className="flex-1 px-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph font-medium">
            Download Full Report
          </button>
          <button className="flex-1 px-6 py-3 rounded-lg bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-300 font-paragraph font-medium">
            Schedule Review
          </button>
        </motion.div>
      </div>
    </TeacherPortalLayout>
  );
}
