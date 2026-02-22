import React, { useState, useEffect } from 'react';
import { Assignments } from '@/entities';
import { AssignmentManagementService } from '@/services/assignmentManagementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Search, FileText } from 'lucide-react';
import AssignmentManagementModal from './AssignmentManagementModal';

interface AssignmentTableProps {
  onAssignmentCreated?: (assignment: Assignments) => void;
  onAssignmentUpdated?: (assignment: Assignments) => void;
  onAssignmentDeleted?: (assignmentId: string) => void;
}

export default function AssignmentTable({
  onAssignmentCreated,
  onAssignmentUpdated,
  onAssignmentDeleted
}: AssignmentTableProps) {
  const [assignments, setAssignments] = useState<Assignments[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignments[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignments | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load assignments
  useEffect(() => {
    loadAssignments();
  }, []);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(assignment =>
        (assignment.title?.toLowerCase().includes(lowerQuery)) ||
        (assignment.description?.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchQuery]);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const allAssignments = await AssignmentManagementService.getAllAssignments();
      setAssignments(allAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData: any) => {
    try {
      const newAssignment = await AssignmentManagementService.createAssignment(assignmentData);
      setAssignments([...assignments, newAssignment]);
      setIsModalOpen(false);
      setSelectedAssignment(null);
      onAssignmentCreated?.(newAssignment);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleUpdateAssignment = async (assignmentId: string, assignmentData: any) => {
    try {
      const updatedAssignment = await AssignmentManagementService.updateAssignment(assignmentId, assignmentData);
      setAssignments(assignments.map(a => a._id === assignmentId ? updatedAssignment : a));
      setIsModalOpen(false);
      setSelectedAssignment(null);
      onAssignmentUpdated?.(updatedAssignment);
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await AssignmentManagementService.deleteAssignment(assignmentId);
      setAssignments(assignments.filter(a => a._id !== assignmentId));
      onAssignmentDeleted?.(assignmentId);
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleEditAssignment = (assignment: Assignments) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const isOverdue = (dueDate?: Date | string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Assignments</h2>
        <Button
          onClick={() => {
            setSelectedAssignment(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
        >
          + Create Assignment
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary-foreground/10 border-primary/20 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-primary/20 bg-secondary-foreground/5">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No assignments found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20 bg-secondary-foreground/10">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Max Points</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment, index) => (
                <tr
                  key={assignment._id}
                  className={`border-b border-primary/10 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-secondary-foreground/5'
                  } hover:bg-primary/10 transition-colors`}
                >
                  <td className="px-6 py-3">
                    <div className="text-white font-medium">{assignment.title}</div>
                    <div className="text-gray-400 text-sm truncate">{assignment.description}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-gray-300 text-sm">{formatDate(assignment.dueDate)}</div>
                    {isOverdue(assignment.dueDate) && (
                      <Badge className="bg-red-500/20 text-red-400 border-0 mt-1">Overdue</Badge>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{assignment.maxPoints} pts</td>
                  <td className="px-6 py-3 text-gray-300 text-sm">{assignment.submissionType}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="p-2 hover:bg-primary/20 rounded-md transition-colors"
                        title="Edit assignment"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="p-2 hover:bg-red-500/20 rounded-md transition-colors"
                        title="Delete assignment"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AssignmentManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAssignment(null);
        }}
        onSubmit={selectedAssignment ? 
          (data) => handleUpdateAssignment(selectedAssignment._id, data) :
          (data) => handleCreateAssignment(data)
        }
        assignment={selectedAssignment}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Assignments</div>
          <div className="text-2xl font-bold text-primary mt-1">{assignments.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Overdue</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {assignments.filter(a => isOverdue(a.dueDate)).length}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Avg Points</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {assignments.length > 0 
              ? Math.round(assignments.reduce((sum, a) => sum + (a.maxPoints || 0), 0) / assignments.length)
              : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
