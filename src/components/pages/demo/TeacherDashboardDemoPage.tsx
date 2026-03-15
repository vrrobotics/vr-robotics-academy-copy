import { useState } from 'react';
import { Calendar, Users, BookOpen, BarChart3, Settings, LogOut, Menu, Bell, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TeacherDashboardDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mockTeacherData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    department: 'VR Robotics',
    joinDate: '2024-01-15',
    totalClasses: 12,
    totalStudents: 156,
    monthlyEarnings: 2400,
    rating: 4.8
  };

  const mockUpcomingClasses = [
    { id: 1, title: 'Introduction to Robotics - Batch A1', time: '10:00 AM', date: 'Today', students: 24 },
    { id: 2, title: 'Advanced Programming - Batch B2', time: '2:00 PM', date: 'Today', students: 18 },
    { id: 3, title: 'Robotics Basics - Batch A3', time: '10:00 AM', date: 'Tomorrow', students: 22 },
    { id: 4, title: 'Project Work Session - Batch B1', time: '3:00 PM', date: 'Tomorrow', students: 20 },
  ];

  const menuItems = [
    { icon: Calendar, label: 'Classes', href: '#' },
    { icon: Users, label: 'Students', href: '#' },
    { icon: BookOpen, label: 'Curriculum', href: '#' },
    { icon: BarChart3, label: 'Performance', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
            <h1 className="text-xl font-bold">TeachHub</h1>
            <p className="text-purple-200 text-xs">VR Robotics</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-purple-700 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-purple-700 transition group"
            >
              <item.icon className="w-5 h-5" />
              <span className={`${sidebarOpen ? 'block' : 'hidden'} group-hover:translate-x-1 transition`}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-10 left-4 right-4">
          <Button className="w-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-500 text-sm">Demo Mode - Welcome Back!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent ml-2 outline-none text-sm"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Teacher Profile Card */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  SJ
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{mockTeacherData.name}</h2>
                  <p className="text-gray-600">{mockTeacherData.email}</p>
                  <p className="text-purple-600 font-medium mt-1">Rating: ⭐ {mockTeacherData.rating}/5.0</p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">Edit Profile</Button>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Total Classes</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{mockTeacherData.totalClasses}</p>
              <p className="text-gray-500 text-xs mt-2">This semester</p>
            </Card>

            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{mockTeacherData.totalStudents}</p>
              <p className="text-gray-500 text-xs mt-2">Across all batches</p>
            </Card>

            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Monthly Earnings</p>
              <p className="text-3xl font-bold text-green-600 mt-2">₹{mockTeacherData.monthlyEarnings}</p>
              <p className="text-gray-500 text-xs mt-2">Current month</p>
            </Card>

            <Card className="p-6">
              <p className="text-gray-600 text-sm font-medium">Joined Date</p>
              <p className="text-lg font-bold text-gray-900 mt-2">{mockTeacherData.joinDate}</p>
              <p className="text-gray-500 text-xs mt-2">VR Robotics Academy</p>
            </Card>
          </div>

          {/* Upcoming Classes */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Classes</h3>
            <div className="space-y-4">
              {mockUpcomingClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{classItem.title}</p>
                      <p className="text-sm text-gray-500">{classItem.date} at {classItem.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{classItem.students}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Demo Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">About Teacher Dashboard</h3>
            <p className="text-blue-800">
              This is a demonstration of the Teacher Dashboard. Teachers can manage classes, track student progress,
              view earnings, and access curriculum resources from this portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
