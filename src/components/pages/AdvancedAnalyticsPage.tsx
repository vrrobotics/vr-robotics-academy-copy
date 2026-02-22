import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceInsights from '@/components/dashboard/PerformanceInsights';
import ReportGenerator from '@/components/dashboard/ReportGenerator';
import { BarChart3, Lightbulb, Download } from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-secondary-foreground/5 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Advanced Analytics
          </h1>
          <p className="text-gray-400">
            Predictive analytics, insights, trends, and comprehensive reporting
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary-foreground/10 border border-primary/20 p-1 rounded-lg">
            <TabsTrigger 
              value="insights"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trends"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-6">
            <PerformanceInsights />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-6">
            <div className="space-y-6">
              {/* Trend Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Grade Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Grade trend chart will display here
                  </div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Attendance Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Attendance trend chart will display here
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Submission Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Submission trend chart will display here
                  </div>
                </div>
                <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Performance Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Performance trend chart will display here
                  </div>
                </div>
              </div>

              {/* Trend Summary */}
              <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-heading font-bold text-white">Trend Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary-foreground rounded-lg">
                    <span className="text-gray-400">Grade Trend</span>
                    <span className="text-green-400 font-semibold">↑ +8% (Improving)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-foreground rounded-lg">
                    <span className="text-gray-400">Attendance Trend</span>
                    <span className="text-yellow-400 font-semibold">↓ -3% (Declining)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-foreground rounded-lg">
                    <span className="text-gray-400">Submission Rate</span>
                    <span className="text-green-400 font-semibold">↑ +5% (Improving)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary-foreground rounded-lg">
                    <span className="text-gray-400">Quiz Performance</span>
                    <span className="text-green-400 font-semibold">↑ +12% (Improving)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <ReportGenerator 
              onGenerateReport={(type, format) => {
                console.log(`Generating ${type} report in ${format} format`);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
