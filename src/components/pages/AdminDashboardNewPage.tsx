import { useEffect, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import { RoleService } from '@/services/roleService';
import { BaseCrudService } from '@/integrations';
import { Users, Batches, TeacherAssignments, Meetings, UpcomingClasses, DemoSessions } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users as UsersIcon, BookOpen, Users2, BarChart3, AlertCircle, UserCheck, ArrowRight, GraduationCap, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminAnalyticsDashboard } from '@/components/dashboard/AdminAnalyticsDashboard';
import DemoSessionsManagement from '@/components/dashboard/DemoSessionsManagement';

import { RealtimeNotificationCenter } from '@/components/RealtimeNotificationCenter';
import { RealtimeService } from '@/services/realtimeService';

export default function AdminDashboardNewPage() {
  const { currentRole, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalBatches: 0,
    totalClasses: 0,
    totalDemoSessions: 0
  });
  const [users, setUsers] = useState<Users[]>([]);
  const [meetings, setMeetings] = useState<Meetings[]>([]);
  const [batches, setBatches] = useState<Batches[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClasses[]>([]);
  const [demoSessions, setDemoSessions] = useState<DemoSessions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'meetings' | 'analytics' | 'demos'>('overview');

  useEffect(() => {
    if (roleLoading) return;

    // Allow public access - no role check required
    loadDashboardData();
  }, [currentRole, roleLoading]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load users
      const teachers = await RoleService.getAllTeachers();
      const students = await RoleService.getAllStudents();
      const allUsers = await RoleService.getUsersByRole('admin');
      const allUsersData = [...teachers, ...students, ...allUsers];

      setUsers(allUsersData);

      // Load batches
      const { items: batchesData = [] } = await (async () => {
        try {
          const { BaseCrudService } = await import('@/integrations');
          return await BaseCrudService.getAll<Batches>('batches');
        } catch {
          return { items: [] };
        }
      })();

      setBatches(batchesData);

      // Load upcoming classes
      const { items: classesData = [] } = await (async () => {
        try {
          const { BaseCrudService } = await import('@/integrations');
          return await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
        } catch {
          return { items: [] };
        }
      })();

      setUpcomingClasses(classesData);

      // Load demo sessions
      const { items: demoSessionsData = [] } = await (async () => {
        try {
          const { BaseCrudService } = await import('@/integrations');
          return await BaseCrudService.getAll<DemoSessions>('demosessions');
        } catch {
          return { items: [] };
        }
      })();

      setDemoSessions(demoSessionsData);

      // Update stats
      setStats({
        totalUsers: allUsersData.length,
        totalTeachers: teachers.length,
        totalStudents: students.length,
        totalBatches: batchesData.length,
        totalClasses: classesData.length,
        totalDemoSessions: demoSessionsData.length
      });
    } catch (err) {
      console.error('[AdminDashboard] Error loading data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-heading font-bold text-red-400 mb-2">Access Denied</h2>
              <p className="text-red-300">{error}</p>
              <Button
                onClick={() => navigate('/')}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-heading font-bold text-foreground mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Manage users, batches, and system settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Total Users</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.totalUsers}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Teachers</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.totalTeachers}
                </p>
              </div>
              <Users2 className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Students</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.totalStudents}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Batches</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.totalBatches}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Upcoming Classes</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.totalClasses}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Demo Sessions</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.totalDemoSessions}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-heading font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('demos')}
            className={`px-4 py-3 font-heading font-semibold border-b-2 transition ${
              activeTab === 'demos'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-foreground'
            }`}
          >
            Demo Sessions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'demos' && (
          <div className="mb-12">
            <DemoSessionsManagement />
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            {/* Users Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-heading font-bold text-foreground">Users</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  Add User
                </Button>
              </div>

              {users.length > 0 ? (
                <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50 border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {users.slice(0, 10).map((user) => (
                          <tr key={user._id} className="hover:bg-gray-800/30 transition">
                            <td className="px-6 py-4 text-sm text-foreground">{user.fullName || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-400">{user.email || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                {user.role || 'guest'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">{user.department || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                  <p className="text-gray-400">No users found</p>
                </Card>
              )}
            </div>

            {/* Batches Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-heading font-bold text-foreground">Batches</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  Create Batch
                </Button>
              </div>

              {batches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {batches.map((batch) => (
                    <Card key={batch._id} className="bg-gray-900/50 border-gray-800 p-6 hover:border-primary/50 transition">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                        {batch.batchName || 'Unnamed Batch'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{batch.batchLevel || 'N/A'}</p>
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-gray-500">
                          Status: <span className="text-primary">{batch.batchStatus || 'unknown'}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Teacher: <span className="text-foreground">{batch.assignedTeacherName || 'Unassigned'}</span>
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                  <p className="text-gray-400">No batches found</p>
                </Card>
              )}
            </div>

            {/* Upcoming Classes Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-heading font-bold text-foreground">Upcoming Classes</h2>
                <Button 
                  onClick={() => navigate('/admin-upcoming-classes')}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Manage Classes
                </Button>
              </div>

              {upcomingClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingClasses.slice(0, 3).map((upcomingClass) => (
                    <Card key={upcomingClass._id} className="bg-gray-900/50 border-gray-800 p-6 hover:border-primary/50 transition">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                        {upcomingClass.classTitle || 'Unnamed Class'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{upcomingClass.classDescription}</p>
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-gray-500">
                          Level: <span className="text-secondary">{upcomingClass.difficultyLevel || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Teacher: <span className="text-foreground">{upcomingClass.assignedTeacherName || 'Unassigned'}</span>
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                  <p className="text-gray-400 mb-4">No upcoming classes yet</p>
                  <Button 
                    onClick={() => navigate('/admin-upcoming-classes')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Create First Class
                  </Button>
                </Card>
              )}
            </div>

            {/* New Teachers Section */}
            <div className="mt-12 pt-12 border-t border-gray-800">
              <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Teacher Management</h2>
                <p className="text-gray-400">Review and manage teacher applications</p>
              </div>

              <Card className="bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/30 p-8 hover:border-blue-500/50 transition">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <UserCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                        New Teachers
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Review pending teacher applications, approve new instructors, and manage teacher access to the portal.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-blue-400">
                        <span>Manage applications</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/admin-new-teachers')}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
                  >
                    View Applications
                  </Button>
                </div>
              </Card>
            </div>

            {/* Courses Management Section */}
            <div className="mt-8">
              <Card className="bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border-green-500/30 p-8 hover:border-green-500/50 transition">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                      <GraduationCap className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                        Course Management
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Create and manage courses, add course content, organize sub-videos, and update course information.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <span>Manage courses</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/admin-add-courses')}
                    className="bg-green-500 hover:bg-green-600 text-white flex-shrink-0"
                  >
                    Manage Courses
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
