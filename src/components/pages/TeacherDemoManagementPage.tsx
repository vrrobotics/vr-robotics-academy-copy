import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { DemoSessions } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import TeacherPortalLayout from './TeacherPortalLayout';
import { useRole } from '@/hooks/useRole';

interface DemoSession extends DemoSessions {
  title?: string;
  duration?: number;
}

export default function TeacherDemoManagementPage() {
  const { currentRole, userId } = useRole();
  const [demos, setDemos] = useState<DemoSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDemos();
  }, [userId]);

  const loadDemos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        setError('User ID not found');
        return;
      }

      // Load demo sessions assigned to this teacher
      const { items: sessionsData = [] } = await BaseCrudService.getAll<DemoSessions>('demosessions');
      const normalizedSessions = (sessionsData as any[]).map((session) => ({
        ...session,
        _id: session._id ?? session.id,
        teacherId: session.teacherId ?? session.teacherid,
        childName: session.childName ?? session.childname,
        childAge: session.childAge ?? session.childage,
        preferredDate: session.preferredDate ?? session.preferreddate,
        preferredTime: session.preferredTime ?? session.preferredtime,
        parentName: session.parentName ?? session.parentname
      }));
      
      // Filter sessions assigned to this teacher
      const assignedSessions = normalizedSessions.filter(session => session.teacherId === userId && session.status === 'approved');
      
      // Transform to DemoSession format
      const transformedSessions: DemoSession[] = assignedSessions.map(session => ({
        ...session,
        _id: session._id,
        title: `Demo for ${session.childName}`,
        duration: 60
      }));

      setDemos(transformedSessions);
    } catch (err) {
      console.error('[TeacherDemoManagement] Error loading demos:', err);
      setError('Failed to load demo sessions');
    } finally {
      setIsLoading(false);
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
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <TeacherPortalLayout pageTitle="Demo Management">
      <div className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400"
          >
            {error}
          </motion.div>
        )}

        {!isLoading && (
          <>
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60 mb-1">Assigned Demos</p>
                    <p className="font-heading text-3xl text-foreground">{demos.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary/60" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60 mb-1">Total Students</p>
                    <p className="font-heading text-3xl text-foreground">{demos.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary/60" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/60 mb-1">Status</p>
                    <p className="font-heading text-3xl text-foreground">Approved</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-primary/60" />
                </div>
              </motion.div>
            </div>

            {/* Demos List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="font-heading text-2xl text-foreground">Your Assigned Demo Sessions</h3>
              
              {demos.length === 0 ? (
                <div className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 text-center">
                  <p className="font-paragraph text-foreground/60">No demo sessions assigned yet</p>
                </div>
              ) : (
                demos.map((demo, index) => (
                  <motion.div
                    key={demo._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-heading text-lg text-foreground">{demo.title}</h4>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-paragraph ${getStatusColor(demo.status)}`}>
                            {getStatusIcon(demo.status)}
                            {demo.status ? demo.status.charAt(0).toUpperCase() + demo.status.slice(1) : 'Pending'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <p className="font-paragraph text-sm text-foreground/70">
                            <strong>Child:</strong> {demo.childName}, Age {demo.childAge}
                          </p>
                          {demo.interests && (
                            <p className="font-paragraph text-sm text-foreground/70">
                              <strong>Interests:</strong> {demo.interests}
                            </p>
                          )}
                          {demo.message && (
                            <p className="font-paragraph text-sm text-foreground/70">
                              <strong>Message:</strong> {demo.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-foreground/60">
                            <Calendar className="w-4 h-4" />
                            <span className="font-paragraph">
                              {demo.preferredDate instanceof Date 
                                ? demo.preferredDate.toLocaleDateString() 
                                : demo.preferredDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground/60">
                            <Clock className="w-4 h-4" />
                            <span className="font-paragraph capitalize">{demo.preferredTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground/60">
                            <Users className="w-4 h-4" />
                            <span className="font-paragraph">{demo.parentName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </>
        )}
      </div>
    </TeacherPortalLayout>
  );
}
