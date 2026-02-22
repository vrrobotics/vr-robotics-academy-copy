import { useEffect, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import { BaseCrudService } from '@/integrations';
import { UpcomingClasses, Users, Courses } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, Plus, Calendar, Users as UsersIcon, BookOpen, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateClassModal } from '@/components/dashboard/CreateClassModal';
import { format } from 'date-fns';

export default function AdminUpcomingClassesPage() {
  const { currentRole, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<UpcomingClasses[]>([]);
  const [teachers, setTeachers] = useState<Users[]>([]);
  const [students, setStudents] = useState<Users[]>([]);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (roleLoading) return;

    if (currentRole !== 'admin') {
      setError('Unauthorized: Admin access required');
      return;
    }

    loadData();
  }, [currentRole, roleLoading]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load upcoming classes
      const { items: classesData = [] } = await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
      setClasses(classesData);

      // Load users (teachers and students)
      const { items: usersData = [] } = await BaseCrudService.getAll<Users>('users');
      const teachersData = usersData.filter(u => u.role === 'teacher');
      const studentsData = usersData.filter(u => u.role === 'student');
      setTeachers(teachersData);
      setStudents(studentsData);

      // Load courses
      const { items: coursesData = [] } = await BaseCrudService.getAll<Courses>('courses');
      setCourses(coursesData);
    } catch (err) {
      console.error('[AdminUpcomingClasses] Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await BaseCrudService.delete('upcomingclasses', classId);
      setClasses(classes.filter(c => c._id !== classId));
    } catch (err) {
      console.error('[AdminUpcomingClasses] Error deleting class:', err);
      setError('Failed to delete class. Please try again.');
    }
  };

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && error.includes('Unauthorized')) {
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl sm:text-6xl font-heading font-bold text-foreground">
                Upcoming Classes
              </h1>
              <p className="text-lg text-gray-400 mt-2">
                Manage and schedule live classes for students
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Class
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && !error.includes('Unauthorized') && (
          <div className="mb-6 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300">{error}</p>
          </div>
        )}

        {/* Classes Grid */}
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((upcomingClass) => (
              <Card
                key={upcomingClass._id}
                className="bg-gray-900/50 border-gray-800 hover:border-primary/50 transition-colors overflow-hidden"
              >
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {upcomingClass.classTitle}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {upcomingClass.classDescription}
                  </p>

                  {/* Info Grid */}
                  <div className="space-y-3 mb-6">
                    {/* Difficulty Level */}
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-gray-300">
                        {upcomingClass.difficultyLevel || 'N/A'}
                      </span>
                    </div>

                    {/* Date & Time */}
                    {upcomingClass.scheduledDateTime && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-300">
                          {format(new Date(upcomingClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}

                    {/* Teacher */}
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">
                        {upcomingClass.assignedTeacherName || 'Unassigned'}
                      </span>
                    </div>

                    {/* Students Count */}
                    {upcomingClass.assignedStudentNames && (
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">
                          {upcomingClass.assignedStudentNames.split(',').filter(id => id.trim()).length} students assigned
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // Edit functionality can be added later
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:border-red-500"
                      onClick={() => handleDeleteClass(upcomingClass._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-gray-400 mb-2">
              No Classes Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first class to get started
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Create First Class
            </Button>
          </Card>
        )}
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <CreateClassModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onClassCreated={() => {
            setShowCreateModal(false);
            loadData();
          }}
          teachers={teachers}
          students={students}
          courses={courses}
        />
      )}
    </div>
  );
}
