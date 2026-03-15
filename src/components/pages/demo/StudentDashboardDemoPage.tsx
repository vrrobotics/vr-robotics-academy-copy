import { useState } from 'react';
import { BookOpen, Users, BarChart3, Trophy, Calendar, Play, MessageSquare, Menu, Bell, LogOut, Home, Award, Settings, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StudentDashboardDemoPage() {
  const [activeModule, setActiveModule] = useState('module-1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const mockStudentData = {
    name: 'Alex Kumar',
    email: 'alex.kumar@example.com',
    batchId: 'Batch A1',
    joinDate: '2024-02-01',
    completedModules: 3,
    totalModules: 9,
    overallProgress: 33,
    points: 2450,
    badges: 5,
    rating: 4.2
  };

  const mockModules = [
    { id: 'module-1', title: 'Introduction to Robotics', progress: 100, status: 'completed' },
    { id: 'module-2', title: 'Basic Programming', progress: 100, status: 'completed' },
    { id: 'module-3', title: 'Sensors & Actuators', progress: 100, status: 'completed' },
    { id: 'module-4', title: 'VR Environment Basics', progress: 60, status: 'in-progress' },
    { id: 'module-5', title: 'Advanced AI Concepts', progress: 0, status: 'locked' },
    { id: 'module-6', title: 'Project Development', progress: 0, status: 'locked' },
  ];

  const mockUpcomingClasses = [
    { id: 1, title: 'VR Robotics Session - Batch A1', time: '10:00 AM', date: 'Tomorrow', teacher: 'Ms. Sarah Johnson', status: 'scheduled' },
    { id: 2, title: 'Programming Workshop', time: '2:00 PM', date: 'Friday', teacher: 'Mr. John Smith', status: 'scheduled' },
    { id: 3, title: 'Group Project Work', time: '11:00 AM', date: 'Saturday', teacher: 'Ms. Sarah Johnson', status: 'scheduled' },
  ];

  const mockAssignments = [
    { id: 1, title: 'Build a Simple Robot', dueDate: '2024-03-20', status: 'pending', progress: 45 },
    { id: 2, title: 'Programming Challenge', dueDate: '2024-03-25', status: 'submitted', progress: 100 },
    { id: 3, title: 'Sensor Integration Task', dueDate: '2024-03-30', status: 'pending', progress: 20 },
  ];

  const mockLeaderboard = [
    { rank: 1, name: 'Priya Singh', points: 3200, badges: 8 },
    { rank: 2, name: 'Rohit Patel', points: 2950, badges: 7 },
    { rank: 3, name: 'Alex Kumar', points: 2450, badges: 5 },
    { rank: 4, name: 'Neha Sharma', points: 2100, badges: 4 },
    { rank: 5, name: 'Arjun Verma', points: 1850, badges: 3 },
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: BookOpen, label: 'My Courses', id: 'courses' },
    { icon: Calendar, label: 'Schedule', id: 'schedule' },
    { icon: Play, label: 'Assignments', id: 'assignments' },
    { icon: Award, label: 'Leaderboard', id: 'leaderboard' },
    { icon: BarChart3, label: 'Performance', id: 'performance' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: Users, label: 'Study Groups', id: 'groups' },
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: HelpCircle, label: 'Help & Support', id: 'help' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-indigo-700 text-white transition-all duration-300 overflow-hidden shadow-lg`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
            <h1 className="text-xl font-bold">StudentHub</h1>
            <p className="text-blue-200 text-xs">VR Robotics</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition group ${
                activePage === item.id
                  ? 'bg-white bg-opacity-20 border-l-4 border-white'
                  : 'hover:bg-blue-700'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`${sidebarOpen ? 'block' : 'hidden'} text-sm font-medium group-hover:translate-x-1 transition`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-10 left-4 right-4">
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 rounded-lg">
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(m => m.id === activePage)?.label || 'Student Dashboard'}
              </h1>
              <p className="text-gray-500 text-sm">Demo Mode - Welcome!</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold cursor-pointer hover:bg-blue-700">
                AK
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-6xl mx-auto px-8 py-8">
        {activePage === 'dashboard' && (
          <>
            {/* Welcome Card */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">Welcome back, {mockStudentData.name}!</h2>
                  <p className="text-gray-500 mt-2">Keep up your learning streak and achieve your goals</p>
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Batch</p>
                      <p className="text-lg font-bold text-blue-600">{mockStudentData.batchId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Overall Progress</p>
                      <p className="text-lg font-bold text-indigo-600">{mockStudentData.overallProgress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Points Earned</p>
                      <p className="text-lg font-bold text-green-600">{mockStudentData.points}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Overall Rating</p>
                  <p className="text-4xl font-bold text-yellow-500 mt-2">⭐ {mockStudentData.rating}/5</p>
                </div>
              </div>
            </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Modules Completed</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{mockStudentData.completedModules}/{mockStudentData.totalModules}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Gamification Points</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{mockStudentData.points}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Badges Earned</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{mockStudentData.badges}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Joined</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{mockStudentData.joinDate}</p>
                <p className="text-xs text-gray-500 mt-1">~6 weeks ago</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Learning Modules */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Modules</h3>
              <div className="space-y-4">
                {mockModules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      activeModule === module.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{module.title}</p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        module.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : module.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {module.status === 'in-progress' ? 'In Progress' : module.status === 'completed' ? 'Completed' : 'Locked'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition ${
                          module.status === 'completed'
                            ? 'bg-green-500'
                            : module.status === 'in-progress'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{module.progress}% complete</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {mockLeaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      entry.rank === 1 ? 'bg-yellow-500' : entry.rank === 2 ? 'bg-gray-400' : entry.rank === 3 ? 'bg-orange-600' : 'bg-gray-300'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <p className={`font-semibold ${entry.rank === 3 ? 'text-indigo-600' : 'text-gray-900'}`}>
                        {entry.name}
                      </p>
                      <p className="text-xs text-gray-500">{entry.badges} badges</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">{entry.points}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Classes */}
        <Card className="p-6 bg-white mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Classes
          </h3>
          <div className="space-y-4">
            {mockUpcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{classItem.title}</p>
                    <p className="text-sm text-gray-500">with {classItem.teacher}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{classItem.date}</p>
                  <p className="text-sm text-gray-500">{classItem.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Assignments */}
        <Card className="p-6 bg-white mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Assignments</h3>
          <div className="space-y-4">
            {mockAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{assignment.title}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    assignment.status === 'submitted'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Due: {assignment.dueDate}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition"
                    style={{ width: `${assignment.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{assignment.progress}% complete</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Info Section */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">About Student Dashboard</h3>
          <p className="text-indigo-800">
            Welcome to your personalized learning portal! Track your progress, earn gamification points, compete with peers
            on the leaderboard, and access all your learning modules. This demo showcases the complete student experience
            in the VR Robotics Academy platform.
          </p>
        </div>
          </>
        )}

        {activePage === 'courses' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
            <div className="space-y-4">
              {mockModules.map((module) => (
                <div key={module.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                        <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${module.progress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{module.progress}% Complete</p>
                    </div>
                    <span className={`ml-4 px-4 py-2 rounded-full text-sm font-semibold ${
                      module.status === 'completed' ? 'bg-green-100 text-green-700' :
                      module.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {module.status === 'in-progress' ? 'In Progress' : module.status === 'completed' ? 'Completed' : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activePage === 'schedule' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Schedule</h2>
            <div className="space-y-4">
              {mockUpcomingClasses.map((cls) => (
                <div key={cls.id} className="p-6 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{cls.title}</h3>
                      <p className="text-gray-600 mt-1">Teacher: {cls.teacher}</p>
                      <p className="text-gray-600 mt-1">{cls.date} at {cls.time}</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Join Class</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activePage === 'assignments' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Assignments</h2>
            <div className="space-y-4">
              {mockAssignments.map((assignment) => (
                <div key={assignment.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{assignment.title}</h3>
                      <p className="text-gray-600 mt-2">Due: {assignment.dueDate}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${assignment.progress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{assignment.progress}% submitted</p>
                    </div>
                    <span className={`ml-4 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                      assignment.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activePage === 'leaderboard' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Rank</th>
                    <th className="px-6 py-3 text-left font-semibold">Student Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Points</th>
                    <th className="px-6 py-3 text-left font-semibold">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((student) => (
                    <tr key={student.rank} className={`border-b ${student.rank <= 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'} transition`}>
                      <td className="px-6 py-4 font-bold text-lg">
                        {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : `#${student.rank}`}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">{student.points} pts</td>
                      <td className="px-6 py-4"><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{student.badges} 🎖️</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activePage === 'performance' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Learning Progress</h3>
                <p className="text-4xl font-bold text-blue-600">{mockStudentData.overallProgress}%</p>
                <p className="text-gray-600 mt-2">Course completion rate</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Points Earned</h3>
                <p className="text-4xl font-bold text-green-600">{mockStudentData.points}</p>
                <p className="text-gray-600 mt-2">Gamification score</p>
              </div>
            </div>
          </Card>
        )}

        {activePage === 'messages' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages & Discussions</h2>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No messages yet</p>
              <p className="text-gray-400 mt-2">Start a discussion with your teachers and classmates</p>
            </div>
          </Card>
        )}

        {activePage === 'groups' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Groups</h2>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No study groups yet</p>
              <p className="text-gray-400 mt-2">Create or join a study group with your peers</p>
            </div>
          </Card>
        )}

        {activePage === 'settings' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Profile Information</h3>
                <p className="text-gray-600">Name: {mockStudentData.name}</p>
                <p className="text-gray-600">Email: {mockStudentData.email}</p>
                <p className="text-gray-600">Batch: {mockStudentData.batchId}</p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-gray-700">Email notifications for assignments</span>
                </label>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          </Card>
        )}

        {activePage === 'help' && (
          <Card className="p-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <h3 className="font-semibold text-gray-900">How do I submit an assignment?</h3>
                <p className="text-gray-600 text-sm mt-2">Click on an assignment and use the upload button to submit your work before the deadline.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <h3 className="font-semibold text-gray-900">How are gamification points calculated?</h3>
                <p className="text-gray-600 text-sm mt-2">Points are awarded based on course completion, assignment submission, and class attendance.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <h3 className="font-semibold text-gray-900">How do I join a class?</h3>
                <p className="text-gray-600 text-sm mt-2">Go to the Schedule page and click the "Join Class" button to enter a live class session.</p>
              </div>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">Contact Support</Button>
            </div>
          </Card>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
