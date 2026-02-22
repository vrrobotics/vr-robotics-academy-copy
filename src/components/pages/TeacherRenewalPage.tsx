import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

export default function TeacherRenewalPage() {
  const [renewalStatus] = useState({
    currentExpiry: '2024-12-31',
    daysRemaining: 22,
    status: 'active',
    lastRenewal: '2023-12-31'
  });

  return (
    <TeacherPortalLayout pageTitle="Renewal">
      <div className="space-y-6">
        {/* Renewal Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-heading text-2xl text-foreground mb-2">Certification Status</h3>
              <p className="font-paragraph text-foreground/60">Your teaching certification details</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Current Status</p>
              <p className="font-heading text-2xl text-green-400">Active</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Expiry Date</p>
              <p className="font-heading text-2xl text-foreground">{renewalStatus.currentExpiry}</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Days Remaining</p>
              <p className="font-heading text-2xl text-primary">{renewalStatus.daysRemaining} days</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Last Renewal</p>
              <p className="font-heading text-2xl text-foreground">{renewalStatus.lastRenewal}</p>
            </div>
          </div>
        </motion.div>

        {/* Renewal Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6">Renewal Timeline</h3>
          
          <div className="space-y-4">
            {[
              { step: 1, title: 'Submit Application', date: 'By Nov 30, 2024', status: 'completed' },
              { step: 2, title: 'Document Verification', date: 'Dec 1-15, 2024', status: 'in-progress' },
              { step: 3, title: 'Final Approval', date: 'By Dec 25, 2024', status: 'pending' },
              { step: 4, title: 'Renewal Complete', date: 'Jan 1, 2025', status: 'pending' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold ${
                    item.status === 'completed'
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                      : item.status === 'in-progress'
                      ? 'bg-primary/20 border border-primary/40 text-primary'
                      : 'bg-foreground/10 border border-foreground/20 text-foreground/60'
                  }`}>
                    {item.step}
                  </div>
                  {index < 3 && <div className="w-1 h-12 bg-foreground/20 mt-2" />}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-heading text-lg text-foreground">{item.title}</p>
                  <p className="font-paragraph text-sm text-foreground/60">{item.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Renewal Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6">Required Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full p-4 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-left">
              <p className="font-medium mb-1">View Renewal Requirements</p>
              <p className="text-sm text-primary/70">Check all documents needed for renewal</p>
            </button>
            <button className="w-full p-4 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-left">
              <p className="font-medium mb-1">Upload Documents</p>
              <p className="text-sm text-primary/70">Submit required certification documents</p>
            </button>
            <button className="w-full p-4 rounded-lg bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-300 font-paragraph text-left">
              <p className="font-medium mb-1">Contact Support</p>
              <p className="text-sm text-foreground/60">Get help with renewal process</p>
            </button>
          </div>
        </motion.div>
      </div>
    </TeacherPortalLayout>
  );
}
