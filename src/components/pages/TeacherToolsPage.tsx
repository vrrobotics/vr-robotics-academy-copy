import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubmissionGradingPanel from '@/components/dashboard/SubmissionGradingPanel';
import StudentPerformanceTracker from '@/components/dashboard/StudentPerformanceTracker';
import AttendanceTracker from '@/components/dashboard/AttendanceTracker';
import { FileText, Users, Calendar, BarChart3 } from 'lucide-react';

export default function TeacherToolsPage() {
  const [activeTab, setActiveTab] = useState('grading');

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-secondary-foreground/5 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Teacher Tools
          </h1>
          <p className="text-gray-400">
            Manage grading, track student performance, and monitor class attendance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-secondary-foreground/10 border border-primary/20 p-1 rounded-lg">
            <TabsTrigger 
              value="grading"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Grading</span>
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Grading Tab */}
          <TabsContent value="grading" className="mt-6">
            <SubmissionGradingPanel />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <StudentPerformanceTracker />
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="mt-6">
            <AttendanceTracker />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Class Size</div>
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-gray-500 text-xs mt-2">Active students</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Class Average</div>
                  <div className="text-3xl font-bold text-green-400">0%</div>
                  <div className="text-gray-500 text-xs mt-2">Overall performance</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Attendance Rate</div>
                  <div className="text-3xl font-bold text-blue-400">0%</div>
                  <div className="text-gray-500 text-xs mt-2">Average attendance</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Assignment Rate</div>
                  <div className="text-3xl font-bold text-yellow-400">0%</div>
                  <div className="text-gray-500 text-xs mt-2">Submission rate</div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Grade Distribution</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart will display here
                  </div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Attendance Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart will display here
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Assignment Submission Rate</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart will display here
                  </div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Student Performance Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart will display here
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
