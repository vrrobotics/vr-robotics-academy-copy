import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Layers, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalAdmins: number;
  totalTeachers: number;
  totalStudents: number;
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  totalAssignments: number;
  submittedAssignments: number;
  averageGrade: number;
  systemUptime: number;
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalAdmins: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalBatches: 0,
    activeBatches: 0,
    completedBatches: 0,
    totalAssignments: 0,
    submittedAssignments: 0,
    averageGrade: 0,
    systemUptime: 99.9
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockData: AnalyticsData = {
        totalUsers: 150,
        totalAdmins: 5,
        totalTeachers: 20,
        totalStudents: 125,
        totalBatches: 15,
        activeBatches: 8,
        completedBatches: 7,
        totalAssignments: 120,
        submittedAssignments: 105,
        averageGrade: 82,
        systemUptime: 99.9
      };
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-secondary-foreground/5 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Admin Analytics
          </h1>
          <p className="text-gray-400">
            System-wide analytics and performance metrics
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Loading analytics...</div>
        ) : (
          <div className="space-y-6">
            {/* User Analytics */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                User Analytics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-primary">{analyticsData.totalUsers}</div>
                  <div className="text-gray-500 text-xs mt-2">All roles combined</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Admins</div>
                  <div className="text-3xl font-bold text-red-400">{analyticsData.totalAdmins}</div>
                  <div className="text-gray-500 text-xs mt-2">System administrators</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Teachers</div>
                  <div className="text-3xl font-bold text-blue-400">{analyticsData.totalTeachers}</div>
                  <div className="text-gray-500 text-xs mt-2">Instructors</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Students</div>
                  <div className="text-3xl font-bold text-green-400">{analyticsData.totalStudents}</div>
                  <div className="text-gray-500 text-xs mt-2">Enrolled students</div>
                </div>
              </div>
            </div>

            {/* Batch Analytics */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                Batch Analytics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Total Batches</div>
                  <div className="text-3xl font-bold text-primary">{analyticsData.totalBatches}</div>
                  <div className="text-gray-500 text-xs mt-2">All batches</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Active Batches</div>
                  <div className="text-3xl font-bold text-green-400">{analyticsData.activeBatches}</div>
                  <div className="text-gray-500 text-xs mt-2">Currently running</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Completed Batches</div>
                  <div className="text-3xl font-bold text-blue-400">{analyticsData.completedBatches}</div>
                  <div className="text-gray-500 text-xs mt-2">Finished batches</div>
                </div>
              </div>
            </div>

            {/* Assignment Analytics */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                Assignment Analytics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Total Assignments</div>
                  <div className="text-3xl font-bold text-primary">{analyticsData.totalAssignments}</div>
                  <div className="text-gray-500 text-xs mt-2">All assignments</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Submitted</div>
                  <div className="text-3xl font-bold text-green-400">{analyticsData.submittedAssignments}</div>
                  <div className="text-gray-500 text-xs mt-2">
                    {Math.round((analyticsData.submittedAssignments / analyticsData.totalAssignments) * 100)}% submission rate
                  </div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Average Grade</div>
                  <div className="text-3xl font-bold text-yellow-400">{analyticsData.averageGrade}%</div>
                  <div className="text-gray-500 text-xs mt-2">Class average</div>
                </div>
              </div>
            </div>

            {/* Performance Analytics */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Performance Analytics
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Users by Role</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-sm">Admins</span>
                        <span className="text-white text-sm font-semibold">
                          {Math.round((analyticsData.totalAdmins / analyticsData.totalUsers) * 100)}%
                        </span>
                      </div>
                      <div className="bg-primary-foreground rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-500 h-full"
                          style={{ width: `${(analyticsData.totalAdmins / analyticsData.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-sm">Teachers</span>
                        <span className="text-white text-sm font-semibold">
                          {Math.round((analyticsData.totalTeachers / analyticsData.totalUsers) * 100)}%
                        </span>
                      </div>
                      <div className="bg-primary-foreground rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${(analyticsData.totalTeachers / analyticsData.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-sm">Students</span>
                        <span className="text-white text-sm font-semibold">
                          {Math.round((analyticsData.totalStudents / analyticsData.totalUsers) * 100)}%
                        </span>
                      </div>
                      <div className="bg-primary-foreground rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${(analyticsData.totalStudents / analyticsData.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">System Uptime</span>
                        <span className="text-green-400 font-semibold">{analyticsData.systemUptime}%</span>
                      </div>
                      <div className="bg-primary-foreground rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${analyticsData.systemUptime}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <div className="text-gray-400 text-sm mb-2">Status</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-green-400 text-sm font-semibold">All Systems Operational</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">User Growth Trend</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart will display here
                </div>
              </div>
              <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Assignment Completion Rate</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart will display here
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
