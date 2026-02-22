import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

interface Class {
  id: string;
  name: string;
  level: string;
  students: number;
  schedule: string;
  status: 'active' | 'inactive';
}

export default function TeacherClassManagementPage() {
  const [classes] = useState<Class[]>([
    {
      id: '1',
      name: 'Robotics 101',
      level: 'Beginner',
      students: 25,
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      status: 'active'
    },
    {
      id: '2',
      name: 'Advanced VR',
      level: 'Advanced',
      students: 18,
      schedule: 'Tue, Thu - 2:00 PM',
      status: 'active'
    },
    {
      id: '3',
      name: 'Programming Basics',
      level: 'Beginner',
      students: 22,
      schedule: 'Mon, Wed - 3:00 PM',
      status: 'active'
    },
    {
      id: '4',
      name: 'AI & Robotics',
      level: 'Intermediate',
      students: 20,
      schedule: 'Sat - 11:00 AM',
      status: 'inactive'
    }
  ]);

  return (
    <TeacherPortalLayout pageTitle="Class Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Active Classes</p>
                <p className="font-heading text-3xl text-foreground">3</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary/60" />
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
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Total Students</p>
                <p className="font-heading text-3xl text-foreground">85</p>
              </div>
              <Users className="w-8 h-8 text-primary/60" />
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
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Avg Class Size</p>
                <p className="font-heading text-3xl text-foreground">21</p>
              </div>
              <Users className="w-8 h-8 text-primary/60" />
            </div>
          </motion.div>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          <h3 className="font-heading text-2xl text-foreground">Your Classes</h3>
          
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-heading text-lg text-foreground">{cls.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-paragraph border ${
                      cls.status === 'active'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : 'bg-foreground/10 border-foreground/20 text-foreground/60'
                    }`}>
                      {cls.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="font-paragraph text-foreground/70 mb-3">Level: {cls.level}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-foreground/60">
                      <Users className="w-4 h-4" />
                      <span className="font-paragraph">{cls.students} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <Calendar className="w-4 h-4" />
                      <span className="font-paragraph">{cls.schedule}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-sm">
                    Manage
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-300 font-paragraph text-sm">
                    View Students
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Class Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full px-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph font-medium"
        >
          Create New Class
        </motion.button>
      </div>
    </TeacherPortalLayout>
  );
}
