import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

interface PayoutRecord {
  id: string;
  month: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing';
  date: string;
}

export default function TeacherPayoutPage() {
  const [payouts] = useState<PayoutRecord[]>([
    { id: '1', month: 'November 2024', amount: 2500, status: 'completed', date: '2024-11-30' },
    { id: '2', month: 'October 2024', amount: 2500, status: 'completed', date: '2024-10-31' },
    { id: '3', month: 'September 2024', amount: 2300, status: 'completed', date: '2024-09-30' },
    { id: '4', month: 'December 2024', amount: 2750, status: 'processing', date: 'In Progress' }
  ]);

  return (
    <TeacherPortalLayout pageTitle="Payout">
      <div className="space-y-6">
        {/* Payout Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Total Earned</p>
                <p className="font-heading text-3xl text-foreground">$9,550</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary/60" />
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
                <p className="font-paragraph text-sm text-foreground/60 mb-1">This Month</p>
                <p className="font-heading text-3xl text-foreground">$2,750</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/60" />
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
                <p className="font-paragraph text-sm text-foreground/60 mb-1">Pending</p>
                <p className="font-heading text-3xl text-foreground">$2,750</p>
              </div>
              <Calendar className="w-8 h-8 text-primary/60" />
            </div>
          </motion.div>
        </div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="font-heading text-2xl text-foreground">Payout History</h3>
          
          {payouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-heading text-lg text-foreground">{payout.month}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-paragraph border ${
                      payout.status === 'completed'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : payout.status === 'processing'
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                    }`}>
                      {payout.status === 'completed' ? 'Completed' : payout.status === 'processing' ? 'Processing' : 'Pending'}
                    </span>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/60">{payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-2xl text-foreground mb-2">${payout.amount}</p>
                  {payout.status === 'completed' && (
                    <button className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-xs flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Invoice
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bank Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6">Bank Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Account Holder</p>
              <p className="font-paragraph text-foreground">Sarah Williams</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Bank Name</p>
              <p className="font-paragraph text-foreground">First National Bank</p>
            </div>
            <div>
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Account Number</p>
              <p className="font-paragraph text-foreground">****1234</p>
            </div>
            <button className="mt-4 px-6 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph text-sm">
              Update Bank Details
            </button>
          </div>
        </motion.div>
      </div>
    </TeacherPortalLayout>
  );
}
