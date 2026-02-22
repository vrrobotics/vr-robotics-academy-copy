import React, { useState, useEffect } from 'react';
import { Assignments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AssignmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: any) => void;
  assignment?: Assignments | null;
}

export default function AssignmentManagementModal({
  isOpen,
  onClose,
  onSubmit,
  assignment
}: AssignmentManagementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxPoints: 100,
    submissionType: 'file'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        instructions: assignment.instructions || '',
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
        maxPoints: assignment.maxPoints || 100,
        submissionType: assignment.submissionType || 'file'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        instructions: '',
        dueDate: '',
        maxPoints: 100,
        submissionType: 'file'
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.maxPoints || formData.maxPoints <= 0) {
      newErrors.maxPoints = 'Max points must be greater than 0';
    }

    if (!formData.submissionType) {
      newErrors.submissionType = 'Submission type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const submitData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        dueDate: new Date(formData.dueDate),
        maxPoints: formData.maxPoints,
        submissionType: formData.submissionType
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save assignment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPoints' ? parseInt(value) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary-foreground border border-primary/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-heading">
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Robotics Project"
              className="bg-primary-foreground border-primary/20 text-white placeholder:text-gray-500"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the assignment"
              rows={3}
              className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instructions *
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Detailed instructions for the assignment"
              rows={4}
              className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md placeholder:text-gray-500"
            />
            {errors.instructions && (
              <p className="text-red-400 text-sm mt-1">{errors.instructions}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Due Date *
            </label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="bg-primary-foreground border-primary/20 text-white"
            />
            {errors.dueDate && (
              <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Max Points and Submission Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Points *
              </label>
              <Input
                type="number"
                name="maxPoints"
                value={formData.maxPoints}
                onChange={handleChange}
                min="1"
                className="bg-primary-foreground border-primary/20 text-white"
              />
              {errors.maxPoints && (
                <p className="text-red-400 text-sm mt-1">{errors.maxPoints}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Submission Type *
              </label>
              <select
                name="submissionType"
                value={formData.submissionType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-primary-foreground border border-primary/20 text-white rounded-md"
              >
                <option value="file">File Upload</option>
                <option value="text">Text Submission</option>
                <option value="url">URL Submission</option>
                <option value="quiz">Quiz</option>
              </select>
              {errors.submissionType && (
                <p className="text-red-400 text-sm mt-1">{errors.submissionType}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md text-sm">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-primary/30 text-gray-300 hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {isSubmitting ? 'Saving...' : assignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
