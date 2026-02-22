import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Check, X, Eye } from 'lucide-react';
import { StudentApprovals } from '@/entities';
import { supabase } from '@/lib/supabase';

export default function AdminStudentApprovalsPage() {
  const [students, setStudents] = useState<StudentApprovals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentApprovals | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('studentapprovals')
        .select('*');
      if (error) throw error;
      setStudents((data || []).map(normalizeStudentApproval));
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedStudent) return;

    try {
      const { error: updateError } = await supabase
        .from('studentapprovals')
        .update({
          status: 'approved',
          approvaldate: new Date().toISOString(),
          approvedbyadmin: 'Admin User',
        })
        .eq('_id', selectedStudent._id);
      if (updateError) throw updateError;

      setShowApproveDialog(false);
      setShowDetailModal(false);
      loadStudents();
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedStudent || !rejectionReason.trim()) return;

    try {
      const { error: updateError } = await supabase
        .from('studentapprovals')
        .update({
          status: 'rejected',
          approvaldate: new Date().toISOString(),
          rejectionreason: rejectionReason,
          approvedbyadmin: 'Admin User',
        })
        .eq('_id', selectedStudent._id);
      if (updateError) throw updateError;

      setShowRejectDialog(false);
      setShowDetailModal(false);
      setRejectionReason('');
      loadStudents();
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesSearch = student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-heading font-bold text-white">
              Student Approvals
            </h1>
            <p className="text-gray-300 font-paragraph">
              Review and approve student signup requests
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700/50 border-orange-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700/50 border-orange-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-orange-500/30">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 font-paragraph">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 font-paragraph">No students found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-slate-800/50 border-orange-500/20 p-6 hover:border-orange-500/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-heading font-semibold text-white">
                            {student.fullName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(student.status)}`}>
                            {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400 font-paragraph">
                          <p>Email: {student.email}</p>
                          <p>Phone: {student.phoneNumber}</p>
                          <p>Age: {student.age} | Gender: {student.gender}</p>
                          <p>Submitted: {student.submissionDate ? new Date(student.submissionDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailModal(true);
                          }}
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>

                        {student.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowApproveDialog(true);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowRejectDialog(true);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-slate-800 border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-white font-heading">Student Details</DialogTitle>
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
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowApproveDialog(true);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowRejectDialog(true);
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="bg-slate-800 border-orange-500/30">
          <AlertDialogTitle className="text-white">Approve Student?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to approve {selectedStudent?.fullName}? They will receive login credentials and can access the student dashboard.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              className="border-orange-500/30 text-orange-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              variant="destructive"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
