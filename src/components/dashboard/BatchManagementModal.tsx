import React, { useState, useEffect } from 'react';
import { Batches, TeacherApprovals, Students, Enrollments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BatchManagementService } from '@/services/batchManagementService';
import { BaseCrudService } from '@/integrations';

interface BatchManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchData: any) => void;
  batch?: Batches | null;
}

export default function BatchManagementModal({
  isOpen,
  onClose,
  onSubmit,
  batch
}: BatchManagementModalProps) {
  const [formData, setFormData] = useState({
    batchName: '',
    batchLevel: '',
    startDate: '',
    endDate: '',
    batchStatus: 'active',
    assignedTeacherName: '',
    assignedStudentName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!batch);
  const [approvedTeachers, setApprovedTeachers] = useState<TeacherApprovals[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [paidStudents, setPaidStudents] = useState<Students[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const templates = BatchManagementService.getBatchTemplates();

  // Load approved teachers and paid students
  useEffect(() => {
    const loadApprovedTeachers = async () => {
      setLoadingTeachers(true);
      try {
        console.log('[BatchManagementModal] Starting to load teachers...');
        const { items } = await BaseCrudService.getAll<TeacherApprovals>('teacherapprovals');
        console.log('[BatchManagementModal] All teachers fetched:', items);
        console.log('[BatchManagementModal] Total teachers count:', items?.length || 0);
        
        if (!items || items.length === 0) {
          console.warn('[BatchManagementModal] No teachers found in database');
          setApprovedTeachers([]);
          setLoadingTeachers(false);
          return;
        }
        
        const approved = items.filter(item => {
          const isApproved = item.approvalStatus === 'approved';
          console.log(`[BatchManagementModal] Teacher: ${item.teacherFullName}, Status: "${item.approvalStatus}", Is Approved: ${isApproved}`);
          return isApproved;
        });
        
        console.log('[BatchManagementModal] Approved teachers count:', approved.length);
        console.log('[BatchManagementModal] Approved teachers:', approved);
        setApprovedTeachers(approved);
      } catch (error) {
        console.error('[BatchManagementModal] Error loading approved teachers:', error);
        setApprovedTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    const loadPaidStudents = async () => {
      setLoadingStudents(true);
      try {
        console.log('[BatchManagementModal] Starting to load students...');
        
        // Get all enrollments with paid status
        const { items: enrollments } = await BaseCrudService.getAll<Enrollments>('enrollments');
        console.log('[BatchManagementModal] All enrollments fetched:', enrollments);
        
        if (!enrollments || enrollments.length === 0) {
          console.warn('[BatchManagementModal] No enrollments found');
          setPaidStudents([]);
          setLoadingStudents(false);
          return;
        }
        
        // Filter for paid enrollments
        const paidEnrollmentUserIds = enrollments
          .filter(enrollment => enrollment.paymentStatus === 'paid')
          .map(enrollment => enrollment.userId);
        
        console.log('[BatchManagementModal] Paid enrollment user IDs:', paidEnrollmentUserIds);
        
        if (paidEnrollmentUserIds.length === 0) {
          console.warn('[BatchManagementModal] No paid enrollments found');
          setPaidStudents([]);
          setLoadingStudents(false);
          return;
        }
        
        // Get all students
        const { items: allStudents } = await BaseCrudService.getAll<Students>('students');
        console.log('[BatchManagementModal] All students fetched:', allStudents);
        
        if (!allStudents || allStudents.length === 0) {
          console.warn('[BatchManagementModal] No students found');
          setPaidStudents([]);
          setLoadingStudents(false);
          return;
        }
        
        // Filter students who have paid enrollments
        const paidStudentsList = allStudents.filter(student => 
          paidEnrollmentUserIds.includes(student._id)
        );
        
        console.log('[BatchManagementModal] Paid students count:', paidStudentsList.length);
        console.log('[BatchManagementModal] Paid students:', paidStudentsList);
        setPaidStudents(paidStudentsList);
      } catch (error) {
        console.error('[BatchManagementModal] Error loading paid students:', error);
        setPaidStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (isOpen) {
      loadApprovedTeachers();
      loadPaidStudents();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (batch) {
      setFormData({
        batchName: batch.batchName || '',
        batchLevel: batch.batchLevel || '',
        startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
        endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
        batchStatus: batch.batchStatus || 'active',
        assignedTeacherName: batch.assignedTeacherName || '',
        assignedStudentName: ''
      });
      setShowTemplates(false);
    } else {
      setFormData({
        batchName: '',
        batchLevel: '',
        startDate: '',
        endDate: '',
        batchStatus: 'active',
        assignedTeacherName: '',
        assignedStudentName: ''
      });
      setShowTemplates(true);
    }
    setErrors({});
  }, [batch, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.batchName.trim()) {
      newErrors.batchName = 'Batch name is required';
    }

    if (!formData.batchLevel.trim()) {
      newErrors.batchLevel = 'Batch level is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = 'End date must be after start date';
      }
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
        batchName: formData.batchName,
        batchLevel: formData.batchLevel,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        batchStatus: formData.batchStatus,
        assignedTeacherName: formData.assignedTeacherName || undefined,
        assignedStudentName: formData.assignedStudentName || undefined
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save batch. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const applyTemplate = (template: any) => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + template.duration * 7 * 24 * 60 * 60 * 1000);

    setFormData(prev => ({
      ...prev,
      batchName: template.name,
      batchLevel: template.level,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
    setShowTemplates(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary-foreground border border-primary/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-heading">
            {batch ? 'Edit Batch' : 'Create New Batch'}
          </DialogTitle>
        </DialogHeader>

        {/* Templates */}
        {showTemplates && !batch && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Quick Start with Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => applyTemplate(template)}
                  className="p-4 bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors text-left"
                >
                  <div className="text-white font-medium">{template.name}</div>
                  <div className="text-gray-400 text-sm">{template.level} • {template.duration} weeks</div>
                  <div className="text-gray-500 text-xs mt-2">{template.description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="mt-4 text-primary text-sm hover:underline"
            >
              Create custom batch instead
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Batch Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Batch Name *
            </label>
            <Input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              placeholder="e.g., Beginner Robotics"
              className="bg-primary-foreground border-primary/20 text-white placeholder:text-gray-500"
            />
            {errors.batchName && (
              <p className="text-red-400 text-sm mt-1">{errors.batchName}</p>
            )}
          </div>

          {/* Batch Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Batch Level *
            </label>
            <select
              name="batchLevel"
              value={formData.batchLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="" className="bg-gray-700 text-white">
                Select a level
              </option>
              <option value="Beginner" className="bg-gray-700 text-white">
                Beginner
              </option>
              <option value="Intermediate" className="bg-gray-700 text-white">
                Intermediate
              </option>
              <option value="Advanced" className="bg-gray-700 text-white">
                Advanced
              </option>
            </select>
            {errors.batchLevel && (
              <p className="text-red-400 text-sm mt-1">{errors.batchLevel}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-primary-foreground border-primary/20 text-white"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="bg-primary-foreground border-primary/20 text-white"
              />
              {errors.endDate && (
                <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Teacher Name
            </label>
            {loadingTeachers ? (
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-400 rounded-md flex items-center font-medium">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                Loading teachers...
              </div>
            ) : (
              <select
                name="assignedTeacherName"
                value={formData.assignedTeacherName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" className="bg-gray-700 text-white">
                  {approvedTeachers.length === 0 ? 'No approved teachers' : 'Select a teacher'}
                </option>
                {approvedTeachers.map((teacher) => (
                  <option key={teacher._id} value={teacher.teacherFullName || ''} className="bg-gray-700 text-white">
                    {teacher.teacherFullName || 'Unnamed Teacher'}
                  </option>
                ))}
              </select>
            )}
            {approvedTeachers.length === 0 && !loadingTeachers && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                <p className="text-yellow-400 text-sm font-medium">⚠ No approved teachers</p>
                <p className="text-gray-400 text-xs mt-1">
                  Go to Teacher Approvals to approve teachers before assigning them to batches.
                </p>
              </div>
            )}
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Student Name
            </label>
            {loadingStudents ? (
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-400 rounded-md flex items-center font-medium">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                Loading students...
              </div>
            ) : (
              <select
                name="assignedStudentName"
                value={formData.assignedStudentName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" className="bg-gray-700 text-white">
                  {paidStudents.length === 0 ? 'No paid students' : 'Select a student'}
                </option>
                {paidStudents.map((student) => (
                  <option key={student._id} value={`${student.firstName} ${student.lastName}` || ''} className="bg-gray-700 text-white">
                    {`${student.firstName} ${student.lastName}` || 'Unnamed Student'}
                  </option>
                ))}
              </select>
            )}
            {paidStudents.length === 0 && !loadingStudents && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                <p className="text-yellow-400 text-sm font-medium">ℹ No paid students</p>
                <p className="text-gray-400 text-xs mt-1">
                  Students with completed payments will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="batchStatus"
              value={formData.batchStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md font-medium hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="active" className="bg-gray-700 text-white">Active</option>
              <option value="pending" className="bg-gray-700 text-white">Pending</option>
              <option value="completed" className="bg-gray-700 text-white">Completed</option>
            </select>
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
              {isSubmitting ? 'Saving...' : batch ? 'Update Batch' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
