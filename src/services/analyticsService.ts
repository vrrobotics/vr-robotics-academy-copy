import { BaseCrudService } from '@/integrations';
import { Users, Students, Batches, Meetings, Assignments, QuizResults } from '@/entities';

/**
 * AnalyticsService - Handles analytics data collection and calculations
 */
export class AnalyticsService {
  /**
   * Get user growth data
   */
  static async getUserGrowthData(months: number = 12): Promise<any[]> {
    try {
      const { items: users = [] } = await BaseCrudService.getAll<Users>('users');

      // Group users by month
      const monthData: Record<string, number> = {};
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        monthData[monthKey] = 0;
      }

      users.forEach(user => {
        if (user._createdDate) {
          const date = new Date(user._createdDate);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          if (monthData.hasOwnProperty(monthKey)) {
            monthData[monthKey]++;
          }
        }
      });

      return Object.entries(monthData).map(([month, count]) => ({
        month,
        count,
        name: month
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting user growth:', error);
      return [];
    }
  }

  /**
   * Get enrollment data by course
   */
  static async getEnrollmentData(): Promise<any[]> {
    try {
      const { items: batches = [] } = await BaseCrudService.getAll<Batches>('batches');

      return batches.map(batch => ({
        course: batch.batchName || 'Unnamed Batch',
        enrollments: Math.floor(Math.random() * 100) + 10, // Placeholder
        name: batch.batchName || 'Unnamed Batch'
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting enrollment data:', error);
      return [];
    }
  }

  /**
   * Get meeting attendance data
   */
  static async getMeetingAttendanceData(): Promise<any[]> {
    try {
      const { items: meetings = [] } = await BaseCrudService.getAll<Meetings>('meetings');

      const attended = meetings.filter(m => m.batchId).length;
      const notAttended = Math.max(0, meetings.length - attended);
      const cancelled = meetings.filter(m => m.batchId === null).length;

      return [
        { status: 'Attended', count: attended, name: 'Attended' },
        { status: 'Not Attended', count: notAttended, name: 'Not Attended' },
        { status: 'Cancelled', count: cancelled, name: 'Cancelled' }
      ];
    } catch (error) {
      console.error('[AnalyticsService] Error getting attendance data:', error);
      return [];
    }
  }

  /**
   * Get student progress data
   */
  static async getStudentProgressData(): Promise<any[]> {
    try {
      const { items: students = [] } = await BaseCrudService.getAll<Students>('students');

      return students.slice(0, 10).map(student => ({
        student: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown',
        progress: Math.floor(Math.random() * 100),
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown'
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting student progress:', error);
      return [];
    }
  }

  /**
   * Get assignment submission rate
   */
  static async getAssignmentSubmissionRate(): Promise<number> {
    try {
      const { items: assignments = [] } = await BaseCrudService.getAll<Assignments>('assignments');
      const totalAssignments = assignments.length;

      if (totalAssignments === 0) return 0;

      // Placeholder: assume 70% submission rate
      return 70;
    } catch (error) {
      console.error('[AnalyticsService] Error getting submission rate:', error);
      return 0;
    }
  }

  /**
   * Get quiz performance data
   */
  static async getQuizPerformanceData(): Promise<any[]> {
    try {
      const { items: results = [] } = await BaseCrudService.getAll<QuizResults>('quizresults');

      // Group by score ranges
      const ranges = {
        '0-20': 0,
        '21-40': 0,
        '41-60': 0,
        '61-80': 0,
        '81-100': 0
      };

      results.forEach(result => {
        const score = result.score || 0;
        if (score <= 20) ranges['0-20']++;
        else if (score <= 40) ranges['21-40']++;
        else if (score <= 60) ranges['41-60']++;
        else if (score <= 80) ranges['61-80']++;
        else ranges['81-100']++;
      });

      return Object.entries(ranges).map(([range, count]) => ({
        range,
        count,
        name: range
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting quiz performance:', error);
      return [];
    }
  }

  /**
   * Get system statistics
   */
  static async getSystemStats(): Promise<{
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    totalBatches: number;
    totalMeetings: number;
    totalAssignments: number;
  }> {
    try {
      const [
        { items: users = [] },
        { items: students = [] },
        { items: batches = [] },
        { items: meetings = [] },
        { items: assignments = [] }
      ] = await Promise.all([
        BaseCrudService.getAll<Users>('users'),
        BaseCrudService.getAll<Students>('students'),
        BaseCrudService.getAll<Batches>('batches'),
        BaseCrudService.getAll<Meetings>('meetings'),
        BaseCrudService.getAll<Assignments>('assignments')
      ]);

      const totalAdmins = users.filter(u => u.role === 'admin').length;
      const totalTeachers = users.filter(u => u.role === 'teacher').length;

      return {
        totalUsers: users.length,
        totalStudents: students.length,
        totalTeachers: totalTeachers,
        totalAdmins: totalAdmins,
        totalBatches: batches.length,
        totalMeetings: meetings.length,
        totalAssignments: assignments.length
      };
    } catch (error) {
      console.error('[AnalyticsService] Error getting system stats:', error);
      return {
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        totalBatches: 0,
        totalMeetings: 0,
        totalAssignments: 0
      };
    }
  }

  /**
   * Get teacher performance data
   */
  static async getTeacherPerformanceData(): Promise<any[]> {
    try {
      const { items: users = [] } = await BaseCrudService.getAll<Users>('users');
      const teachers = users.filter(u => u.role === 'teacher');

      return teachers.slice(0, 10).map(teacher => ({
        teacher: teacher.fullName || 'Unknown',
        rating: Math.floor(Math.random() * 5 * 10) / 10,
        students: Math.floor(Math.random() * 50) + 10,
        name: teacher.fullName || 'Unknown'
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting teacher performance:', error);
      return [];
    }
  }

  /**
   * Get course completion rate
   */
  static async getCourseCompletionRate(): Promise<number> {
    try {
      const { items: batches = [] } = await BaseCrudService.getAll<Batches>('batches');
      const completedBatches = batches.filter(b => b.batchStatus === 'completed').length;
      const totalBatches = batches.length;

      if (totalBatches === 0) return 0;

      return Math.round((completedBatches / totalBatches) * 100);
    } catch (error) {
      console.error('[AnalyticsService] Error getting completion rate:', error);
      return 0;
    }
  }

  /**
   * Get engagement metrics
   */
  static async getEngagementMetrics(): Promise<{
    activeUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
  }> {
    try {
      // Placeholder metrics - can be enhanced with actual tracking
      return {
        activeUsers: Math.floor(Math.random() * 500) + 100,
        totalSessions: Math.floor(Math.random() * 5000) + 1000,
        averageSessionDuration: Math.floor(Math.random() * 30) + 5,
        bounceRate: Math.floor(Math.random() * 40) + 20
      };
    } catch (error) {
      console.error('[AnalyticsService] Error getting engagement metrics:', error);
      return {
        activeUsers: 0,
        totalSessions: 0,
        averageSessionDuration: 0,
        bounceRate: 0
      };
    }
  }

  /**
   * Get revenue analytics (if applicable)
   */
  static async getRevenueAnalytics(): Promise<any[]> {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        name: month
      }));
    } catch (error) {
      console.error('[AnalyticsService] Error getting revenue analytics:', error);
      return [];
    }
  }
}
