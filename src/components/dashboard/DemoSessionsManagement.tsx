import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { DemoSessions, Users } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, Clock, Users as UsersIcon, CheckCircle, XCircle, AlertCircle, Trash2, Eye } from 'lucide-react';
import { RoleService } from '@/services/roleService';

interface DemoSessionWithTeacher extends DemoSessions {
  teacherName?: string;
}

export default function DemoSessionsManagement() {
  const [sessions, setSessions] = useState<DemoSessionWithTeacher[]>([]);
  const [teachers, setTeachers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<DemoSessionWithTeacher | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [showBookingsList, setShowBookingsList] = useState(false);
  const [pendingBookings, setPendingBookings] = useState<DemoSessionWithTeacher[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load demo sessions
      const { items: sessionsData = [] } = await BaseCrudService.getAll<DemoSessions>('demosessions');
      const normalizedSessions = (sessionsData as any[]).map((session) => ({
        ...session,
        _id: session._id ?? session.id,
        teacherId: session.teacherId ?? session.teacherid,
        childName: session.childName ?? session.childname,
        childAge: session.childAge ?? session.childage,
        preferredDate: session.preferredDate ?? session.preferreddate,
        preferredTime: session.preferredTime ?? session.preferredtime,
        parentName: session.parentName ?? session.parentname,
        parentEmail: session.parentEmail ?? session.parentemail,
        parentPhone: session.parentPhone ?? session.parentphone
      }));
      
      // Load teachers
      const teachersData = await RoleService.getAllTeachers();
      setTeachers(teachersData);

      // Enrich sessions with teacher names
      const enrichedSessions = normalizedSessions.map(session => ({
        ...session,
        teacherName: teachersData.find(t => t._id === session.teacherId)?.fullName
      }));

      setSessions(enrichedSessions);
      
      // Filter pending bookings
      const pending = enrichedSessions.filter(s => s.status === 'pending');
      setPendingBookings(pending);
    } catch (err) {
      console.error('[DemoSessionsManagement] Error loading data:', err);
      setError('Failed to load demo sessions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBooking = async (sessionId: string) => {
    const booking = pendingBookings.find(b => b._id === sessionId);
    if (booking) {
      setSelectedSession(booking);
      setShowAssignModal(true);
    }
  };

  const handleRejectBooking = async (sessionId: string) => {
    if (confirm('Are you sure you want to reject this demo booking?')) {
      try {
        await BaseCrudService.update<DemoSessions>('demosessions', {
          _id: sessionId,
          status: 'rejected'
        });
        loadData();
        setShowBookingsList(false);
      } catch (err) {
        console.error('[DemoSessionsManagement] Error rejecting booking:', err);
        setError('Failed to reject booking.');
      }
    }
  };

  const handleApprove = async (sessionId: string) => {
    try {
      await BaseCrudService.update<DemoSessions>('demosessions', {
        _id: sessionId,
        status: 'approved'
      });
      loadData();
    } catch (err) {
      console.error('[DemoSessionsManagement] Error approving session:', err);
      setError('Failed to approve session.');
    }
  };

  const handleReject = async (sessionId: string) => {
    try {
      await BaseCrudService.update<DemoSessions>('demosessions', {
        _id: sessionId,
        status: 'rejected'
      });
      loadData();
    } catch (err) {
      console.error('[DemoSessionsManagement] Error rejecting session:', err);
      setError('Failed to reject session.');
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (confirm('Are you sure you want to delete this demo session?')) {
      try {
        await BaseCrudService.delete('demosessions', sessionId);
        loadData();
      } catch (err) {
        console.error('[DemoSessionsManagement] Error deleting session:', err);
        setError('Failed to delete session.');
      }
    }
  };

  const handleAssignTeacher = async () => {
    if (!selectedSession || !selectedTeacherId) return;

    setIsAssigning(true);
    try {
      await BaseCrudService.update<any>('demosessions', {
        _id: selectedSession._id,
        teacherid: selectedTeacherId,
        status: 'approved'
      });
      setShowAssignModal(false);
      setSelectedTeacherId('');
      loadData();
    } catch (err) {
      console.error('[DemoSessionsManagement] Error assigning teacher:', err);
      setError('Failed to assign teacher.');
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 border-red-500/40 text-red-400';
      case 'pending':
      default:
        return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400"
        >
          {error}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl text-foreground">Demo Sessions</h2>
        <div className="flex items-center gap-4">
          <span className="font-paragraph text-sm text-foreground/60">{sessions.length} total</span>
          <Button
            onClick={() => {
              setShowBookingsList(true);
              loadData();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            size="sm"
          >
            <Eye className="w-4 h-4" />
            View Bookings
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-paragraph text-foreground/60">No demo sessions yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 mb-1">Child Name</p>
                    <p className="font-heading text-lg text-foreground">{session.childName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Age</p>
                      <p className="font-paragraph text-foreground">{session.childAge} years</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-paragraph ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="capitalize">{session.status || 'pending'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-foreground/60 mb-1">Parent Contact</p>
                    <p className="font-paragraph text-sm text-foreground">{session.parentName}</p>
                    <p className="font-paragraph text-xs text-foreground/70">{session.parentEmail}</p>
                    <p className="font-paragraph text-xs text-foreground/70">{session.parentPhone}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date
                      </p>
                      <p className="font-paragraph text-foreground">
                        {session.preferredDate instanceof Date 
                          ? session.preferredDate.toLocaleDateString() 
                          : session.preferredDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time
                      </p>
                      <p className="font-paragraph text-foreground capitalize">{session.preferredTime}</p>
                    </div>
                  </div>
                  {session.interests && (
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Interests</p>
                      <p className="font-paragraph text-sm text-foreground">{session.interests}</p>
                    </div>
                  )}
                  {session.teacherName && (
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1 flex items-center gap-1">
                        <UsersIcon className="w-3 h-3" /> Assigned Teacher
                      </p>
                      <p className="font-paragraph text-foreground">{session.teacherName}</p>
                    </div>
                  )}
                  {session.message && (
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Message</p>
                      <p className="font-paragraph text-sm text-foreground/80 italic">\"{session.message}\"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-foreground/10 flex gap-3 flex-wrap">
                {session.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowAssignModal(true);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      Assign Teacher
                    </Button>
                    <Button
                      onClick={() => handleReject(session._id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
                      size="sm"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {session.status === 'approved' && (
                  <Button
                    onClick={() => {
                      setSelectedSession(session);
                      setShowAssignModal(true);
                    }}
                    className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/40"
                    size="sm"
                  >
                    Reassign Teacher
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(session._id)}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Assign Teacher Modal */}
      {showAssignModal && selectedSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAssignModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl text-foreground mb-4">Assign Teacher</h3>
            <p className="font-paragraph text-sm text-foreground/70 mb-4">
              Assigning teacher for {selectedSession.childName}'s demo session
            </p>

            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-foreground/10 border border-foreground/20 text-foreground font-paragraph mb-6 focus:outline-none focus:border-primary"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTeacherId('');
                }}
                className="flex-1 bg-foreground/10 text-foreground hover:bg-foreground/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignTeacher}
                disabled={!selectedTeacherId || isAssigning}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isAssigning ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* View Bookings Modal */}
      {showBookingsList && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingsList(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background border border-foreground/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-2xl text-foreground mb-6">Demo Booking Requests</h3>
            
            {pendingBookings.length === 0 ? (
              <p className="font-paragraph text-foreground/60 text-center py-8">No pending demo bookings</p>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border border-foreground/10 bg-foreground/5"
                  >
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60 mb-1">Parent Name</p>
                        <p className="font-heading text-foreground">{booking.parentName}</p>
                        <p className="font-paragraph text-xs text-foreground/70">{booking.parentEmail}</p>
                        <p className="font-paragraph text-xs text-foreground/70">{booking.parentPhone}</p>
                      </div>
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60 mb-1">Child Name</p>
                        <p className="font-heading text-foreground">{booking.childName}</p>
                        <p className="font-paragraph text-xs text-foreground/70">Age: {booking.childAge} years</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Preferred Date
                        </p>
                        <p className="font-paragraph text-foreground">
                          {booking.preferredDate instanceof Date 
                            ? booking.preferredDate.toLocaleDateString() 
                            : booking.preferredDate}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-xs text-foreground/60 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Preferred Time
                        </p>
                        <p className="font-paragraph text-foreground capitalize">{booking.preferredTime}</p>
                      </div>
                    </div>

                    {booking.interests && (
                      <div className="mb-4">
                        <p className="font-paragraph text-xs text-foreground/60 mb-1">Interests</p>
                        <p className="font-paragraph text-sm text-foreground">{booking.interests}</p>
                      </div>
                    )}

                    {booking.message && (
                      <div className="mb-4">
                        <p className="font-paragraph text-xs text-foreground/60 mb-1">Message</p>
                        <p className="font-paragraph text-sm text-foreground/80 italic">\"{booking.message}\"</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-foreground/10">
                      <Button
                        onClick={() => handleAcceptBooking(booking._id)}
                        className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/40"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectBooking(booking._id)}
                        className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-foreground/10">
              <Button
                onClick={() => setShowBookingsList(false)}
                className="w-full bg-foreground/10 text-foreground hover:bg-foreground/20"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
