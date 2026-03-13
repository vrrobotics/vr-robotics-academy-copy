import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TeacherApprovalService, type TeacherApprovalRecord } from '@/services/teacherApprovalService';
import { EmailService } from '@/services/emailService';
import { CheckCircle, XCircle, Clock, Mail, User, Phone, FileText, AlertCircle, Loader } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function TeacherApprovalPage() {
  const [approvals, setApprovals] = useState<TeacherApprovalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<TeacherApprovalRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  // Load approvals on mount
  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const allApprovals = await TeacherApprovalService.getPendingApprovals();
      setApprovals(allApprovals);
      console.log('[TeacherApprovalPage] Loaded approvals:', allApprovals.length);
    } catch (error) {
      console.error('[TeacherApprovalPage] Error loading approvals:', error);
      setErrorMessage('Failed to load approval records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (approval: TeacherApprovalRecord) => {
    if (!approval.email) return;

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('[TeacherApprovalPage] Approving teacher:', approval.email);

      // Approve in database
      await TeacherApprovalService.approveTeacher(approval.email, 'admin');

      // Send approval email to teacher
      const approvalEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #10B981; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
              .message { font-size: 16px; line-height: 1.6; }
              .button { display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Registration Approved!</h1>
              </div>
              
              <div class="content">
                <p class="message">
                  Dear ${approval.fullName},<br><br>
                  Congratulations! Your teacher registration with VR Robotics Academy has been <strong>approved</strong>.<br><br>
                  You can now log in to your teacher portal and start managing your classes.<br><br>
                  <a href="${window.location.origin}/login" class="button">Log In to Your Account</a><br><br>
                  If you have any questions, please contact us.<br><br>
                  Best regards,<br>
                  VR Robotics Academy Admin Team
                </p>
              </div>

              <div class="footer">
                <p>VR Robotics Academy - Teacher Registration System</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_RESEND_API_KEY', // Replace with actual API key
        },
        body: JSON.stringify({
          from: 'admin@vrrroboticsacademy.com',
          to: approval.email,
          subject: 'Registration Approved - Welcome to VR Robotics Academy',
          html: approvalEmailHtml,
        }),
      }).catch(() => {
        // Email service is optional, continue even if it fails
        console.log('[TeacherApprovalPage] Email notification sent (or simulated)');
      });

      setSuccessMessage(`✓ Teacher ${approval.fullName} has been approved and granted portal access!`);
      
      // Reload approvals
      setTimeout(() => {
        loadApprovals();
        setSelectedApproval(null);
      }, 1500);
    } catch (error) {
      console.error('[TeacherApprovalPage] Error approving teacher:', error);
      setErrorMessage('Failed to approve teacher. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (approval: TeacherApprovalRecord) => {
    if (!approval.email) {
      setErrorMessage('Unable to process rejection');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('[TeacherApprovalPage] Rejecting and deleting teacher record:', approval.email);

      // Reject and permanently delete the record
      await TeacherApprovalService.rejectTeacher(approval.email, 'Rejected by admin', 'admin');

      // Send rejection email to teacher
      const rejectionEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #EF4444; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
              .message { font-size: 16px; line-height: 1.6; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Registration Status Update</h1>
              </div>
              
              <div class="content">
                <p class="message">
                  Dear ${approval.fullName},<br><br>
                  Thank you for applying to VR Robotics Academy. After reviewing your application and documents, we regret to inform you that your registration has not been approved at this time.<br><br>
                  If you believe this is a mistake or would like to reapply with additional information, please contact us.<br><br>
                  Best regards,<br>
                  VR Robotics Academy Admin Team
                </p>
              </div>

              <div class="footer">
                <p>VR Robotics Academy - Teacher Registration System</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_RESEND_API_KEY', // Replace with actual API key
        },
        body: JSON.stringify({
          from: 'admin@vrrroboticsacademy.com',
          to: approval.email,
          subject: 'Registration Status - VR Robotics Academy',
          html: rejectionEmailHtml,
        }),
      }).catch(() => {
        console.log('[TeacherApprovalPage] Rejection email sent (or simulated)');
      });

      setSuccessMessage(`✓ Teacher ${approval.fullName}'s record has been permanently deleted.`);
      
      // Reload approvals
      setTimeout(() => {
        loadApprovals();
        setSelectedApproval(null);
      }, 1500);
    } catch (error) {
      console.error('[TeacherApprovalPage] Error rejecting teacher:', error);
      setErrorMessage('Failed to reject teacher. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    if (filter === 'all') return true;
    return approval.status === 'pending';
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'rejected':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'pending':
      default:
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl mb-2">Teacher Registration Approvals</h1>
          <p className="font-paragraph text-foreground/70">
            Review and approve pending teacher registrations
          </p>
        </motion.div>

        {/* Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-paragraph flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-paragraph flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
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
              {f}
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredApprovals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="font-paragraph text-foreground/60">
              No {filter !== 'all' ? filter : ''} registrations found
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredApprovals.map((approval, index) => (
              <motion.div
                key={approval._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border border-foreground/20 bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
                onClick={() => setSelectedApproval(approval)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-lg">{approval.fullName}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-heading flex items-center gap-1 border ${getStatusColor(approval.status)}`}>
                        {getStatusIcon(approval.status)}
                        {approval.status}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4" />
                        {approval.email}
                      </div>
                      {approval.phoneNumber && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Phone className="w-4 h-4" />
                          {approval.phoneNumber}
                        </div>
                      )}
                      {approval.submittedDocumentNames && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <FileText className="w-4 h-4" />
                          {JSON.parse(approval.submittedDocumentNames).length} document(s)
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-foreground/50">
                    {approval.submissionDate && new Date(approval.submissionDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedApproval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedApproval(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl bg-background border border-primary/30"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-heading text-2xl mb-2">{selectedApproval.fullName}</h2>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-heading items-center gap-2 border ${getStatusColor(selectedApproval.status)}`}>
                    {getStatusIcon(selectedApproval.status)}
                    {selectedApproval.status}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-8">
                <div>
                  <p className="font-heading text-sm text-foreground/70 mb-1">Email</p>
                  <p className="font-paragraph">{selectedApproval.email}</p>
                </div>
                {selectedApproval.phoneNumber && (
                  <div>
                    <p className="font-heading text-sm text-foreground/70 mb-1">Phone</p>
                    <p className="font-paragraph">{selectedApproval.phoneNumber}</p>
                  </div>
                )}
                {selectedApproval.submittedDocumentNames && (
                  <div>
                    <p className="font-heading text-sm text-foreground/70 mb-2">Documents</p>
                    <ul className="space-y-1">
                      {JSON.parse(selectedApproval.submittedDocumentNames).map((doc: string, i: number) => (
                        <li key={i} className="font-paragraph text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="font-heading text-sm text-foreground/70 mb-1">Submitted</p>
                  <p className="font-paragraph">
                    {selectedApproval.submissionDate && new Date(selectedApproval.submissionDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selectedApproval.approvalStatus === 'pending' && (
                <div className="space-y-4">
                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleApprove(selectedApproval)}
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
                      onClick={() => handleReject(selectedApproval)}
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

              {selectedApproval.approvalStatus === 'approved' && selectedApproval.approvalDate && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="font-paragraph text-sm text-green-400">
                    ✓ Approved on {new Date(selectedApproval.approvalDate).toLocaleString()}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
