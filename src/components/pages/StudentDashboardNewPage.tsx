import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBatchSync } from '@/hooks/useBatchSync';
import { BaseCrudService } from '@/integrations';
import { Courses, Enrollments, Payments } from '@/entities';
import { BookOpen, Users, Clock, Target, LogOut, CheckCircle, AlertCircle, Lock, Unlock, Play } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface Batchmate {
  id: string;
  name: string;
  profilePicture?: string;
}

export default function StudentDashboardNewPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // Use batch sync hook to get meetings for student's batch
  const {
    meetings,
    isLoading,
  } = useBatchSync(user?.batchId, false);

  const [courses, setCourses] = useState<Courses[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollments[]>([]);
  const [payments, setPayments] = useState<Payments[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Robotics Module 5',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Submit VR Game Project',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Attend Batch Meeting',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'high'
    }
  ]);

  const [batchmates] = useState<Batchmate[]>([
    { id: '1', name: 'Emma Davis' },
    { id: '2', name: 'Liam Chen' },
    { id: '3', name: 'Sophia Rodriguez' },
    { id: '4', name: 'Noah Smith' }
  ]);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    
    // Load courses, enrollments, and payments
    const loadCourseData = async () => {
      try {
        setCoursesLoading(true);
        
        // Fetch all courses
        const { items: coursesData = [] } = await BaseCrudService.getAll<Courses>('courses');
        setCourses(coursesData);
        
        // Fetch enrollments for this student
        const { items: enrollmentsData = [] } = await BaseCrudService.getAll<Enrollments>('enrollments');
        const studentEnrollments = enrollmentsData.filter(e => e.userId === user.id);
        setEnrollments(studentEnrollments);
        
        // Fetch payments for this student
        const { items: paymentsData = [] } = await BaseCrudService.getAll<Payments>('payments');
        const studentPayments = paymentsData.filter(p => p.userId === user.id);
        setPayments(studentPayments);
      } catch (error) {
        console.error('Error loading course data:', error);
      } finally {
        setCoursesLoading(false);
      }
    };
    
    if (user?.id) {
      loadCourseData();
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-foreground/70';
    }
  };

  const isCourseUnlocked = (courseId: string) => {
    // Course is unlocked if student is enrolled in it
    return enrollments.some(e => e.courseId === courseId);
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Circuit Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(216, 255, 145, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(216, 255, 145, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <section className="relative py-8 px-8 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-heading text-4xl text-primary mb-2"
              style={{
                textShadow: '0 0 30px rgba(216, 255, 145, 0.4)'
              }}
            >
              Welcome, {user.fullName}!
            </h1>
            <p className="font-paragraph text-foreground/70">
              Batch: {user.batchId} • Role: Student
            </p>
          </motion.div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-heading"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12 px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: 'Modules Completed', value: '8/18', color: 'primary' },
              { icon: CheckCircle, label: 'Tasks Completed', value: '12', color: 'secondary' },
              { icon: Users, label: 'Batchmates', value: '4', color: 'primary' },
              { icon: Target, label: 'Progress', value: '44%', color: 'secondary' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 255, 145, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className="font-heading text-3xl text-foreground mb-1">{stat.value}</div>
                <div className="font-paragraph text-sm text-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(216, 255, 145, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h2 className="font-heading text-2xl text-foreground mb-6">Available Courses</h2>
            {coursesLoading ? (
              <div className="text-center py-8">
                <p className="text-foreground/60">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-foreground/60">No courses available yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => {
                  const isUnlocked = isCourseUnlocked(course._id);
                  const enrolled = isEnrolled(course._id);
                  
                  return (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-6 rounded-xl border transition-all ${
                        isUnlocked
                          ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                          : 'bg-foreground/5 border-foreground/10 hover:border-foreground/20'
                      }`}
                    >
                      {/* Lock/Unlock Badge */}
                      <div className="absolute top-4 right-4">
                        {isUnlocked ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                            <Unlock className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-heading text-green-400">Unlocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30">
                            <Lock className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-heading text-red-400">Locked</span>
                          </div>
                        )}
                      </div>

                      {/* Course Content */}
                      <div className="pr-24">
                        <h3 className="font-heading text-lg text-foreground mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/70 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        {/* Course Info */}
                        <div className="space-y-2 mb-4 text-xs font-paragraph text-foreground/60">
                          <div className="flex items-center justify-between">
                            <span>Instructor:</span>
                            <span className="text-foreground">{course.instructorName || 'TBD'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Price:</span>
                            <span className="text-foreground font-semibold">${course.price || 0}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {isUnlocked ? (
                          <div className="space-y-2">
                            <motion.button
                              className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-heading text-sm flex items-center justify-center gap-2 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Play className="w-4 h-4" />
                              View Classes
                            </motion.button>
                            <motion.button
                              className="w-full py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-heading text-sm border border-primary/50 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Play className="w-4 h-4 inline mr-2" />
                              Recorded Videos
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            className="w-full py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 text-foreground/50 font-heading text-sm border border-foreground/20 transition-colors cursor-not-allowed"
                            disabled
                          >
                            <Lock className="w-4 h-4 inline mr-2" />
                            Locked - Enroll to Access
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tasks Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(216, 255, 145, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 className="font-heading text-2xl text-foreground mb-6">Your Tasks</h2>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      task.status === 'completed'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-foreground/5 border-foreground/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <motion.button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-1 ${
                          task.status === 'completed'
                            ? 'bg-green-500/20 border-green-500'
                            : 'border-foreground/30'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {task.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </motion.button>
                      <div className="flex-1">
                        <h3 className={`font-heading text-foreground ${
                          task.status === 'completed' ? 'line-through opacity-60' : ''
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`font-paragraph text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="font-paragraph text-xs text-foreground/60">
                            Due: {task.dueDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Batchmates Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(216, 255, 145, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 className="font-heading text-2xl text-foreground mb-6">Your Batchmates</h2>
              <div className="space-y-3">
                {batchmates.map((batchmate, index) => (
                  <motion.div
                    key={batchmate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-heading text-sm text-primary">
                          {batchmate.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-heading text-foreground">{batchmate.name}</h4>
                        <p className="font-paragraph text-xs text-foreground/60">Student</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
}
