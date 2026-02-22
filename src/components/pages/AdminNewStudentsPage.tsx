import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, CheckCircle, XCircle, Mail, Phone, User, Calendar } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { StudentApprovalService } from '@/services/studentApprovalService';
import { StudentApprovals } from '@/entities';

interface StudentApprovalRecord extends StudentApprovals {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  gender?: string;
  submissionDate?: Date | string;
  status?: string;
  approvalDate?: Date | string;
  approvedByAdmin?: string;
  rejectionReason?: string;
}

export default function AdminNewStudentsPage() {
  const [applications, setApplications] = useState<StudentApprovalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<StudentApprovalRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      console.log('[AdminNewStudentsPage] Loading student applications...');
      
      const { items } = await BaseCrudService.getAll<StudentApprovalRecord>('studentapprovals');
      console.log('[AdminNewStudentsPage] Loaded applications:', items.length);
      
      setApplications(items || []);
    } catch (error) {
      console.error('[AdminNewStudentsPage] Error loading applications:', error);
      setErrorMessage('Failed to load student applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (application: StudentApprovalRecord) => {
    if (!application.email) return;

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('[AdminNewStudentsPage] Approving student:', application.email);

      await StudentApprovalService.approveStudent(application.email, 'admin');

      setSuccessMessage(`✓ ${application.fullName} has been approved and can now log in!`);
      
      setTimeout(() => {
        loadApplications();
        setSelectedApplication(null);
      }, 1500);
    } catch (error) {
      console.error('[AdminNewStudentsPage] Error approving student:', error);
      setErrorMessage('Failed to approve student. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (application: StudentApprovalRecord) => {
    if (!application.email) {
      setErrorMessage('Unable to process rejection');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('[AdminNewStudentsPage] Rejecting and deleting student record:', application.email);

      await StudentApprovalService.rejectStudent(application.email, 'Rejected by admin', 'admin');

      setSuccessMessage(`✓ ${application.fullName}'s record has been permanently deleted.`);
      
      setTimeout(() => {
        loadApplications();
        setSelectedApplication(null);
      }, 1500);
    } catch (error) {
      console.error('[AdminNewStudentsPage] Error rejecting student:', error);
      setErrorMessage('Failed to reject student. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === 'pending';
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 border-red-500/40 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Loader className="w-4 h-4 animate-spin" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-background to-background/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-foreground mb-4">
            New Students
          </h1>
          <p className="font-paragraph text-lg text-foreground/70">
            Review and manage student applications
          </p>
        </motion.div>

        {/* Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 font-paragraph"
          >
            {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-paragraph"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {(['all', 'pending'] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-heading text-sm capitalize transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f === 'all' ? 'All Applications' : 'Pending'}
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-paragraph text-lg text-foreground/50">
              No {filter === 'pending' ? 'pending' : ''} applications found
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications List */}
            <div className="lg:col-span-1">
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredApplications.map((app, idx) => (
                  <motion.button
                    key={app._id}
                    onClick={() => setSelectedApplication(app)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedApplication?._id === app._id
                        ? 'bg-primary/20 border-primary/50'
                        : 'bg-foreground/5 border-foreground/10 hover:bg-foreground/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold text-foreground truncate">
                          {app.fullName || 'Unknown'}
                        </p>
                        <p className="font-paragraph text-xs text-foreground/60 truncate">
                          {app.email}
                        </p>
                      </div>
                      <div className={`flex-shrink-0 px-2 py-1 rounded border text-xs font-heading flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status || 'pending'}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Details Panel */}
            {selectedApplication ? (
              <motion.div
                key={selectedApplication._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Header */}
                <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                        {selectedApplication.fullName}
                      </h2>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-heading text-sm ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        <span className="capitalize">{selectedApplication.status || 'pending'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60">Email</p>
                        <p className="font-paragraph text-sm text-foreground break-all">
                          {selectedApplication.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60">Phone</p>
                        <p className="font-paragraph text-sm text-foreground">
                          {selectedApplication.phoneNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60">Age</p>
                        <p className="font-paragraph text-sm text-foreground">
                          {selectedApplication.age || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60">Gender</p>
                        <p className="font-paragraph text-sm text-foreground">
                          {selectedApplication.gender || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Submission Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60">Submitted On</p>
                        <p className="font-paragraph text-sm text-foreground">
                          {selectedApplication.submissionDate
                            ? new Date(selectedApplication.submissionDate).toLocaleString()
                            : 'Not available'}
                        </p>
                      </div>
                    </div>
                    {selectedApplication.approvalDate && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="font-paragraph text-xs text-foreground/60">Approved On</p>
                          <p className="font-paragraph text-sm text-foreground">
                            {new Date(selectedApplication.approvalDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedApplication.status === 'pending' && (
                  <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Actions
                    </h3>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleApprove(selectedApplication)}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-heading text-sm transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Approve & Grant Access
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleReject(selectedApplication)}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-heading text-sm transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Reject & Delete
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}

                {selectedApplication.status === 'approved' && (
                  <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="font-paragraph text-sm text-green-400">
                      ✓ This application has been approved and the student can now log in with their email.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-2 flex items-center justify-center rounded-lg bg-foreground/5 border border-foreground/10 min-h-[400px]"
              >
                <p className="font-paragraph text-lg text-foreground/50">
                  Select an application to view details
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
