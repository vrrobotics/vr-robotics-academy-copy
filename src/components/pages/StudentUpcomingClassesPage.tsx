import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRole } from '@/hooks/useRole';
import { BaseCrudService } from '@/integrations';
import { UpcomingClasses, Students, AttendanceRecords } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, Clock, Users, Play, MapPin, BookOpen, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentUpcomingClassesPage() {
  const { currentRole, userId, isLoading: roleLoading } = useRole();
  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [assignedClasses, setAssignedClasses] = useState<UpcomingClasses[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

  // ============================================================================
  // LOAD STUDENT DATA AND ASSIGNED CLASSES
  // ============================================================================
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

    loadStudentData();
  }, [currentRole, userId, roleLoading]);

  const loadStudentData = async () => {
    try {
      setClassesLoading(true);
      setError(null);

      // Get student info to get their name and email
      const { items: allStudents } = await BaseCrudService.getAll<Students>('students');
      const currentStudent = allStudents.find(s => s._id === userId);
      
      let email = '';
      if (currentStudent) {
        const fullName = `${currentStudent.firstName || ''} ${currentStudent.lastName || ''}`.trim();
        setStudentName(fullName);
        email = currentStudent.email || '';
        setStudentEmail(email);
        console.log(`[StudentUpcomingClassesPage] ✓ Loaded student: ${fullName} (${email})`);
      }

      // Get all upcoming classes
      const { items: allClasses } = await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
      
      // Load attendance records
      const { items: allAttendance } = await BaseCrudService.getAll<AttendanceRecords>('attendance');
      
      // Build attendance map: studentName-classTitle -> status
      const attendanceMap: Record<string, string> = {};
      if (Array.isArray(allAttendance)) {
        allAttendance.forEach(record => {
          if (record.studentName && record.batchIdentifier) {
            const key = `${record.studentName}-${record.batchIdentifier}`;
            attendanceMap[key] = record.attendanceStatus || 'Absent';
          }
        });
      }
      setAttendanceMap(attendanceMap);
      
      if (Array.isArray(allClasses)) {
        // Filter classes assigned to this student
        // assignedStudentNames contains comma-separated student IDs (from CreateClassModal)
        const studentClasses = allClasses.filter(c => {
          if (!c.assignedStudentNames) return false;
          // Parse comma-separated student IDs
          const assignedIds = c.assignedStudentNames.split(',').map(id => id.trim());
          // Check if current student's ID is in the list
          return assignedIds.includes(userId);
        });

        // Sort by scheduled date
        studentClasses.sort((a, b) => {
          if (!a.scheduledDateTime || !b.scheduledDateTime) return 0;
          return new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime();
        });

        console.log(`[StudentUpcomingClassesPage] ✓ Loaded ${studentClasses.length} assigned classes for student ID: ${userId}`);
        setAssignedClasses(studentClasses);
      }
      setClassesLoading(false);
    } catch (err) {
      console.error('[StudentUpcomingClassesPage] Error loading data:', err);
      setError('Failed to load your classes. Please try again.');
      setClassesLoading(false);
    }
  };

  // Get unique categories for filtering
  const categories = ['all', ...new Set(assignedClasses.map(c => c.courseCategory).filter(Boolean))];

  // Filter classes based on selected category
  const filteredClasses = filterCategory === 'all'
    ? assignedClasses
    : assignedClasses.filter(c => c.courseCategory === filterCategory);

  // Helper function to check if class is still joinable
  const isClassJoinable = (upcomingClass: UpcomingClasses): boolean => {
    if (!upcomingClass.endingDateTime) return false;
    const now = new Date();
    const endTime = new Date(upcomingClass.endingDateTime);
    return now <= endTime;
  };

  // Get upcoming classes (scheduled in the future)
  const upcomingClasses = filteredClasses.filter(c => {
    if (!c.scheduledDateTime) return false;
    return new Date(c.scheduledDateTime) > new Date();
  });

  // Get past classes (scheduled in the past)
  const pastClasses = filteredClasses.filter(c => {
    if (!c.scheduledDateTime) return false;
    return new Date(c.scheduledDateTime) <= new Date();
  });

  // ============================================================================
  // ATTENDANCE TRACKING
  // ============================================================================
  const getAttendanceStatus = (classTitle: string): string | null => {
    const key = `${studentName}-${classTitle}`;
    return attendanceMap[key] || null;
  };

  const markAttendance = async (classTitle: string, status: 'Attended' | 'Absent') => {
    try {
      const attendanceKey = `${studentName}-${classTitle}`;
      
      // Check if attendance record already exists
      const { items: existingRecords } = await BaseCrudService.getAll<AttendanceRecords>('attendance');
      const existingRecord = existingRecords.find(
        r => r.studentName === studentName && r.batchIdentifier === classTitle
      );

      if (existingRecord) {
        // Update existing record
        await BaseCrudService.update<AttendanceRecords>('attendance', {
          _id: existingRecord._id,
          attendanceStatus: status
        });
      } else {
        // Create new attendance record
        await BaseCrudService.create('attendance', {
          _id: crypto.randomUUID(),
          attendanceDate: new Date(),
          studentName: studentName,
          batchIdentifier: classTitle,
          attendanceStatus: status,
          teacherNotes: `Student ${status === 'Attended' ? 'joined' : 'did not join'} the live class`
        });
      }

      // Update local state
      setAttendanceMap(prev => ({
        ...prev,
        [attendanceKey]: status
      }));

      console.log(`[StudentUpcomingClassesPage] ✓ Marked ${studentName} as ${status} for ${classTitle}`);
    } catch (err) {
      console.error('[StudentUpcomingClassesPage] Error marking attendance:', err);
    }
  };

  const handleJoinClass = async (upcomingClass: UpcomingClasses) => {
    if (!upcomingClass.liveClassLink) return;

    // Mark as attended
    await markAttendance(upcomingClass.classTitle || '', 'Attended');

    // Open the class link
    window.open(upcomingClass.liveClassLink, '_blank');
  };

  // Error state
  if (error && currentRole !== 'student') {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ====================================================================
            HEADER SECTION
            ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-heading font-bold text-foreground mb-4">
            Your Upcoming Classes
          </h1>
          <p className="text-lg text-gray-400">
            View and join all your scheduled classes
          </p>
        </motion.div>

        {/* ====================================================================
            STATISTICS CARDS
            ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {/* Total Classes Card */}
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 font-paragraph">Total Classes</p>
                <p className="text-4xl font-heading font-bold text-foreground mt-2">
                  {assignedClasses.length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </Card>

          {/* Upcoming Classes Card */}
          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 font-paragraph">Upcoming</p>
                <p className="text-4xl font-heading font-bold text-foreground mt-2">
                  {upcomingClasses.length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </Card>

          {/* Completed Classes Card */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 font-paragraph">Completed</p>
                <p className="text-4xl font-heading font-bold text-foreground mt-2">
                  {pastClasses.length}
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </Card>
        </motion.div>

        {/* ====================================================================
            FILTER SECTION
            ==================================================================== */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-all duration-300 ${
                  filterCategory === category
                    ? 'bg-primary text-background'
                    : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>
        )}

        {/* ====================================================================
            LOADING STATE
            ==================================================================== */}
        {classesLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <LoadingSpinner />
            <p className="font-paragraph text-foreground/60 mt-4">Loading your classes...</p>
          </motion.div>
        ) : upcomingClasses.length > 0 ? (
          <>
            {/* ====================================================================
                UPCOMING CLASSES SECTION
                ==================================================================== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="font-heading text-3xl text-foreground flex items-center gap-2 mb-6">
                <Clock className="w-8 h-8 text-green-400" />
                Upcoming Classes ({upcomingClasses.length})
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingClasses.map((upcomingClass, index) => (
                  <motion.div
                    key={upcomingClass._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500/30 p-6 hover:border-green-500/60 transition-all duration-300 h-full flex flex-col">
                      {/* Class Title */}
                      <h3 className="font-heading text-lg text-foreground mb-3">
                        {upcomingClass.classTitle}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
                        {upcomingClass.classDescription}
                      </p>

                      {/* Details Grid */}
                      <div className="space-y-3 mb-6 text-sm">
                        {/* Category */}
                        <div className="flex items-center gap-2 text-gray-400">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-foreground/70">Category:</span>
                          <span>{upcomingClass.courseCategory}</span>
                        </div>

                        {/* Difficulty Level */}
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-foreground/70">Level:</span>
                          <span>{upcomingClass.difficultyLevel}</span>
                        </div>

                        {/* Scheduled Date & Time */}
                        {upcomingClass.scheduledDateTime && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-foreground/70">Scheduled:</span>
                            <span className="text-xs">{format(new Date(upcomingClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        )}

                        {/* Teacher */}
                        {upcomingClass.assignedTeacherName && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-foreground/70">Teacher:</span>
                            <span>{upcomingClass.assignedTeacherName}</span>
                          </div>
                        )}
                      </div>

                      {/* Attendance Status */}
                      {getAttendanceStatus(upcomingClass.classTitle || '') && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                          getAttendanceStatus(upcomingClass.classTitle || '') === 'Attended'
                            ? 'bg-green-500/20 border border-green-500/50'
                            : 'bg-red-500/20 border border-red-500/50'
                        }`}>
                          {getAttendanceStatus(upcomingClass.classTitle || '') === 'Attended' ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span className="text-sm font-paragraph text-green-300">Attended</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                              <span className="text-sm font-paragraph text-red-300">Absent</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Action Button - Show until ending time */}
                      {isClassJoinable(upcomingClass) ? (
                        <Button
                          onClick={() => handleJoinClass(upcomingClass)}
                          disabled={!upcomingClass.liveClassLink}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          size="sm"
                        >
                          <Play className="w-4 h-4" />
                          Join Class
                        </Button>
                      ) : (
                        <div className="w-full p-3 rounded-lg bg-gray-700/30 border border-gray-600/50 text-center">
                          <p className="text-xs text-gray-400">Class ended</p>
                          {upcomingClass.endingDateTime && (
                            <p className="text-xs text-gray-500 mt-1">
                              Ended: {format(new Date(upcomingClass.endingDateTime), 'MMM dd, yyyy HH:mm')}
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ====================================================================
                COMPLETED CLASSES SECTION
                ==================================================================== */}
            {pastClasses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-heading text-3xl text-foreground flex items-center gap-2 mb-6">
                  <Users className="w-8 h-8 text-purple-400" />
                  Completed Classes ({pastClasses.length})
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastClasses.map((pastClass, index) => (
                    <motion.div
                      key={pastClass._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 p-6 opacity-75 h-full flex flex-col">
                        {/* Class Title */}
                        <h3 className="font-heading text-lg text-foreground/80 mb-3">
                          {pastClass.classTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                          {pastClass.classDescription}
                        </p>

                        {/* Details Grid */}
                        <div className="space-y-3 mb-6 text-sm">
                          {/* Category */}
                          <div className="flex items-center gap-2 text-gray-500">
                            <BookOpen className="w-4 h-4 text-primary/50" />
                            <span className="text-foreground/50">Category:</span>
                            <span>{pastClass.courseCategory}</span>
                          </div>

                          {/* Difficulty Level */}
                          <div className="flex items-center gap-2 text-gray-500">
                            <Users className="w-4 h-4 text-primary/50" />
                            <span className="text-foreground/50">Level:</span>
                            <span>{pastClass.difficultyLevel}</span>
                          </div>

                          {/* Scheduled Date & Time */}
                          {pastClass.scheduledDateTime && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4 text-primary/50" />
                              <span className="text-foreground/50">Completed:</span>
                              <span className="text-xs">{format(new Date(pastClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                          )}
                        </div>

                        {/* Attendance Status for Past Classes */}
                        {getAttendanceStatus(pastClass.classTitle || '') && (
                          <div className={`p-3 rounded-lg flex items-center gap-2 ${
                            getAttendanceStatus(pastClass.classTitle || '') === 'Attended'
                              ? 'bg-green-500/20 border border-green-500/50'
                              : 'bg-red-500/20 border border-red-500/50'
                          }`}>
                            {getAttendanceStatus(pastClass.classTitle || '') === 'Attended' ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-sm font-paragraph text-green-300">Attended</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <span className="text-sm font-paragraph text-red-300">Absent</span>
                              </>
                            )}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 bg-foreground/5 rounded-lg border border-foreground/10"
          >
            <Calendar className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="font-paragraph text-foreground/60">No upcoming classes scheduled</p>
            <p className="font-paragraph text-sm text-foreground/40 mt-2">
              Check back soon or contact your instructor for more information
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
