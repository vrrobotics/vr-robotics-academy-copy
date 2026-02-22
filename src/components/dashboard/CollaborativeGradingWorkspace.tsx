import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Save, Send } from 'lucide-react';

interface GradingComment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  resolved: boolean;
}

interface CollaborativeSubmission {
  id: string;
  studentName: string;
  content: string;
  currentGrade?: number;
  comments: GradingComment[];
  collaborators: string[];
  lastUpdated: Date;
}

export default function CollaborativeGradingWorkspace() {
  const [submissions, setSubmissions] = useState<CollaborativeSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<CollaborativeSubmission | null>(null);
  const [newComment, setNewComment] = useState('');
  const [currentGrade, setCurrentGrade] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockSubmissions: CollaborativeSubmission[] = [
        {
          id: '1',
          studentName: 'Alice Johnson',
          content: 'Sample submission content here...',
          currentGrade: 85,
          comments: [
            {
              id: '1',
              author: 'Teacher 1',
              text: 'Great work on the analysis section!',
              timestamp: new Date(),
              resolved: false
            }
          ],
          collaborators: ['Teacher 1', 'Teacher 2'],
          lastUpdated: new Date()
        },
        {
          id: '2',
          studentName: 'Bob Smith',
          content: 'Another submission content...',
          currentGrade: undefined,
          comments: [],
          collaborators: ['Teacher 1'],
          lastUpdated: new Date()
        },
        {
          id: '3',
          studentName: 'Carol Davis',
          content: 'Third submission content...',
          currentGrade: 92,
          comments: [
            {
              id: '2',
              author: 'Teacher 2',
              text: 'Excellent presentation!',
              timestamp: new Date(),
              resolved: true
            }
          ],
          collaborators: ['Teacher 1', 'Teacher 2', 'Teacher 3'],
          lastUpdated: new Date()
        }
      ];
      setSubmissions(mockSubmissions);
      if (mockSubmissions.length > 0) {
        setSelectedSubmission(mockSubmissions[0]);
        setCurrentGrade(mockSubmissions[0].currentGrade || 0);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedSubmission) return;

    try {
      const updatedSubmission: CollaborativeSubmission = {
        ...selectedSubmission,
        comments: [
          ...selectedSubmission.comments,
          {
            id: Date.now().toString(),
            author: 'Current Teacher',
            text: newComment,
            timestamp: new Date(),
            resolved: false
          }
        ],
        lastUpdated: new Date()
      };

      setSubmissions(
        submissions.map(s => (s.id === selectedSubmission.id ? updatedSubmission : s))
      );
      setSelectedSubmission(updatedSubmission);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;

    try {
      setIsSaving(true);
      const updatedSubmission: CollaborativeSubmission = {
        ...selectedSubmission,
        currentGrade,
        lastUpdated: new Date()
      };

      setSubmissions(
        submissions.map(s => (s.id === selectedSubmission.id ? updatedSubmission : s))
      );
      setSelectedSubmission(updatedSubmission);
      alert('Grade saved successfully!');
    } catch (error) {
      console.error('Error saving grade:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resolveComment = (commentId: string) => {
    if (!selectedSubmission) return;

    const updatedSubmission: CollaborativeSubmission = {
      ...selectedSubmission,
      comments: selectedSubmission.comments.map(c =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      ),
      lastUpdated: new Date()
    };

    setSubmissions(
      submissions.map(s => (s.id === selectedSubmission.id ? updatedSubmission : s))
    );
    setSelectedSubmission(updatedSubmission);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Collaborative Grading Workspace
        </h2>
        <p className="text-gray-400">Grade submissions together with real-time collaboration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-white">Submissions</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No submissions found</div>
            ) : (
              submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setCurrentGrade(submission.currentGrade || 0);
                  }}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedSubmission?.id === submission.id
                      ? 'bg-primary/20 border-primary'
                      : 'bg-secondary-foreground/10 border-primary/20 hover:bg-secondary-foreground/20'
                  }`}
                >
                  <div className="font-medium text-white">{submission.studentName}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {submission.currentGrade !== undefined ? (
                      <span className="text-green-400 font-semibold">{submission.currentGrade}%</span>
                    ) : (
                      <span className="text-yellow-400">Pending</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {submission.collaborators.length} collaborators
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSubmission ? (
            <>
              {/* Submission Content */}
              <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white">
                      {selectedSubmission.studentName}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Last updated: {selectedSubmission.lastUpdated.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedSubmission.collaborators.map((collaborator, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-500/20 text-blue-400 border-0 text-xs"
                      >
                        {collaborator}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Submission Content */}
                <div className="bg-primary-foreground rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-gray-300 text-sm">{selectedSubmission.content}</p>
                </div>

                {/* Grade Section */}
                <div className="space-y-3">
                  <label className="text-gray-400 text-sm">Grade (0-100)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={currentGrade}
                      onChange={(e) => setCurrentGrade(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="bg-primary-foreground border-primary/20 text-white"
                    />
                    <div className="bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 flex items-center justify-center text-primary font-semibold min-w-20">
                      {currentGrade}%
                    </div>
                    <Button
                      onClick={handleSaveGrade}
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">Comments ({selectedSubmission.comments.length})</h3>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedSubmission.comments.length === 0 ? (
                    <p className="text-gray-400 text-sm">No comments yet</p>
                  ) : (
                    selectedSubmission.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-lg border ${
                          comment.resolved
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-primary-foreground border-primary/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-white font-medium text-sm">{comment.author}</div>
                            <div className="text-gray-400 text-xs">
                              {comment.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          <button
                            onClick={() => resolveComment(comment.id)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              comment.resolved
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                          >
                            {comment.resolved ? 'Resolved' : 'Resolve'}
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 text-center text-gray-400">
              Select a submission to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
