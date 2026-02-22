import { useEffect, useState } from 'react';
import { AnalyticsService } from '@/services/analyticsService';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserGrowthChart, EnrollmentChart, AttendanceChart, ProgressChart } from '@/components/dashboard/AnalyticsCharts';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface AdminAnalyticsDashboardProps {
  refreshInterval?: number;
}

export function AdminAnalyticsDashboard({ refreshInterval = 60000 }: AdminAnalyticsDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();

    // Set up refresh interval
    const interval = setInterval(loadAnalyticsData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);

      const [
        systemStats,
        userGrowth,
        enrollments,
        attendance,
        progress,
        engagement
      ] = await Promise.all([
        AnalyticsService.getSystemStats(),
        AnalyticsService.getUserGrowthData(12),
        AnalyticsService.getEnrollmentData(),
        AnalyticsService.getMeetingAttendanceData(),
        AnalyticsService.getStudentProgressData(),
        AnalyticsService.getEngagementMetrics()
      ]);

      setStats(systemStats);
      setUserGrowthData(userGrowth);
      setEnrollmentData(enrollments);
      setAttendanceData(attendance);
      setProgressData(progress);
      setEngagementMetrics(engagement);
    } catch (error) {
      console.error('[AdminAnalyticsDashboard] Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">System Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Total Users</p>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <Users className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          {/* Total Students */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Students</p>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {stats?.totalStudents || 0}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-400 opacity-20" />
            </div>
          </Card>

          {/* Total Batches */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Batches</p>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {stats?.totalBatches || 0}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-green-400 opacity-20" />
            </div>
          </Card>

          {/* Total Meetings */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Meetings</p>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {stats?.totalMeetings || 0}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-400 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Engagement Metrics */}
      {engagementMetrics && (
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Engagement Metrics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <p className="text-sm text-gray-400 mb-2">Active Users</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {engagementMetrics.activeUsers}
              </p>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <p className="text-sm text-gray-400 mb-2">Total Sessions</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {engagementMetrics.totalSessions}
              </p>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <p className="text-sm text-gray-400 mb-2">Avg Session Duration</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {engagementMetrics.averageSessionDuration} min
              </p>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <p className="text-sm text-gray-400 mb-2">Bounce Rate</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {engagementMetrics.bounceRate}%
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userGrowthData.length > 0 && (
          <UserGrowthChart data={userGrowthData} />
        )}

        {enrollmentData.length > 0 && (
          <EnrollmentChart data={enrollmentData} />
        )}

        {attendanceData.length > 0 && (
          <AttendanceChart data={attendanceData} />
        )}

        {progressData.length > 0 && (
          <ProgressChart data={progressData} />
        )}
      </div>

      {/* Additional Stats */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Additional Statistics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <p className="text-sm text-gray-400 mb-2">Teachers</p>
            <p className="text-2xl font-heading font-bold text-foreground">
              {stats?.totalTeachers || 0}
            </p>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <p className="text-sm text-gray-400 mb-2">Admins</p>
            <p className="text-2xl font-heading font-bold text-foreground">
              {stats?.totalAdmins || 0}
            </p>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <p className="text-sm text-gray-400 mb-2">Assignments</p>
            <p className="text-2xl font-heading font-bold text-foreground">
              {stats?.totalAssignments || 0}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
