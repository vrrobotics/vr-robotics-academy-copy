import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
  reason: string;
}

export default function TeacherLeaveManagementPage() {
  const [leaves] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'Sick Leave',
      startDate: '2024-12-05',
      endDate: '2024-12-06',
      days: 2,
      status: 'approved',
      reason: 'Medical appointment'
    },
    {
      id: '2',
      type: 'Vacation',
      startDate: '2024-12-20',
      endDate: '2024-12-27',
      days: 8,
      status: 'pending',
      reason: 'Holiday vacation'
    },
    {
      id: '3',
      type: 'Personal Leave',
      startDate: '2024-11-15',
      endDate: '2024-11-15',
      days: 1,
      status: 'approved',
      reason: 'Family event'
    }
  ]);

  const [leaveBalance] = useState({
    sick: 8,
    vacation: 12,
    personal: 5,
    total: 25
  });

  return (
    <TeacherPortalLayout pageTitle="Leave Management">
      <div className="space-y-6">
        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <p className="font-paragraph text-sm text-foreground/60 mb-2">Total Balance</p>
            <p className="font-heading text-3xl text-foreground">{leaveBalance.total}</p>
            <p className="font-paragraph text-xs text-foreground/50 mt-1">days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <p className="font-paragraph text-sm text-foreground/60 mb-2">Sick Leave</p>
            <p className="font-heading text-3xl text-foreground">{leaveBalance.sick}</p>
            <p className="font-paragraph text-xs text-foreground/50 mt-1">days remaining</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <p className="font-paragraph text-sm text-foreground/60 mb-2">Vacation</p>
            <p className="font-heading text-3xl text-foreground">{leaveBalance.vacation}</p>
            <p className="font-paragraph text-xs text-foreground/50 mt-1">days remaining</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <p className="font-paragraph text-sm text-foreground/60 mb-2">Personal</p>
            <p className="font-heading text-3xl text-foreground">{leaveBalance.personal}</p>
            <p className="font-paragraph text-xs text-foreground/50 mt-1">days remaining</p>
          </motion.div>
        </div>

        {/* Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="font-heading text-2xl text-foreground">Leave Requests</h3>
          
          {leaves.map((leave, index) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-heading text-lg text-foreground">{leave.type}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-paragraph border flex items-center gap-1 ${
                      leave.status === 'approved'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : leave.status === 'pending'
                        ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                        : 'bg-red-500/20 border-red-500/40 text-red-400'
                    }`}>
                      {leave.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {leave.status === 'pending' && <Clock className="w-3 h-3" />}
                      {leave.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                  <p className="font-paragraph text-foreground/70 mb-2">{leave.reason}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-foreground/60">
                      <Calendar className="w-4 h-4" />
                      <span className="font-paragraph">{leave.startDate} to {leave.endDate}</span>
                    </div>
                    <div className="font-paragraph text-foreground/60">
                      <span className="font-medium text-foreground">{leave.days}</span> days
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Request Leave Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full px-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph font-medium"
        >
          Request New Leave
        </motion.button>
      </div>
    </TeacherPortalLayout>
  );
}
