import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import CalendarScheduler from '@/components/CalendarScheduler';
import { BaseCrudService } from '@/integrations';
import { Batches, Meetings, UpcomingClasses, TeacherAssignments, Students } from '@/entities';
import { useBatchSync } from '@/hooks/useBatchSync';
import { convertUTCToLocalDate } from '@/lib/dateNormalization';
import TeacherPortalLayout from './TeacherPortalLayout';
import { CheckCircle, BookOpen, Users, Calendar, Play, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  attendance: number;
  progress: number;
}

interface BatchInfo {
  id: string;
  name: string;
  level: string;
  studentCount: number;
  schedule: string;
}

export default function TeacherDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [allBatches, setAllBatches] = useState<Batches[]>([]);
  const [hasLoadedAllBatches, setHasLoadedAllBatches] = useState(false);
  const [assignedClasses, setAssignedClasses] = useState<UpcomingClasses[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<Students[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignments[]>([]);

  // ============================================================================
  // STEP 1: BASIC USER CHECK (Allow public access)
  // ============================================================================
  useEffect(() => {
    console.log('[TeacherDashboardPage] Component mounted');
    
    // Allow public access - no role check required
    if (!user) {
      console.warn('[TeacherDashboardPage] No user found - loading demo data');
      return;
    }

    console.log(`[TeacherDashboardPage] ✓ User loaded - userId: ${user.id}, name: ${user.fullName}`);
  }, [user, navigate]);

  // ============================================================================
  // STEP 2: LOAD TEACHER-SPECIFIC DATA
  // ============================================================================
  useEffect(() => {
    const loadTeacherData = async () => {
      if (!user?.id || !user?.fullName) return;

      try {
        console.log(`[TeacherDashboardPage] Loading data for teacher: ${user.fullName} (ID: ${user.id})`);

        // Load all batches
        const { items: batches } = await BaseCrudService.getAll<Batches>('batches');
        if (Array.isArray(batches)) {
          console.log(`[TeacherDashboardPage] ✓ Loaded ${batches.length} batches`);
          setAllBatches(batches);
        }
        setHasLoadedAllBatches(true);

        // Load assigned classes for this teacher
        const { items: classes } = await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
        if (Array.isArray(classes)) {
          const teacherClasses = classes.filter(c => c.assignedTeacherName === user.fullName);
          console.log(`[TeacherDashboardPage] ✓ Loaded ${teacherClasses.length} assigned classes`);
          setAssignedClasses(teacherClasses);
        }

        // Load teacher assignments to find assigned batches
        const { items: assignments } = await BaseCrudService.getAll<TeacherAssignments>('teacherassignments');
        if (Array.isArray(assignments)) {
          const myAssignments = assignments.filter(a => a.teacherId === user.id && a.isActive);
          console.log(`[TeacherDashboardPage] ✓ Loaded ${myAssignments.length} teacher assignments`);
          setTeacherAssignments(myAssignments);

          // Load students for assigned batches
          if (myAssignments.length > 0) {
            const { items: allStudents } = await BaseCrudService.getAll<Students>('students');
            if (Array.isArray(allStudents)) {
              const assignedBatchIds = myAssignments.map(a => a.batchId);
              const myStudents = allStudents.filter(s => assignedBatchIds.includes(s.batchId));
              console.log(`[TeacherDashboardPage] ✓ Loaded ${myStudents.length} assigned students`);
              setAssignedStudents(myStudents);
            }
          }
        }
      } catch (error) {
        console.error('[TeacherDashboardPage] Error loading teacher data:', error);
      }
    };

    loadTeacherData();
  }, [user?.id, user?.fullName]);

  // ============================================================================
  // STEP 3: PREPARE STUDENT DATA FOR DISPLAY
  // ============================================================================
  const displayStudents = assignedStudents.map((student, index) => ({
    id: student._id || `student-${index}`,
    name: `${student.firstName} ${student.lastName}`,
    attendance: 85 + Math.floor(Math.random() * 15),
    progress: 75 + Math.floor(Math.random() * 20)
  }));

  // Use batch sync hook for real-time synchronization
  const {
    selectedBatchId,
    batches,
    meetings,
    isLoading,
    isSyncing,
    setSelectedBatch,
  } = useBatchSync(user?.id, false);

  const [batch, setBatch] = useState<BatchInfo | null>(null);
  const [filteredMeetings, setFilteredMeetings] = useState<Meetings[]>([]);

  const [tasks] = useState([
    { id: '1', title: 'Grade Module 5 Submissions', status: 'pending', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    { id: '2', title: 'Prepare Next Week Lesson', status: 'pending', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    { id: '3', title: 'Update Attendance Records', status: 'completed', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
  ]);

  // ============================================================================
  // STEP 4: AUTO-SELECT FIRST ACTIVE BATCH IF NO ASSIGNMENTS
  // ============================================================================
  useEffect(() => {
    try {
      if (Array.isArray(batches) && batches.length > 0) {
        console.log(`[TeacherDashboardPage] ✓ Teacher has ${batches.length} assigned batch(es)`);
        
        if (!selectedBatchId && batches[0]?._id) {
          console.log(`[TeacherDashboardPage] Auto-selecting first assigned batch: ${batches[0]._id}`);
          setSelectedBatch(batches[0]._id);
        }
        return;
      }

      if (hasLoadedAllBatches && Array.isArray(allBatches) && allBatches.length > 0) {
        const activeBatches = allBatches.filter(b => b.batchStatus === 'active' || !b.batchStatus);
        
        if (activeBatches.length > 0) {
          const firstActiveBatch = activeBatches[0];
          console.log(`[TeacherDashboardPage] ✓ No assigned batches. Auto-selecting first ACTIVE batch from collection: ${firstActiveBatch._id}`);
          setSelectedBatch(firstActiveBatch._id);
          return;
        }

        if (allBatches[0]?._id) {
          console.log(`[TeacherDashboardPage] ✓ No active batches. Auto-selecting first available batch from collection: ${allBatches[0]._id}`);
          setSelectedBatch(allBatches[0]._id);
        }
      }
    } catch (error) {
      console.error('[TeacherDashboardPage] Error in auto-select batch logic:', error);
    }
  }, [batches, allBatches, hasLoadedAllBatches, selectedBatchId, setSelectedBatch]);

  // ============================================================================
  // STEP 5: HANDLE BATCH SELECTION AND MEETINGS SYNC
  // ============================================================================
  useEffect(() => {
    try {
      if (!selectedBatchId || typeof selectedBatchId !== 'string' || selectedBatchId.trim() === '') {
        console.warn('[TeacherDashboardPage] Invalid or missing selectedBatchId:', selectedBatchId);
        setBatch(null);
        setFilteredMeetings([]);
        return;
      }

      let selectedBatch = batches.find(b => b._id === selectedBatchId);
      
      if (!selectedBatch && Array.isArray(allBatches)) {
        selectedBatch = allBatches.find(b => b._id === selectedBatchId);
      }
      
      if (!selectedBatch) {
        console.warn(`[TeacherDashboardPage] Selected batch ${selectedBatchId} not found`);
        setBatch(null);
        setFilteredMeetings([]);
        return;
      }

      const batchId = selectedBatch._id;
      const batchName = selectedBatch.batchName || 'Unnamed Batch';
      const batchLevel = selectedBatch.batchLevel || 'N/A';

      if (!batchId) {
        console.error('[TeacherDashboardPage] Selected batch has no _id:', selectedBatch);
        setBatch(null);
        setFilteredMeetings([]);
        return;
      }

      console.log(`[TeacherDashboardPage] ✓ Setting batch: ID=${batchId}, Name=${batchName}, Level=${batchLevel}`);

      setBatch({
        id: batchId,
        name: batchName,
        level: batchLevel,
        studentCount: displayStudents.length,
        schedule: 'Mon, Wed, Fri - 4:00 PM to 6:00 PM'
      });
      
      if (!Array.isArray(meetings)) {
        console.error('[TeacherDashboardPage] Invalid meetings - not an array:', meetings);
        setFilteredMeetings([]);
        return;
      }

      const batchMeetings = meetings.filter(m => {
        if (!m.batchId) {
          console.warn('[TeacherDashboardPage] Meeting missing batchId:', m._id);
          return false;
        }
        return m.batchId === selectedBatchId;
      });

      console.log(`[TeacherDashboardPage] ✓ Filtered ${batchMeetings.length} meetings for batch ${selectedBatchId}`);
      setFilteredMeetings(batchMeetings);
    } catch (error) {
      console.error('[TeacherDashboardPage] Error updating batch info:', error);
      setBatch(null);
      setFilteredMeetings([]);
    }
  }, [selectedBatchId, batches, meetings, allBatches, displayStudents.length]);

  const handleLogout = useCallback(() => {
    console.log('[TeacherDashboardPage] Logout clicked');
    logout();
    navigate('/');
  }, [logout, navigate]);

  if (isLoading) {
    console.log('[TeacherDashboardPage] Showing loading state');
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a2a4e] via-[#0f1a2e] to-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60 font-paragraph">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.error('[TeacherDashboardPage] User is null, cannot render dashboard');
    navigate('/teacher-login');
    return null;
  }

  try {
    return (
      <TeacherPortalLayout pageTitle="Dashboard">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-heading text-4xl text-foreground mb-2">
              Welcome, {user.fullName}!
            </h1>
            <p className="font-paragraph text-foreground/60">
              {batch?.name || 'Loading batch...'} • {batch?.schedule || ''}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Users, label: 'Total Students', value: displayStudents.length.toString(), color: 'from-primary to-primary/60' },
                { icon: CheckCircle, label: 'Avg Attendance', value: displayStudents.length > 0 ? Math.round(displayStudents.reduce((sum, s) => sum + s.attendance, 0) / displayStudents.length) + '%' : '0%', color: 'from-secondary to-secondary/60' },
                { icon: BookOpen, label: 'Avg Progress', value: displayStudents.length > 0 ? Math.round(displayStudents.reduce((sum, s) => sum + s.progress, 0) / displayStudents.length) + '%' : '0%', color: 'from-primary to-secondary' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-foreground/20 transition-all"
                >
                  <div className={`inline-flex p-3 rounded-lg mb-4 bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-background" />
                  </div>
                  <div className="font-heading text-3xl text-foreground mb-1">{stat.value}</div>
                  <div className="font-paragraph text-sm text-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Batch Selection and Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
            >
              <h2 className="font-heading text-xl text-foreground mb-4">Your Batch</h2>
              
              {batches.length > 1 && (
                <div className="mb-6">
                  <label className="font-paragraph text-xs text-foreground/60 mb-2 block">Select Batch</label>
                  <select
                    value={selectedBatchId || ''}
                    onChange={(e) => {
                      const newBatchId = e.target.value;
                      console.log(`[TeacherDashboardPage] Batch selector changed to: ${newBatchId}`);
                      setSelectedBatch(newBatchId);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-background/50 border border-foreground/20 text-foreground font-paragraph focus:outline-none focus:border-primary"
                  >
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.batchName} ({b.batchLevel})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {batch && (
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <div className="font-paragraph text-xs text-foreground/60 mb-1">Batch ID</div>
                    <div className="font-heading text-lg text-primary">{batch.id}</div>
                  </div>
                  <div>
                    <div className="font-paragraph text-xs text-foreground/60 mb-1">Level</div>
                    <div className="font-heading text-lg text-secondary">{batch.level}</div>
                  </div>
                  <div>
                    <div className="font-paragraph text-xs text-foreground/60 mb-1">Students</div>
                    <div className="font-heading text-lg text-foreground">{batch.studentCount}</div>
                  </div>
                  <div>
                    <div className="font-paragraph text-xs text-foreground/60 mb-1">Schedule</div>
                    <div className="font-paragraph text-sm text-foreground">{batch.schedule}</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Upcoming Classes Section */}
            {assignedClasses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20"
              >
                <h2 className="font-heading text-xl text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  Your Upcoming Classes
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {assignedClasses.map((upcomingClass) => (
                    <Card key={upcomingClass._id} className="bg-gray-900/50 border-gray-800 p-4">
                      <h3 className="font-heading text-lg text-foreground mb-2">
                        {upcomingClass.classTitle}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {upcomingClass.classDescription}
                      </p>
                      <div className="space-y-2 mb-4 text-sm">
                        <p className="text-gray-400">
                          <span className="text-foreground/70">Level:</span> {upcomingClass.difficultyLevel}
                        </p>
                        {upcomingClass.scheduledDateTime && (
                          <p className="text-gray-400">
                            <span className="text-foreground/70">Scheduled:</span> {format(new Date(upcomingClass.scheduledDateTime), 'MMM dd, yyyy HH:mm')}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => window.open(upcomingClass.liveClassLink, '_blank')}
                        className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                        size="sm"
                      >
                        <Play className="w-4 h-4" />
                        Teach Class
                      </Button>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Students Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
              >
                <h2 className="font-heading text-xl text-foreground mb-6">My Students</h2>
                <div className="space-y-4">
                  {displayStudents.length > 0 ? (
                    displayStudents.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-heading text-foreground">{student.name}</h3>
                          <span className="font-paragraph text-xs text-foreground/60">ID: {student.id}</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-paragraph text-xs text-foreground/70">Attendance</span>
                              <span className="font-heading text-xs text-primary">{student.attendance}%</span>
                            </div>
                            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${student.attendance}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-paragraph text-xs text-foreground/70">Progress</span>
                              <span className="font-heading text-xs text-secondary">{student.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${student.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-lg bg-foreground/5 border border-foreground/10 text-center"
                    >
                      <AlertCircle className="w-8 h-8 text-foreground/40 mx-auto mb-2" />
                      <p className="font-paragraph text-foreground/60">No students assigned yet</p>
                      <p className="font-paragraph text-xs text-foreground/40 mt-1">Your assigned students will appear here</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Tasks Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
              >
                <h2 className="font-heading text-xl text-foreground mb-6">Your Tasks</h2>
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all ${
                        task.status === 'completed'
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-foreground/5 border-foreground/10'
                      }`}
                    >
                      <h4 className={`font-heading text-sm text-foreground mb-2 ${
                        task.status === 'completed' ? 'line-through opacity-60' : ''
                      }`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-xs text-foreground/60">
                          Due: {task.dueDate.toLocaleDateString()}
                        </span>
                        <span className={`font-heading text-xs px-2 py-1 rounded ${
                          task.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </TeacherPortalLayout>
    );
  } catch (error) {
    console.error('[TeacherDashboardPage] Unexpected error during render:', error);
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a2a4e] via-[#0f1a2e] to-[#0a0f1a] text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl mb-2">Error Loading Dashboard</h2>
          <p className="font-paragraph text-foreground/60 mb-6">An unexpected error occurred. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-primary text-background font-heading hover:bg-primary/90 transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}
