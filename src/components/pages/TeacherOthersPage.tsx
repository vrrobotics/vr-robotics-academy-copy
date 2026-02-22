import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, FileText } from 'lucide-react';
import TeacherPortalLayout from './TeacherPortalLayout';

export default function TeacherOthersPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    weeklyReport: true,
    twoFactorAuth: false
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <TeacherPortalLayout pageTitle="Others">
      <div className="space-y-6">
        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary" />
            <h3 className="font-heading text-2xl text-foreground">Preferences</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <div>
                <p className="font-paragraph font-medium text-foreground">Email Notifications</p>
                <p className="font-paragraph text-sm text-foreground/60">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.emailNotifications ? 'bg-primary' : 'bg-foreground/20'
                }`}
              >
                <motion.div
                  animate={{ x: settings.emailNotifications ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <div>
                <p className="font-paragraph font-medium text-foreground">SMS Notifications</p>
                <p className="font-paragraph text-sm text-foreground/60">Receive urgent updates via SMS</p>
              </div>
              <button
                onClick={() => handleToggle('smsNotifications')}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.smsNotifications ? 'bg-primary' : 'bg-foreground/20'
                }`}
              >
                <motion.div
                  animate={{ x: settings.smsNotifications ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <div>
                <p className="font-paragraph font-medium text-foreground">Weekly Report</p>
                <p className="font-paragraph text-sm text-foreground/60">Get weekly performance summary</p>
              </div>
              <button
                onClick={() => handleToggle('weeklyReport')}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.weeklyReport ? 'bg-primary' : 'bg-foreground/20'
                }`}
              >
                <motion.div
                  animate={{ x: settings.weeklyReport ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <div>
                <p className="font-paragraph font-medium text-foreground">Two-Factor Authentication</p>
                <p className="font-paragraph text-sm text-foreground/60">Enhanced security for your account</p>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.twoFactorAuth ? 'bg-primary' : 'bg-foreground/20'
                }`}
              >
                <motion.div
                  animate={{ x: settings.twoFactorAuth ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-primary" />
            <h3 className="font-heading text-2xl text-foreground">Security</h3>
          </div>

          <div className="space-y-3">
            <button className="w-full p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-left">
              <p className="font-paragraph font-medium text-foreground mb-1">Change Password</p>
              <p className="font-paragraph text-sm text-foreground/60">Update your password regularly</p>
            </button>
            <button className="w-full p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-left">
              <p className="font-paragraph font-medium text-foreground mb-1">Active Sessions</p>
              <p className="font-paragraph text-sm text-foreground/60">Manage your active login sessions</p>
            </button>
            <button className="w-full p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-left">
              <p className="font-paragraph font-medium text-foreground mb-1">Login History</p>
              <p className="font-paragraph text-sm text-foreground/60">View your recent login activity</p>
            </button>
          </div>
        </motion.div>

        {/* Documents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="font-heading text-2xl text-foreground">Documents</h3>
          </div>

          <div className="space-y-3">
            <button className="w-full p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-left">
              <p className="font-paragraph font-medium text-foreground mb-1">Download Contract</p>
              <p className="font-paragraph text-sm text-foreground/60">Get your employment contract</p>
            </button>
            <button className="w-full p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-left">
              <p className="font-paragraph font-medium text-foreground mb-1">Tax Documents</p>
              <p className="font-paragraph text-sm text-foreground/60">Access your tax-related documents</p>
            </button>
            <button className="w-full p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-left">
              <p className="font-paragraph font-medium text-foreground mb-1">Policies & Guidelines</p>
              <p className="font-paragraph text-sm text-foreground/60">Review company policies</p>
            </button>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10"
        >
          <h3 className="font-heading text-2xl text-foreground mb-6">Need Help?</h3>
          
          <div className="space-y-3">
            <button className="w-full px-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all duration-300 font-paragraph font-medium">
              Contact Support
            </button>
            <button className="w-full px-6 py-3 rounded-lg bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20 transition-all duration-300 font-paragraph font-medium">
              View FAQ
            </button>
          </div>
        </motion.div>
      </div>
    </TeacherPortalLayout>
  );
}
