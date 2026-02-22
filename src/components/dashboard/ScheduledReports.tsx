import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2, Edit2, Mail } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  type: 'batch' | 'student' | 'system';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun: Date;
  lastRun?: Date;
  isActive: boolean;
}

export default function ScheduledReports() {
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Weekly Class Report',
      type: 'batch',
      frequency: 'weekly',
      recipients: ['teacher@example.com'],
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lastRun: new Date(),
      isActive: true
    },
    {
      id: '2',
      name: 'Monthly Performance Summary',
      type: 'system',
      frequency: 'monthly',
      recipients: ['admin@example.com', 'principal@example.com'],
      nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isActive: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'batch' as const,
    frequency: 'weekly' as const,
    recipients: ''
  });

  const handleAddReport = () => {
    if (!formData.name.trim() || !formData.recipients.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newReport: ScheduledReport = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      frequency: formData.frequency,
      recipients: formData.recipients.split(',').map(r => r.trim()),
      nextRun: new Date(),
      isActive: true
    };

    setReports([...reports, newReport]);
    setFormData({ name: '', type: 'batch', frequency: 'weekly', recipients: '' });
    setShowForm(false);
    alert('Report scheduled successfully!');
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setReports(
      reports.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Every Day';
      case 'weekly':
        return 'Every Week';
      case 'monthly':
        return 'Every Month';
      default:
        return frequency;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'batch':
        return 'bg-blue-500/20 text-blue-400';
      case 'student':
        return 'bg-green-500/20 text-green-400';
      case 'system':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Scheduled Reports</h2>
          <p className="text-gray-400">Automate report generation and email delivery</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      {/* Create Report Form */}
      {showForm && (
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Create Scheduled Report</h3>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Report Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Weekly Class Report"
              className="bg-primary-foreground border-primary/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Report Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md"
              >
                <option value="batch">Batch Report</option>
                <option value="student">Student Report</option>
                <option value="system">System Report</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-4 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Recipients (comma-separated emails)</label>
            <Input
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              placeholder="teacher@example.com, admin@example.com"
              className="bg-primary-foreground border-primary/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddReport}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Schedule Report
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="flex-1 border-primary/30 text-gray-300 hover:bg-primary/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Active Reports</h3>

        {reports.length === 0 ? (
          <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 text-center text-gray-400">
            No scheduled reports yet. Create one to get started!
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className={`border rounded-lg p-4 transition-all ${
                report.isActive
                  ? 'bg-secondary-foreground/10 border-primary/20'
                  : 'bg-secondary-foreground/5 border-gray-600/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold">{report.name}</h4>
                    <Badge className={`${getTypeColor(report.type)} border-0 capitalize text-xs`}>
                      {report.type}
                    </Badge>
                    {!report.isActive && (
                      <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{getFrequencyLabel(report.frequency)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{report.recipients.length} recipient(s)</span>
                    </div>

                    <div className="text-gray-500 text-xs">
                      Next run: {report.nextRun.toLocaleDateString()} at {report.nextRun.toLocaleTimeString()}
                    </div>

                    {report.lastRun && (
                      <div className="text-gray-500 text-xs">
                        Last run: {report.lastRun.toLocaleDateString()} at {report.lastRun.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToggleActive(report.id)}
                    variant="outline"
                    size="sm"
                    className={`border-primary/30 ${
                      report.isActive
                        ? 'text-yellow-400 hover:bg-yellow-500/10'
                        : 'text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {report.isActive ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-gray-300 hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteReport(report.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Reports</div>
          <div className="text-2xl font-bold text-primary mt-1">{reports.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {reports.filter(r => r.isActive).length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Inactive</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {reports.filter(r => !r.isActive).length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Recipients</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {new Set(reports.flatMap(r => r.recipients)).size}
          </div>
        </div>
      </div>
    </div>
  );
}
