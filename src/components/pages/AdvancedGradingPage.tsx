import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradingRubric from '@/components/dashboard/GradingRubric';
import BatchGrading from '@/components/dashboard/BatchGrading';
import { FileText, Users, Zap } from 'lucide-react';

export default function AdvancedGradingPage() {
  const [activeTab, setActiveTab] = useState('rubric');

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-background via-secondary-foreground/5 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Advanced Grading Tools
          </h1>
          <p className="text-gray-400">
            Rubric-based grading, templates, batch grading, and grade appeals
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-secondary-foreground/10 border border-primary/20 p-1 rounded-lg">
            <TabsTrigger 
              value="rubric"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Rubric</span>
            </TabsTrigger>
            <TabsTrigger 
              value="batch"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Batch</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates"
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 hover:text-white transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
          </TabsList>

          {/* Rubric Tab */}
          <TabsContent value="rubric" className="mt-6">
            <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
              <GradingRubric 
                rubricName="Assignment Rubric"
                onSave={(rubric) => {
                  console.log('Rubric saved:', rubric);
                  alert('Rubric saved successfully!');
                }}
              />
            </div>
          </TabsContent>

          {/* Batch Grading Tab */}
          <TabsContent value="batch" className="mt-6">
            <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
              <BatchGrading 
                assignmentId="assign-1"
                onGradeSubmit={(submissions) => {
                  console.log('Batch grades applied:', submissions);
                  alert('Batch grades applied successfully!');
                }}
              />
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6">
            <div className="space-y-6">
              {/* Available Templates */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">Grade Templates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Excellent Work', grade: 90, feedback: 'Outstanding submission with clear understanding' },
                    { name: 'Good Work', grade: 80, feedback: 'Well-done assignment with minor improvements needed' },
                    { name: 'Satisfactory', grade: 70, feedback: 'Acceptable work but needs more detail and effort' },
                    { name: 'Needs Improvement', grade: 60, feedback: 'Incomplete or unclear submission, please revise' },
                    { name: 'Incomplete', grade: 0, feedback: 'Assignment not submitted or severely incomplete' },
                    { name: 'Excellent Effort', grade: 95, feedback: 'Exceptional work demonstrating mastery of concepts' }
                  ].map((template, index) => (
                    <button
                      key={index}
                      className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4 hover:bg-secondary-foreground/20 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-white font-semibold">{template.name}</div>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded text-sm font-bold">
                          {template.grade}%
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{template.feedback}</p>
                      <button className="mt-3 w-full px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded text-sm font-medium transition-colors">
                        Use Template
                      </button>
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Custom Template */}
              <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
                <h3 className="text-xl font-heading font-bold text-white mb-4">Create Custom Template</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Template Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Excellent Work"
                      className="w-full px-4 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Grade</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="90"
                        className="w-full px-4 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Feedback</label>
                      <input
                        type="text"
                        placeholder="Feedback text..."
                        className="w-full px-4 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors">
                    Create Template
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
