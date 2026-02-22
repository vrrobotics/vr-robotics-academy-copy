import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Users, Courses, UpcomingClasses, StudentApprovals } from '@/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Trash2, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated: () => void;
  teachers: Users[];
  students: Users[];
  courses: Courses[];
}

export function CreateClassModal({
  isOpen,
  onClose,
  onClassCreated,
  teachers,
  students,
  courses
}: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    classTitle: '',
    classDescription: '',
    liveClassLink: '',
    courseCategory: '',
    difficultyLevel: 'beginner',
    scheduledDateTime: '',
    endingDateTime: '',
    assignedTeacherName: '',
    assignedStudentIds: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvedStudents, setApprovedStudents] = useState<StudentApprovals[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [selectedStudentDropdowns, setSelectedStudentDropdowns] = useState<string[]>(['']);

  // Load approved students on mount
  useEffect(() => {
    if (isOpen) {
      loadApprovedStudents();
    }
  }, [isOpen]);

  const loadApprovedStudents = async () => {
    try {
      setLoadingApprovals(true);
      const { items } = await BaseCrudService.getAll<StudentApprovals>('studentapprovals');
      const approved = items.filter(item => item.status === 'approved');
      setApprovedStudents(approved);
      console.log('[CreateClassModal] ✓ Loaded', approved.length, 'approved students');
    } catch (err) {
      console.error('[CreateClassModal] Error loading approved students:', err);
      setError('Failed to load approved students');
    } finally {
      setLoadingApprovals(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownChange = (index: number, studentId: string) => {
    const newDropdowns = [...selectedStudentDropdowns];
    newDropdowns[index] = studentId;
    setSelectedStudentDropdowns(newDropdowns);
    
    // Update form data with selected student IDs (filter out empty strings)
    const selectedIds = newDropdowns.filter(id => id !== '');
    setFormData(prev => ({
      ...prev,
      assignedStudentIds: selectedIds
    }));
  };

  const addStudentDropdown = () => {
    setSelectedStudentDropdowns([...selectedStudentDropdowns, '']);
  };

  const removeStudentDropdown = (index: number) => {
    const newDropdowns = selectedStudentDropdowns.filter((_, i) => i !== index);
    setSelectedStudentDropdowns(newDropdowns);
    
    // Update form data
    const selectedIds = newDropdowns.filter(id => id !== '');
    setFormData(prev => ({
      ...prev,
      assignedStudentIds: selectedIds
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.classTitle.trim()) {
      setError('Class title is required');
      return;
    }
    if (!formData.classDescription.trim()) {
      setError('Class description is required');
      return;
    }
    if (!formData.liveClassLink.trim()) {
      setError('Live class link is required');
      return;
    }
    if (!formData.courseCategory) {
      setError('Course category is required');
      return;
    }
    if (!formData.scheduledDateTime) {
      setError('Scheduled date and time is required');
      return;
    }
    if (!formData.endingDateTime) {
      setError('Ending date and time is required');
      return;
    }
    if (!formData.assignedTeacherName) {
      setError('Teacher assignment is required');
      return;
    }
    if (formData.assignedStudentIds.length === 0) {
      setError('At least one student must be selected');
      return;
    }

    try {
      setIsLoading(true);

      // Create class record - store student IDs instead of emails
      const newClass: UpcomingClasses = {
        _id: crypto.randomUUID(),
        classTitle: formData.classTitle,
        classDescription: formData.classDescription,
        liveClassLink: formData.liveClassLink,
        courseCategory: formData.courseCategory,
        difficultyLevel: formData.difficultyLevel,
        scheduledDateTime: new Date(formData.scheduledDateTime),
        endingDateTime: new Date(formData.endingDateTime),
        assignedTeacherName: formData.assignedTeacherName,
        assignedStudentNames: formData.assignedStudentIds.join(','),
        notificationSent: false
      };

      await BaseCrudService.create('upcomingclasses', newClass);

      // Create notifications for each assigned student
      const selectedApprovedStudents = approvedStudents.filter(s =>
        formData.assignedStudentIds.includes(s._id || '')
      );

      for (const student of selectedApprovedStudents) {
        // Find the student in the users collection to get their ID
        const userRecord = students.find(u => u.email === student.email);
        if (userRecord && userRecord._id) {
          await BaseCrudService.create('notifications', {
            _id: crypto.randomUUID(),
            userId: userRecord._id,
            title: 'New Class Scheduled',
            message: `You have been assigned to "${formData.classTitle}" scheduled for ${new Date(formData.scheduledDateTime).toLocaleString()}`,
            notificationType: 'class_assignment',
            isRead: false,
            createdAt: new Date()
          });
        }
      }

      onClassCreated();
      setFormData({
        classTitle: '',
        classDescription: '',
        liveClassLink: '',
        courseCategory: '',
        difficultyLevel: 'beginner',
        scheduledDateTime: '',
        endingDateTime: '',
        assignedTeacherName: '',
        assignedStudentIds: []
      });
      setSelectedStudentDropdowns(['']);
    } catch (err) {
      console.error('[CreateClassModal] Error creating class:', err);
      setError('Failed to create class. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-foreground">
            Create New Class
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Class Title */}
          <div>
            <Label htmlFor="classTitle" className="text-foreground mb-2 block">
              Class Title *
            </Label>
            <Input
              id="classTitle"
              name="classTitle"
              value={formData.classTitle}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to Robotics"
              className="bg-gray-800 border-gray-700 text-foreground"
            />
          </div>

          {/* Class Description */}
          <div>
            <Label htmlFor="classDescription" className="text-foreground mb-2 block">
              Class Description *
            </Label>
            <Textarea
              id="classDescription"
              name="classDescription"
              value={formData.classDescription}
              onChange={handleInputChange}
              placeholder="Describe what students will learn in this class..."
              className="bg-gray-800 border-gray-700 text-foreground min-h-24"
            />
          </div>

          {/* Live Class Link */}
          <div>
            <Label htmlFor="liveClassLink" className="text-foreground mb-2 block">
              Live Class Link *
            </Label>
            <Input
              id="liveClassLink"
              name="liveClassLink"
              type="url"
              value={formData.liveClassLink}
              onChange={handleInputChange}
              placeholder="https://zoom.us/j/..."
              className="bg-gray-800 border-gray-700 text-foreground"
            />
          </div>

          {/* Course Category */}
          <div>
            <Label htmlFor="courseCategory" className="text-foreground mb-2 block">
              Course Category *
            </Label>
            <Select value={formData.courseCategory} onValueChange={(value) => handleSelectChange('courseCategory', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-foreground">
                <SelectValue placeholder="Select a course category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {courses.map(course => (
                  <SelectItem key={course._id} value={course.title || ''}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level */}
          <div>
            <Label htmlFor="difficultyLevel" className="text-foreground mb-2 block">
              Difficulty Level *
            </Label>
            <Select value={formData.difficultyLevel} onValueChange={(value) => handleSelectChange('difficultyLevel', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date & Time */}
          <div>
            <Label htmlFor="scheduledDateTime" className="text-foreground mb-2 block">
              Scheduled Date & Time *
            </Label>
            <Input
              id="scheduledDateTime"
              name="scheduledDateTime"
              type="datetime-local"
              value={formData.scheduledDateTime}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700 text-foreground"
            />
          </div>

          {/* Ending Date & Time */}
          <div>
            <Label htmlFor="endingDateTime" className="text-foreground mb-2 block">
              Ending Date & Time *
            </Label>
            <Input
              id="endingDateTime"
              name="endingDateTime"
              type="datetime-local"
              value={formData.endingDateTime}
              onChange={handleInputChange}
              className="bg-gray-800 border-gray-700 text-foreground"
            />
            <p className="text-xs text-gray-400 mt-1">The 'Join Class' button will be available until this time</p>
          </div>

          {/* Teacher Assignment */}
          <div>
            <Label htmlFor="assignedTeacherName" className="text-foreground mb-2 block">
              Assign Teacher *
            </Label>
            <Select value={formData.assignedTeacherName} onValueChange={(value) => handleSelectChange('assignedTeacherName', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-foreground">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {teachers.map(teacher => (
                  <SelectItem key={teacher._id} value={teacher.fullName || ''}>
                    {teacher.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Assignment - Dropdown Based */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Label className="text-foreground block font-semibold">
                Assign Students * ({formData.assignedStudentIds.length} selected)
              </Label>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 border border-green-500/40">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-semibold">Approved Only</span>
              </div>
            </div>

            {loadingApprovals ? (
              <div className="border border-gray-700 rounded-lg bg-gray-800 p-4 flex items-center justify-center">
                <p className="text-gray-400">Loading approved students...</p>
              </div>
            ) : approvedStudents.length === 0 ? (
              <div className="border border-gray-700 rounded-lg bg-gray-800 p-4 flex items-center justify-center">
                <p className="text-gray-400">No approved students available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedStudentDropdowns.map((selectedId, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Select value={selectedId} onValueChange={(id) => handleDropdownChange(index, id)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-foreground">
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 max-h-64">
                          <ScrollArea className="h-64">
                            {approvedStudents.map(student => (
                              <SelectItem key={student._id} value={student._id || ''}>
                                <div className="flex flex-col">
                                  <span>{student.fullName}</span>
                                  <span className="text-xs text-gray-400">{student.email}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedStudentDropdowns.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStudentDropdown(index)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Add Student Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addStudentDropdown}
                  className="w-full border-primary/50 text-primary hover:bg-primary/10 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Student
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Class'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
