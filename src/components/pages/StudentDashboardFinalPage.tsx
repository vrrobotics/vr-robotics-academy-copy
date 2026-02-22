import { useEffect, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import { BaseCrudService } from '@/integrations';
import { Enrollments, Courses, Assignments, QuizResults, Meetings, UpcomingClasses, Students } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BookOpen, Award, CheckCircle, AlertCircle, Calendar, Play, Bell } from 'lucide-react';
import { MeetingCalendar } from '@/components/dashboard/MeetingCalendar';
import { Image } from '@/components/ui/image';
import { format } from 'date-fns';
import EnrollmentOnboardingPopup from '@/components/EnrollmentOnboardingPopup';

export default function StudentDashboardFinalPage() {
  const { currentRole, userId, isLoading: roleLoading } = useRole();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    badges: 0
  });
  const [enrollments, setEnrollments] = useState<Enrollments[]>([]);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [assignments, setAssignments] = useState<Assignments[]>([]);
  const [meetings, setMeetings] = useState<Meetings[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<UpcomingClasses[]>([]);
  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollmentPopup, setShowEnrollmentPopup] = useState(false);

  // Helper function to check if class is still joinable
  const isClassJoinable = (upcomingClass: UpcomingClasses): boolean => {
    if (!upcomingClass.endingDateTime) return false;
    const now = new Date();
    const endTime = new Date(upcomingClass.endingDateTime);
    return now <= endTime;
  };

  useEffect(() => {
    if (roleLoading) return;

    if (currentRole !== 'student') {
      setError('Unauthorized: Student access required');
      return;
    }

    if (!userId) {
      setError('User ID not found');
      return;
    }

    loadDashboardData();
  }, [currentRole, userId, roleLoading]);

  // Check for enrollments and show popup if none exist
  useEffect(() => {
    if (enrollments.length === 0 && !isLoading && !error) {
      setShowEnrollmentPopup(true);
    }
  }, [enrollments, isLoading, error]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        setError('User ID not available');
        return;
      }

      // Get student info to get their name
      const { items: allStudents = [] } = await BaseCrudService.getAll<Students>('students');
      const currentStudent = allStudents.find(s => s._id === userId);
      
      if (currentStudent) {
        const fullName = `${currentStudent.firstName || ''} ${currentStudent.lastName || ''}`.trim();
        setStudentName(fullName);
        setStudentEmail(currentStudent.email || '');
        console.log(`[StudentDashboard] ✓ Loaded student: ${fullName}`);
      }

      // Get student's enrollments
      const { items: allEnrollments = [] } = await BaseCrudService.getAll<Enrollments>('enrollments');
      const studentEnrollments = allEnrollments.filter(e => e.userId === userId);
      setEnrollments(studentEnrollments);

      // Get courses
      const { items: allCourses = [] } = await BaseCrudService.getAll<Courses>('courses');
      const enrolledCourses = allCourses.filter(c =>
        studentEnrollments.some(e => e.courseId === c._id)
      );
      setCourses(enrolledCourses);

      // Get assignments
      const { items: allAssignments = [] } = await BaseCrudService.getAll<Assignments>('assignments');
      setAssignments(allAssignments);

      // Get meetings for enrolled courses (visible to student)
      const { items: allMeetings = [] } = await BaseCrudService.getAll<Meetings>('meetings');
      // Filter meetings for batches where student is enrolled
      const studentMeetings = allMeetings.filter(m => {
        // Show meetings for student's enrolled courses
        return true; // Can be enhanced with batch filtering
      });
      setMeetings(studentMeetings);

      // Get assigned classes for this student
      const { items: allClasses = [] } = await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
      // Filter classes where this student is assigned (using student ID)
      const studentClasses = allClasses.filter(c => {
        if (!c.assignedStudentNames) return false;
        // Parse comma-separated student IDs
        const assignedIds = c.assignedStudentNames.split(',').map(id => id.trim());
        // Check if current student's ID is in the list
        return assignedIds.includes(userId);
      });
      setAssignedClasses(studentClasses);

      // Calculate stats
      const completedCount = studentEnrollments.filter(e => e.status === 'completed').length;
      const totalProgress = studentEnrollments.length > 0
        ? Math.round(studentEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / studentEnrollments.length)
        : 0;

      setStats({
        enrolledCourses: studentEnrollments.length,
        completedCourses: completedCount,
        averageProgress: totalProgress,
        badges: 0 // Placeholder - can be fetched from badges collection
      });
    } catch (err) {
      console.error('[StudentDashboard] Error loading data:', err);
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
                onClick={() => window.location.href = '/'}
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
      <EnrollmentOnboardingPopup 
        isOpen={showEnrollmentPopup}
        onClose={() => setShowEnrollmentPopup(false)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-heading font-bold text-foreground mb-4">
            My Learning Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Track your progress and continue learning
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Enrolled Courses</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.enrolledCourses}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Completed</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.completedCourses}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Avg Progress</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.averageProgress}%
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-400">%</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Badges Earned</p>
                <p className="text-4xl font-heading font-bold text-foreground">
                  {stats.badges}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold text-foreground">My Courses</h2>
            <Button className="bg-primary hover:bg-primary/90">
              Browse Courses
            </Button>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const enrollment = enrollments.find(e => e.courseId === course._id);
                return (
                  <Card key={course._id} className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-primary/50 transition">
                    {course.thumbnail && (
                      <div className="w-full h-40 bg-gray-800 overflow-hidden">
                        <Image src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                        {course.title || 'Unnamed Course'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {course.description || 'No description available'}
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-semibold text-primary">
                            {enrollment?.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${enrollment?.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Continue Learning
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
              <p className="text-gray-400 mb-4">No courses enrolled yet</p>
              <Button className="bg-primary hover:bg-primary/90">
                Browse Available Courses
              </Button>
            </Card>
          )}
        </div>

        {/* Upcoming Classes Section */}
        {assignedClasses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-heading font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-8 h-8 text-green-400" />
                Your Upcoming Classes
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 text-sm font-heading">
                <Bell className="w-4 h-4" />
                {assignedClasses.length} class{assignedClasses.length !== 1 ? 'es' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedClasses.map((upcomingClass) => (
                <Card key={upcomingClass._id} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 overflow-hidden hover:border-green-500/50 transition">
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                      {upcomingClass.classTitle}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {upcomingClass.classDescription}
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Level:</span>
                        <span className="text-foreground font-semibold">{upcomingClass.difficultyLevel}</span>
                      </div>
                      {upcomingClass.scheduledDateTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span className="text-gray-400">
                            {format(new Date(upcomingClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Teacher:</span>
                        <span className="text-foreground">{upcomingClass.assignedTeacherName}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (upcomingClass.liveClassLink) {
                          window.open(upcomingClass.liveClassLink, '_blank');
                        }
                      }}
                      disabled={!isClassJoinable(upcomingClass) || !upcomingClass.liveClassLink}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {isClassJoinable(upcomingClass) ? 'Join Class' : 'Class Ended'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold text-foreground">Assignments</h2>
          </div>

          {assignments.length > 0 ? (
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Max Points</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {assignments.slice(0, 10).map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4 text-sm text-foreground">{assignment.title || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{assignment.maxPoints || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">
                          <Button variant="outline" size="sm">
                            Submit
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
              <p className="text-gray-400">No assignments available</p>
            </Card>
          )}
        </div>

        {/* Meetings Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold text-foreground">My Meetings</h2>
          </div>

          <MeetingCalendar
            meetings={meetings}
            showUpcomingOnly={true}
          />
        </div>
      </div>
    </div>
  );
}
