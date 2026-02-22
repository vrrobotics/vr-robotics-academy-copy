import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { Calendar, Clock, Users, Play, MapPin, BookOpen } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';
import { BaseCrudService } from '@/integrations';
import { UpcomingClasses } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function TeacherUpcomingClassesPage() {
  const { user } = useAuthStore();
  const [assignedClasses, setAssignedClasses] = useState<UpcomingClasses[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // ============================================================================
  // LOAD ASSIGNED CLASSES FOR THIS TEACHER
  // ============================================================================
  useEffect(() => {
    const loadAssignedClasses = async () => {
      try {
        if (!user?.fullName) {
          setClassesLoading(false);
          return;
        }

        setClassesLoading(true);
        const { items } = await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
        if (Array.isArray(items)) {
          // Filter classes assigned to this teacher
          const teacherClasses = items.filter(c => c.assignedTeacherName === user.fullName);
          // Sort by scheduled date
          teacherClasses.sort((a, b) => {
            if (!a.scheduledDateTime || !b.scheduledDateTime) return 0;
            return new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime();
          });
          console.log(`[TeacherUpcomingClassesPage] ✓ Loaded ${teacherClasses.length} assigned classes`);
          setAssignedClasses(teacherClasses);
        }
        setClassesLoading(false);
      } catch (error) {
        console.error('[TeacherUpcomingClassesPage] Error loading assigned classes:', error);
        setClassesLoading(false);
      }
    };

    loadAssignedClasses();
  }, [user?.fullName]);

  // Get unique categories for filtering
  const categories = ['all', ...new Set(assignedClasses.map(c => c.courseCategory).filter(Boolean))];

  // Filter classes based on selected category
  const filteredClasses = filterCategory === 'all'
    ? assignedClasses
    : assignedClasses.filter(c => c.courseCategory === filterCategory);

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

  return (
    <TeacherPortalLayout pageTitle="Upcoming Classes">
      <div className="space-y-6">
        {/* ====================================================================
            HEADER SECTION WITH STATS
            ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4"
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
            className="flex flex-wrap gap-2"
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
            UPCOMING CLASSES SECTION
            ==================================================================== */}
        {classesLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-foreground/60">Loading your classes...</p>
          </motion.div>
        ) : upcomingClasses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-heading text-xl text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              Upcoming Classes ({upcomingClasses.length})
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {upcomingClasses.map((upcomingClass, index) => (
                <motion.div
                  key={upcomingClass._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500/30 p-6 hover:border-green-500/60 transition-all duration-300">
                    {/* Class Title */}
                    <h4 className="font-heading text-lg text-foreground mb-3">
                      {upcomingClass.classTitle}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {upcomingClass.classDescription}
                    </p>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4 text-sm">
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
                          <span>{format(new Date(upcomingClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      )}

                      {/* Location */}
                      {upcomingClass.liveClassLink && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-foreground/70">Link:</span>
                          <a
                            href={upcomingClass.liveClassLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            Join Class
                          </a>
                        </div>
                      )}

                      {/* Students */}
                      {upcomingClass.assignedStudentNames && (
                        <div className="flex items-start gap-2 text-gray-400">
                          <Users className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <span className="text-foreground/70">Students Assigned:</span>
                            <p className="text-xs mt-1 text-gray-500">
                              {upcomingClass.assignedStudentNames.split(',').filter(id => id.trim()).length} student{upcomingClass.assignedStudentNames.split(',').filter(id => id.trim()).length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => window.open(upcomingClass.liveClassLink, '_blank')}
                      className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                      size="sm"
                    >
                      <Play className="w-4 h-4" />
                      Join Class
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 bg-foreground/5 rounded-lg border border-foreground/10"
          >
            <Calendar className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="font-paragraph text-foreground/60">No upcoming classes scheduled</p>
          </motion.div>
        )}

        {/* ====================================================================
            COMPLETED CLASSES SECTION
            ==================================================================== */}
        {pastClasses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-heading text-xl text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Completed Classes ({pastClasses.length})
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {pastClasses.map((pastClass, index) => (
                <motion.div
                  key={pastClass._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 p-6 opacity-75">
                    {/* Class Title */}
                    <h4 className="font-heading text-lg text-foreground/80 mb-3">
                      {pastClass.classTitle}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {pastClass.classDescription}
                    </p>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4 text-sm">
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
                          <span>{format(new Date(pastClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-foreground/40 text-center">
                      Class Completed
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </TeacherPortalLayout>
  );
}
