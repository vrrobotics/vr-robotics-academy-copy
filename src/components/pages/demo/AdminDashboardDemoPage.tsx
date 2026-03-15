import { useState } from 'react';
import { Users, BookOpen, Users2, BarChart3, AlertCircle, UserCheck, ArrowRight, GraduationCap, Calendar, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboardDemoPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'meetings' | 'analytics' | 'demos'>('overview');

  const mockStats = {
    totalUsers: 245,
    totalTeachers: 18,
    totalStudents: 227,
    totalBatches: 12,
    totalClasses: 45,
    totalDemoSessions: 89
  };

  const mockRecentActivity = [
    { id: 1, type: 'New Enrollment', user: 'John Doe', date: '2024-03-14', status: 'pending' },
    { id: 2, type: 'Teacher Approval', user: 'Sarah Smith', date: '2024-03-13', status: 'approved' },
    { id: 3, type: 'Class Created', user: 'Batch A1', date: '2024-03-12', status: 'active' },
    { id: 4, type: 'Payment Received', user: 'Alice Johnson', date: '2024-03-11', status: 'completed' },
    { id: 5, type: 'Demo Booked', user: 'Mike Wilson', date: '2024-03-10', status: 'scheduled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Demo Mode - Read-Only Access</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              System Status: OK
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalUsers}</p>
                <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalTeachers}</p>
                <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalStudents}</p>
                <p className="text-green-600 text-sm mt-2">↑ 15% from last month</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <Users2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Batches</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalBatches}</p>
                <p className="text-green-600 text-sm mt-2">↑ 2 new batches</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming Classes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalClasses}</p>
                <p className="text-green-600 text-sm mt-2">This week</p>
              </div>
              <div className="bg-cyan-100 p-4 rounded-lg">
                <Calendar className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Demo Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.totalDemoSessions}</p>
                <p className="text-green-600 text-sm mt-2">↑ 23% from last month</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-4 py-2 font-medium ${activeTab === 'meetings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Meetings
          </button>
          <button
            onClick={() => setActiveTab('demos')}
            className={`px-4 py-2 font-medium ${activeTab === 'demos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Demos
          </button>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === 'approved' ? 'bg-green-100' : activity.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <UserCheck className={`w-5 h-5 ${activity.status === 'approved' ? 'text-green-600' : activity.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{activity.date}</p>
                  <p className={`text-sm font-semibold capitalize mt-1 ${activity.status === 'approved' ? 'text-green-600' : activity.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {activity.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Portal Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Admin Dashboard</h3>
          <p className="text-blue-800">
            This is a demonstration of the Admin Dashboard. In production, this dashboard provides comprehensive
            management tools for user approvals, batch management, analytics, and system monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
