import React, { useState, useEffect } from 'react';
import { AssignmentSubmissions, Assignments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SubmissionGradingPanelProps {
  onSubmissionSelect?: (submission: AssignmentSubmissions) => void;
  onGradeSubmit?: (submissionId: string, grade: number, feedback: string) => void;
}

export default function SubmissionGradingPanel({
  onSubmissionSelect,
  onGradeSubmit
}: SubmissionGradingPanelProps) {
  const [submissions, setSubmissions] = useState<AssignmentSubmissions[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<AssignmentSubmissions[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmissions | null>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load submissions
  useEffect(() => {
    loadSubmissions();
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(sub => {
        if (selectedStatus === 'pending') return !sub.grade;
        if (selectedStatus === 'graded') return sub.grade !== undefined && sub.grade !== null;
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        (sub.studentId?.toLowerCase().includes(lowerQuery)) ||
        (sub.assignmentId?.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchQuery, selectedStatus]);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockSubmissions: AssignmentSubmissions[] = [
        {
          _id: '1',
          assignmentId: 'assign-1',
          studentId: 'student-1',
          submittedOn: new Date(),
          submissionContent: 'Sample submission content',
          submissionUrl: 'https://example.com/submission1',
          grade: undefined,
          instructorFeedback: undefined
        },
        {
          _id: '2',
          assignmentId: 'assign-1',
          studentId: 'student-2',
          submittedOn: new Date(),
          submissionContent: 'Another submission',
          submissionUrl: 'https://example.com/submission2',
          grade: 85,
          instructorFeedback: 'Good work!'
        }
      ];
      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSubmission = (submission: AssignmentSubmissions) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || 0);
    setFeedback(submission.instructorFeedback || '');
    onSubmissionSelect?.(submission);
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;

    try {
      setIsSaving(true);
      // TODO: Replace with actual API call
      onGradeSubmit?.(selectedSubmission._id, grade, feedback);
      
      // Update local state
      setSubmissions(submissions.map(sub =>
        sub._id === selectedSubmission._id
          ? { ...sub, grade, instructorFeedback: feedback }
          : sub
      ));
      
      setSelectedSubmission(null);
      setGrade(0);
      setFeedback('');
    } catch (error) {
      console.error('Error saving grade:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (submission: AssignmentSubmissions) => {
    if (submission.grade !== undefined && submission.grade !== null) {
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    }
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const getStatusColor = (submission: AssignmentSubmissions) => {
    if (submission.grade !== undefined && submission.grade !== null) {
      return 'bg-green-500/20 text-green-400';
    }
    return 'bg-yellow-500/20 text-yellow-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submissions List */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-xl font-heading font-bold text-white">Submissions</h2>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary-foreground/10 border-primary/20 text-white placeholder:text-gray-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="graded">Graded</option>
          </select>
        </div>

        {/* Submissions List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">Loading submissions...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No submissions found</div>
          ) : (
            filteredSubmissions.map((submission) => (
              <button
                key={submission._id}
                onClick={() => handleSelectSubmission(submission)}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedSubmission?._id === submission._id
                    ? 'bg-primary/20 border-primary'
                    : 'bg-secondary-foreground/10 border-primary/20 hover:bg-secondary-foreground/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {submission.studentId}
                    </div>
                    <div className="text-gray-400 text-sm truncate">
                      {submission.assignmentId}
                    </div>
                  </div>
                  {getStatusIcon(submission)}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Badge className={`${getStatusColor(submission)} border-0 text-xs`}>
                    {submission.grade !== undefined ? `${submission.grade}%` : 'Pending'}
                  </Badge>
                  <span className="text-gray-500 text-xs">
                    {submission.submittedOn
                      ? new Date(submission.submittedOn).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-semibold">{submissions.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Pending</span>
            <span className="text-yellow-400 font-semibold">
              {submissions.filter(s => !s.grade).length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Graded</span>
            <span className="text-green-400 font-semibold">
              {submissions.filter(s => s.grade !== undefined).length}
            </span>
          </div>
        </div>
      </div>

      {/* Grading Panel */}
      <div className="lg:col-span-2">
        {selectedSubmission ? (
          <div className="space-y-4">
            <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-heading font-bold text-white mb-4">
                Grade Submission
              </h3>

              {/* Submission Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-primary/20">
                <div>
                  <label className="text-gray-400 text-sm">Student</label>
                  <div className="text-white font-medium">{selectedSubmission.studentId}</div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Assignment</label>
                  <div className="text-white font-medium">{selectedSubmission.assignmentId}</div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Submitted</label>
                  <div className="text-white font-medium">
                    {selectedSubmission.submittedOn
                      ? new Date(selectedSubmission.submittedOn).toLocaleString()
                      : '-'}
                  </div>
                </div>
              </div>

              {/* Submission Content */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Submission Content</label>
                <div className="bg-primary-foreground border border-primary/20 rounded-lg p-4 text-white max-h-48 overflow-y-auto">
                  {selectedSubmission.submissionContent || selectedSubmission.submissionUrl || 'No content'}
                </div>
              </div>

              {/* Grade Input */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Grade (0-100) *</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={grade}
                    onChange={(e) => setGrade(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="bg-primary-foreground border-primary/20 text-white"
                  />
                  <div className="bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 flex items-center text-primary font-semibold">
                    {grade}%
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for the student..."
                  rows={5}
                  className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setGrade(0);
                    setFeedback('');
                  }}
                  variant="outline"
                  className="flex-1 border-primary/30 text-gray-300 hover:bg-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveGrade}
                  disabled={isSaving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Grade'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-8 flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Select a submission to grade</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
