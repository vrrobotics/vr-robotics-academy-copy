import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BatchManagementModal from '@/components/dashboard/BatchManagementModal';
import DemoSessionsManagement from '@/components/dashboard/DemoSessionsManagement';
import { BaseCrudService } from '@/integrations';
import { supabase } from '@/lib/supabase';
import { Batches, Meetings, UpcomingClasses, StudentApprovals } from '@/entities';
import { useBatchSync } from '@/hooks/useBatchSync';
import { Users, BookOpen, BarChart3, Settings, LogOut, Plus, Edit2, UserCheck, GraduationCap, Star, Play, Trash2, Calendar, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Batch {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface Analytics {
  totalStudents: number;
  totalTeachers: number;
  activeBatches: number;
  completionRate: number;
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  // Use batch sync hook for real-time synchronization
  const {
    batches,
    meetings,
    isLoading,
    isSyncing,
  } = useBatchSync(undefined, true);

  const [analytics] = useState({
    totalStudents: 18,
    totalTeachers: 4,
    activeBatches: 3,
    completionRate: 78
  });

  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    teacher: '',
    level: 'Beginner'
  });
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClasses[]>([]);
  const [studentApprovals, setStudentApprovals] = useState<StudentApprovals[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentApprovals | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const normalizeStudentApproval = (row: any): StudentApprovals => ({
    _id: row._id,
    fullName: row.fullname ?? row.fullName,
    email: row.email,
    phoneNumber: row.phonenumber ?? row.phoneNumber,
    age: row.age,
    gender: row.gender,
    submissionDate: row.submissiondate ?? row.submissionDate,
    status: row.status,
    approvalDate: row.approvaldate ?? row.approvalDate,
    approvedByAdmin: row.approvedbyadmin ?? row.approvedByAdmin,
    rejectionReason: row.rejectionreason ?? row.rejectionReason,
  });

  useEffect(() => {
    // Role check removed - allow all users to access admin dashboard
    if (!user) {
      navigate('/login');
    }
    
    // Load upcoming classes
    const loadUpcomingClasses = async () => {
      try {
        const { items } = await BaseCrudService.getAll<UpcomingClasses>('upcomingclasses');
        setUpcomingClasses(items);
      } catch (error) {
        console.error('Error loading upcoming classes:', error);
      }
    };

    // Load student approvals
    const loadStudentApprovals = async () => {
      try {
        const { data, error } = await supabase
          .from('studentapprovals')
          .select('*');
        if (error) throw error;
        setStudentApprovals((data || []).map(normalizeStudentApproval));
      } catch (error) {
        console.warn('Warning: Student approvals table not found. This is normal if database is not set up yet.');
        setStudentApprovals([]);
      }
    };
    
    loadUpcomingClasses();
    loadStudentApprovals();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleApproveStudent = async () => {
    if (!selectedStudent) return;

    try {
      const { error: updateError } = await supabase
        .from('studentapprovals')
        .update({
          status: 'approved',
          approvaldate: new Date().toISOString(),
          approvedbyadmin: user?.fullName || 'Admin',
        })
        .eq('_id', selectedStudent._id);
      if (updateError) throw updateError;

      setShowApproveDialog(false);
      setShowDetailModal(false);
      setSelectedStudent(null);
      
      // Reload student approvals
      const { data, error } = await supabase
        .from('studentapprovals')
        .select('*');
      if (error) throw error;
      setStudentApprovals((data || []).map(normalizeStudentApproval));
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  const handleRejectStudent = async () => {
    if (!selectedStudent || !rejectionReason.trim()) return;

    try {
      const { error: updateError } = await supabase
        .from('studentapprovals')
        .update({
          status: 'rejected',
          approvaldate: new Date().toISOString(),
          rejectionreason: rejectionReason,
          approvedbyadmin: user?.fullName || 'Admin',
        })
        .eq('_id', selectedStudent._id);
      if (updateError) throw updateError;

      setShowRejectDialog(false);
      setShowDetailModal(false);
      setSelectedStudent(null);
      setRejectionReason('');
      
      // Reload student approvals
      const { data, error } = await supabase
        .from('studentapprovals')
        .select('*');
      if (error) throw error;
      setStudentApprovals((data || []).map(normalizeStudentApproval));
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  const pendingStudents = studentApprovals.filter(s => s.status === 'pending');

  const handleCreateBatch = async () => {
    if (!newBatch.name || !newBatch.teacher) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await BaseCrudService.create('batches', {
        _id: `batch-${Date.now()}`,
        batchName: newBatch.name,
        batchLevel: newBatch.level,
        assignedTeacherName: newBatch.teacher,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        batchStatus: 'active'
      });
      
      // Reload batches via sync hook
      setNewBatch({ name: '', teacher: '', level: 'Beginner' });
      setShowCreateBatch(false);
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const handleBatchModalSubmit = async (batchData: any) => {
    try {
      await BaseCrudService.create('batches', {
        _id: `batch-${Date.now()}`,
        batchName: batchData.batchName,
        batchLevel: batchData.batchLevel,
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        batchStatus: batchData.batchStatus,
        assignedTeacherName: batchData.assignedTeacherName,
        assignedStudentName: batchData.assignedStudentName
      });
      setShowBatchModal(false);
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Circuit Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(216, 255, 145, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(216, 255, 145, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <section className="relative py-8 px-8 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-heading text-4xl text-primary mb-2"
              style={{
                textShadow: '0 0 30px rgba(216, 255, 145, 0.4)'
              }}
            >
              Admin Dashboard
            </h1>
            <p className="font-paragraph text-foreground/70">
              Welcome, {user.fullName} • Full System Control
            </p>
          </motion.div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-heading"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12 px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Analytics Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Total Students', value: analytics.totalStudents.toString(), color: 'primary' },
              { icon: Users, label: 'Total Teachers', value: analytics.totalTeachers.toString(), color: 'secondary' },
              { icon: BookOpen, label: 'Active Batches', value: analytics.activeBatches.toString(), color: 'primary' },
              { icon: BarChart3, label: 'Completion Rate', value: `${analytics.completionRate}%`, color: 'secondary' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 255, 145, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className="font-heading text-3xl text-foreground mb-1">{stat.value}</div>
                <div className="font-paragraph text-sm text-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Batch Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(216, 255, 145, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-foreground">Batch Management</h2>
              <motion.button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Create Batch
              </motion.button>
            </div>

            {/* Batch Management Modal */}
            <BatchManagementModal
              isOpen={showBatchModal}
              onClose={() => setShowBatchModal(false)}
              onSubmit={handleBatchModalSubmit}
            />

            {/* Batches List */}
            <div className="space-y-3">
              {batches.map((batch, index) => (
                <motion.div
                  key={batch._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-foreground/5 border border-foreground/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading text-foreground mb-2">{batch.batchName}</h3>
                      <div className="flex items-center gap-4 text-sm font-paragraph text-foreground/70">
                        <span>ID: {batch._id}</span>
                        <span>Teacher: {batch.assignedTeacherName}</span>
                        <span>Level: {batch.batchLevel}</span>
                        <span className={`px-2 py-1 rounded text-xs font-heading ${
                          batch.batchStatus === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : batch.batchStatus === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {batch.batchStatus}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(216, 255, 145, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-primary" />
              <h2 className="font-heading text-2xl text-foreground">System Settings</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'User Management', description: 'Manage students, teachers, and admins' },
                { title: 'Batch Configuration', description: 'Create and manage batch settings' },
                { title: 'Analytics & Reports', description: 'View system-wide analytics' },
                { title: 'System Logs', description: 'Monitor system activity and logs' }
              ].map((setting, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-primary/50 transition-colors text-left"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="font-heading text-foreground mb-2">{setting.title}</h3>
                  <p className="font-paragraph text-sm text-foreground/70">{setting.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* New Teachers Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <UserCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-foreground mb-2">New Teachers</h2>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Review and approve pending teacher applications
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate('/admin-new-teachers')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-heading text-sm hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserCheck className="w-4 h-4" />
                View Applications
              </motion.button>
            </div>
          </motion.div>

          {/* New Students Management */}
          {pendingStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl text-foreground mb-2">New Student Applications</h2>
                    <p className="font-paragraph text-sm text-foreground/70">
                      {pendingStudents.length} pending approval{pendingStudents.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => navigate('/admin-student-approvals')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-heading text-sm hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-4 h-4" />
                  View All
                </motion.button>
              </div>

              {/* Student Approvals List */}
              <div className="space-y-3">
                {pendingStudents.slice(0, 5).map((student, index) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-green-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading text-foreground mb-1">{student.fullName}</h3>
                        <div className="flex items-center gap-4 text-sm font-paragraph text-foreground/70">
                          <span>{student.email}</span>
                          <span>{student.phoneNumber}</span>
                          <span>Age: {student.age}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailModal(true);
                          }}
                          className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 font-heading text-sm hover:bg-green-500/30 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Review
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {pendingStudents.length > 5 && (
                <motion.button
                  onClick={() => navigate('/admin-student-approvals')}
                  className="mt-4 w-full py-2 rounded-lg border border-green-500/50 text-green-400 font-heading text-sm hover:bg-green-500/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All Applications ({pendingStudents.length})
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Course Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37 }}
            className="p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                  <GraduationCap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-foreground mb-2">Course Management</h2>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Create and manage courses, add content, and organize course materials
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate('/admin-add-courses')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-heading text-sm hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GraduationCap className="w-4 h-4" />
                Manage Courses
              </motion.button>
            </div>
          </motion.div>

          {/* Featured Courses Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.39 }}
            className="p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-foreground mb-2">Featured Courses</h2>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Select which courses appear on the home page featured section
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate('/admin-featured-courses')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500 text-white font-heading text-sm hover:bg-purple-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-4 h-4" />
                Manage Featured
              </motion.button>
            </div>
          </motion.div>

          {/* Demo Sessions Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.40 }}
          >
            <DemoSessionsManagement />
          </motion.div>

          {/* Upcoming Classes Section */}
          {upcomingClasses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.41 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-green-400" />
                  <h2 className="font-heading text-2xl text-foreground">Upcoming Classes</h2>
                </div>
                <motion.button
                  onClick={() => navigate('/admin-upcoming-classes')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-heading text-sm hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Create Class
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingClasses.slice(0, 6).map((upcomingClass, index) => (
                  <motion.div
                    key={upcomingClass._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-green-500/50 transition-colors"
                  >
                    <h3 className="font-heading text-foreground mb-2 line-clamp-1">
                      {upcomingClass.classTitle}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70 mb-3 line-clamp-2">
                      {upcomingClass.classDescription}
                    </p>
                    <div className="space-y-2 mb-4 text-xs font-paragraph text-foreground/60">
                      <div className="flex items-center justify-between">
                        <span>Level:</span>
                        <span className="text-foreground">{upcomingClass.difficultyLevel}</span>
                      </div>
                      {upcomingClass.scheduledDateTime && (
                        <div className="flex items-center justify-between">
                          <span>Scheduled:</span>
                          <span className="text-foreground">
                            {format(new Date(upcomingClass.scheduledDateTime), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Teacher:</span>
                        <span className="text-foreground">{upcomingClass.assignedTeacherName}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(upcomingClass.liveClassLink, '_blank')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 text-sm"
                      size="sm"
                    >
                      <Play className="w-3 h-3" />
                      View Class
                    </Button>
                  </motion.div>
                ))}
              </div>

              {upcomingClasses.length > 6 && (
                <motion.button
                  onClick={() => navigate('/admin-upcoming-classes')}
                  className="mt-6 w-full py-3 rounded-lg border border-green-500/50 text-green-400 font-heading hover:bg-green-500/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All Classes ({upcomingClasses.length})
                </motion.button>
              )}
            </motion.div>
          )}


        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-slate-800 border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-white font-heading">Student Application Details</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm">Full Name</Label>
                  <p className="text-white font-semibold">{selectedStudent.fullName}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Email</Label>
                  <p className="text-white font-semibold">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Phone</Label>
                  <p className="text-white font-semibold">{selectedStudent.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Age</Label>
                  <p className="text-white font-semibold">{selectedStudent.age}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Gender</Label>
                  <p className="text-white font-semibold capitalize">{selectedStudent.gender}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Status</Label>
                  <p className={`font-semibold capitalize ${selectedStudent.status === 'approved' ? 'text-green-400' : selectedStudent.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {selectedStudent.status}
                  </p>
                </div>
              </div>

              {selectedStudent.rejectionReason && (
                <div>
                  <Label className="text-gray-400 text-sm">Rejection Reason</Label>
                  <p className="text-red-400">{selectedStudent.rejectionReason}</p>
                </div>
              )}

              {selectedStudent.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowApproveDialog(true);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-heading text-sm transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowRejectDialog(true);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-heading text-sm transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-slate-800 border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Approve Student?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">
            Are you sure you want to approve {selectedStudent?.fullName}? They will receive login credentials and can access the student dashboard.
          </p>
          <DialogFooter>
            <motion.button
              onClick={() => setShowApproveDialog(false)}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 font-heading text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleApproveStudent}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-heading text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Approve
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-slate-800 border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Student Application</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason" className="text-white">
                Rejection Reason *
              </Label>
              <Textarea
                id="reason"
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-slate-700/50 border-orange-500/30 text-white placeholder:text-gray-400 mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <motion.button
              onClick={() => setShowRejectDialog(false)}
              className="px-4 py-2 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 font-heading text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleRejectStudent}
              disabled={!rejectionReason.trim()}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reject
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
