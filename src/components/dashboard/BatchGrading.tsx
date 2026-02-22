import React, { useState, useEffect } from 'react';
import { AssignmentSubmissions } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface BatchGradingProps {
  assignmentId?: string;
  onGradeSubmit?: (submissions: AssignmentSubmissions[]) => void;
}

export default function BatchGrading({ assignmentId, onGradeSubmit }: BatchGradingProps) {
  const [submissions, setSubmissions] = useState<AssignmentSubmissions[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [batchGrade, setBatchGrade] = useState<number>(0);
  const [batchFeedback, setBatchFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockSubmissions: AssignmentSubmissions[] = [
        {
          _id: '1',
          assignmentId: assignmentId || 'assign-1',
          studentId: 'student-1',
          submittedOn: new Date(),
          submissionContent: 'Sample submission',
          submissionUrl: 'https://example.com/1',
          grade: undefined,
          instructorFeedback: undefined
        },
        {
          _id: '2',
          assignmentId: assignmentId || 'assign-1',
          studentId: 'student-2',
          submittedOn: new Date(),
          submissionContent: 'Another submission',
          submissionUrl: 'https://example.com/2',
          grade: undefined,
          instructorFeedback: undefined
        },
        {
          _id: '3',
          assignmentId: assignmentId || 'assign-1',
          studentId: 'student-3',
          submittedOn: new Date(),
          submissionContent: 'Third submission',
          submissionUrl: 'https://example.com/3',
          grade: undefined,
          instructorFeedback: undefined
        }
      ];
      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSubmission = (id: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.size === submissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(submissions.map(s => s._id)));
    }
  };

  const handleApplyBatchGrade = async () => {
    if (selectedSubmissions.size === 0) return;

    try {
      setIsSaving(true);
      const updatedSubmissions = submissions.map(sub =>
        selectedSubmissions.has(sub._id)
          ? {
              ...sub,
              grade: batchGrade,
              instructorFeedback: batchFeedback
            }
          : sub
      );

      setSubmissions(updatedSubmissions);
      onGradeSubmit?.(updatedSubmissions.filter(s => selectedSubmissions.has(s._id)));
      
      // Reset
      setSelectedSubmissions(new Set());
      setBatchGrade(0);
      setBatchFeedback('');
    } catch (error) {
      console.error('Error applying batch grade:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const pendingCount = submissions.filter(s => !s.grade).length;
  const gradedCount = submissions.filter(s => s.grade !== undefined).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Batch Grading</h2>
        <div className="flex gap-2">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
            {pendingCount} Pending
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">
            {gradedCount} Graded
          </Badge>
        </div>
      </div>

      {/* Batch Grade Panel */}
      <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Apply Batch Grade</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Grade (0-100)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={batchGrade}
              onChange={(e) => setBatchGrade(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="bg-primary-foreground border-primary/20 text-white"
            />
          </div>
          <div className="flex items-end">
            <div className="bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 w-full flex items-center justify-center text-primary font-semibold">
              {batchGrade}%
            </div>
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">Feedback (Optional)</label>
          <textarea
            value={batchFeedback}
            onChange={(e) => setBatchFeedback(e.target.value)}
            placeholder="Provide feedback for all selected submissions..."
            rows={4}
            className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
          />
        </div>

        <Button
          onClick={handleApplyBatchGrade}
          disabled={selectedSubmissions.size === 0 || isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
        >
          {isSaving ? 'Applying...' : `Apply to ${selectedSubmissions.size} Selected`}
        </Button>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Submissions</h3>
          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="border-primary/30 text-gray-300 hover:bg-primary/10"
          >
            {selectedSubmissions.size === submissions.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No submissions found</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className={`p-4 rounded-lg border transition-all flex items-center gap-3 ${
                  selectedSubmissions.has(submission._id)
                    ? 'bg-primary/20 border-primary'
                    : 'bg-secondary-foreground/10 border-primary/20 hover:bg-secondary-foreground/20'
                }`}
              >
                <Checkbox
                  checked={selectedSubmissions.has(submission._id)}
                  onCheckedChange={() => handleSelectSubmission(submission._id)}
                  className="border-primary/30"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium">{submission.studentId}</div>
                  <div className="text-gray-400 text-sm">
                    {submission.submittedOn
                      ? new Date(submission.submittedOn).toLocaleDateString()
                      : '-'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {submission.grade !== undefined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <Badge className="bg-green-500/20 text-green-400 border-0">
                        {submission.grade}%
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                        Pending
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total</div>
          <div className="text-2xl font-bold text-primary mt-1">{submissions.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Selected</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{selectedSubmissions.size}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Completion</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {submissions.length > 0 ? Math.round((gradedCount / submissions.length) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
