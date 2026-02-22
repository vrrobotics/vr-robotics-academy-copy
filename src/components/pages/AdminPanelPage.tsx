import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, BookOpen, Award, Settings, BarChart3, Bell, FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { addCertificateExamples } from '@/services/certificateService';

export default function AdminPanelPage() {
  const [addingCerts, setAddingCerts] = useState(false);
  const [certMessage, setCertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const stats = [
    { label: 'Total Students', value: '1,234', icon: Users, change: '+12%' },
    { label: 'Active Modules', value: '18', icon: BookOpen, change: '+2' },
    { label: 'Certificates Issued', value: '456', icon: Award, change: '+34' },
    { label: 'Completion Rate', value: '87%', icon: BarChart3, change: '+5%' }
  ];

  const handleAddCertificates = async () => {
    setAddingCerts(true);
    setCertMessage(null);
    try {
      const result = await addCertificateExamples();
      setCertMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
      if (result.success) {
        setTimeout(() => {
          setCertMessage(null);
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setCertMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to add certificates'
      });
    } finally {
      setAddingCerts(false);
    }
  };

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
      <section className="relative py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <h1 className="font-heading text-5xl lg:text-6xl mb-2 text-primary"
                style={{
                  textShadow: '0 0 30px rgba(216, 255, 145, 0.4)'
                }}
              >
                Admin Panel
              </h1>
              <p className="font-paragraph text-xl text-foreground/80">
                Manage your VR Robotics Academy
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                className="p-3 rounded-xl bg-foreground/5 border border-foreground/10"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-6 h-6 text-foreground/70" />
              </motion.button>
              <motion.button
                className="p-3 rounded-xl bg-foreground/5 border border-foreground/10"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-6 h-6 text-foreground/70" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-paragraph text-sm text-secondary">{stat.change}</span>
                </div>
                <div className="font-heading text-3xl mb-1 text-foreground">{stat.value}</div>
                <div className="font-paragraph text-sm text-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 className="font-heading text-2xl mb-6 text-foreground">Quick Actions</h2>
              
              {certMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    certMessage.type === 'success'
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}
                >
                  {certMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`font-paragraph text-sm ${
                    certMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {certMessage.text}
                  </span>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  onClick={handleAddCertificates}
                  disabled={addingCerts}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: addingCerts ? 1 : 1.02, y: addingCerts ? 0 : -2 }}
                  whileTap={{ scale: addingCerts ? 1 : 0.98 }}
                  className="flex items-center gap-4 p-6 rounded-xl bg-primary/5 border border-primary/20 text-left hover:bg-primary/10 disabled:opacity-50 transition-colors"
                >
                  <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-heading text-lg text-foreground">
                    {addingCerts ? 'Adding Certificates...' : 'Add Professional Certificates'}
                  </span>
                </motion.button>

                {[
                  { icon: Users, label: 'Manage Students', color: 'primary' },
                  { icon: BookOpen, label: 'Edit Curriculum', color: 'secondary' },
                  { icon: FileText, label: 'View Reports', color: 'secondary' },
                  { icon: Bell, label: 'Send Notifications', color: 'primary' },
                  { icon: Shield, label: 'Security Settings', color: 'secondary' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 p-6 rounded-xl bg-${action.color}/5 border border-${action.color}/20 text-left`}
                  >
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-${action.color}/10`}>
                      <action.icon className={`w-6 h-6 text-${action.color}`} />
                    </div>
                    <span className="font-heading text-lg text-foreground">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h2 className="font-heading text-2xl mb-6 text-foreground">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'New student enrolled', time: '5 min ago' },
                  { action: 'Certificate issued', time: '1 hour ago' },
                  { action: 'Module completed', time: '2 hours ago' },
                  { action: 'Demo booked', time: '3 hours ago' },
                  { action: 'Feedback received', time: '5 hours ago' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-foreground/5 border border-foreground/10"
                  >
                    <div className="font-paragraph text-foreground/90">{activity.action}</div>
                    <div className="font-paragraph text-sm text-foreground/50 mt-1">{activity.time}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Placeholder Notice */}
      <section className="relative py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-3xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(216, 255, 145, 0.1), rgba(255, 211, 158, 0.1))',
              border: '1px solid rgba(216, 255, 145, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-heading text-4xl mb-6 text-foreground">
              Admin Panel - Coming Soon
            </h2>
            <p className="font-paragraph text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
              This is a placeholder for the admin panel. Full functionality including student management, 
              curriculum editing, analytics, and reporting will be available soon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </motion.button>
              <motion.button
                className="bg-transparent text-secondary border-2 border-secondary font-heading font-semibold px-8 py-4 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 211, 158, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
