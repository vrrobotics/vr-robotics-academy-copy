import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award, Calendar, TrendingUp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { member, actions } = useMember();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await actions.logout();
    navigate('/');
  };

  // Mock data - in a real app, this would come from the database
  const studentStats = {
    coursesEnrolled: 3,
    coursesCompleted: 1,
    totalXP: 2450,
    currentLevel: 5,
    badgesEarned: 8,
  };

  const enrolledCourses = [
    {
      id: 1,
      title: 'Introduction to VR Robotics',
      progress: 65,
      instructor: 'John Smith',
      dueDate: '2025-12-31',
    },
    {
      id: 2,
      title: 'Advanced Robot Programming',
      progress: 40,
      instructor: 'Sarah Johnson',
      dueDate: '2026-01-15',
    },
    {
      id: 3,
      title: 'Robotics Design Fundamentals',
      progress: 85,
      instructor: 'Mike Davis',
      dueDate: '2025-12-20',
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: 'Live Robotics Workshop',
      date: '2025-12-16',
      time: '10:00 AM',
      instructor: 'John Smith',
    },
    {
      id: 2,
      title: 'Q&A Session',
      date: '2025-12-18',
      time: '2:00 PM',
      instructor: 'Sarah Johnson',
    },
  ];

  const badges = [
    { id: 1, name: 'First Steps', icon: '🚀' },
    { id: 2, name: 'Quick Learner', icon: '⚡' },
    { id: 3, name: 'Problem Solver', icon: '🧩' },
    { id: 4, name: 'Team Player', icon: '👥' },
    { id: 5, name: 'Code Master', icon: '💻' },
    { id: 6, name: 'Innovation Star', icon: '⭐' },
    { id: 7, name: 'Persistence', icon: '💪' },
    { id: 8, name: 'Excellence', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header with User Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-heading font-bold text-white">
                Welcome, {member?.profile?.nickname || 'Student'}!
              </h1>
              <p className="text-gray-300 font-paragraph">
                Continue your VR robotics learning journey
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30 p-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-paragraph">Courses Enrolled</p>
                  <p className="text-3xl font-heading font-bold text-orange-400">
                    {studentStats.coursesEnrolled}
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30 p-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-paragraph">Completed</p>
                  <p className="text-3xl font-heading font-bold text-green-400">
                    {studentStats.coursesCompleted}
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 p-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-paragraph">Total XP</p>
                  <p className="text-3xl font-heading font-bold text-blue-400">
                    {studentStats.totalXP}
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30 p-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-paragraph">Level</p>
                  <p className="text-3xl font-heading font-bold text-purple-400">
                    {studentStats.currentLevel}
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/30 p-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-paragraph">Badges</p>
                  <p className="text-3xl font-heading font-bold text-yellow-400">
                    {studentStats.badgesEarned}
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-800/50 border border-orange-500/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20">
                <BookOpen className="w-4 h-4 mr-2" />
                My Courses
              </TabsTrigger>
              <TabsTrigger value="classes" className="data-[state=active]:bg-orange-500/20">
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming Classes
              </TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-orange-500/20">
                <Award className="w-4 h-4 mr-2" />
                Badges
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-orange-500/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>

            {/* My Courses Tab */}
            <TabsContent value="overview" className="space-y-4">
              {enrolledCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-orange-500/20 p-6 hover:border-orange-500/40 transition-colors">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-white">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-paragraph">
                            Instructor: {course.instructor}
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                        >
                          Continue Learning
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-paragraph">Progress</span>
                          <span className="text-orange-400 font-semibold">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                          />
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 font-paragraph">
                        Due: {new Date(course.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Upcoming Classes Tab */}
            <TabsContent value="classes" className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-orange-500/20 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-heading font-semibold text-white">
                          {classItem.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-paragraph">
                          Instructor: {classItem.instructor}
                        </p>
                        <p className="text-sm text-orange-400 font-semibold">
                          {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
                        </p>
                      </div>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                        Join Class
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-800/50 border-orange-500/20 p-6 text-center hover:border-orange-500/40 transition-colors">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="text-sm font-heading font-semibold text-white">
                        {badge.name}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <Card className="bg-slate-800/50 border-orange-500/20 p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-white mb-4">
                      Learning Progress
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400 font-paragraph">Overall Progress</span>
                          <span className="text-orange-400 font-semibold">63%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '63%' }}
                            transition={{ duration: 1 }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400 font-paragraph">XP to Next Level</span>
                          <span className="text-blue-400 font-semibold">550 / 1000</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '55%' }}
                            transition={{ duration: 1 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-orange-500/20">
                    <h4 className="text-sm font-heading font-semibold text-white mb-3">
                      Recent Achievements
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400 font-paragraph">
                      <li>✓ Completed Module 1 - Earned 100 XP</li>
                      <li>✓ Solved 5 Challenges - Earned 50 XP</li>
                      <li>✓ Participated in Live Class - Earned 25 XP</li>
                      <li>✓ Earned "Quick Learner" Badge</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
