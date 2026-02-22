import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagementTable from '@/components/dashboard/UserManagementTable';
import BatchManagementTable from '@/components/dashboard/BatchManagementTable';
import AssignmentTable from '@/components/dashboard/AssignmentTable';
import TaskTable from '@/components/dashboard/TaskTable';
import { Users, Layers, FileText, CheckSquare, BarChart3 } from 'lucide-react';

export default function ManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-secondary-foreground/5 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Management Dashboard
          </h1>
          <p className="text-gray-400">
            Manage users, batches, assignments, and tasks all in one place
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-secondary-foreground/10 border border-primary/20 p-1 rounded-lg">
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="batches"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Batches</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assignments"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Assignments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <UserManagementTable />
          </TabsContent>

          {/* Batches Tab */}
          <TabsContent value="batches" className="mt-6">
            <BatchManagementTable />
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="mt-6">
            <AssignmentTable />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-6">
            <TaskTable />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-gray-500 text-xs mt-2">Across all roles</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Active Batches</div>
                  <div className="text-3xl font-bold text-green-400">0</div>
                  <div className="text-gray-500 text-xs mt-2">Currently running</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Pending Assignments</div>
                  <div className="text-3xl font-bold text-yellow-400">0</div>
                  <div className="text-gray-500 text-xs mt-2">Awaiting submission</div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2">Task Completion</div>
                  <div className="text-3xl font-bold text-blue-400">0%</div>
                  <div className="text-gray-500 text-xs mt-2">Overall progress</div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Users by Role</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart will display here
                  </div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Batches by Status</h3>
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
                  <h3 className="text-white font-semibold mb-4">Task Completion Trend</h3>
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
