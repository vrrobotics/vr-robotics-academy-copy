import React, { useState, useEffect } from 'react';
import { Students } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Award } from 'lucide-react';

interface StudentPerformance {
  studentId: string;
  studentName: string;
  averageGrade: number;
  assignmentCount: number;
  completedAssignments: number;
  attendancePercentage: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

interface StudentPerformanceTrackerProps {
  onStudentSelect?: (student: StudentPerformance) => void;
}

export default function StudentPerformanceTracker({
  onStudentSelect
}: StudentPerformanceTrackerProps) {
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentPerformance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'grade' | 'attendance' | 'name'>('grade');
  const [isLoading, setIsLoading] = useState(true);

  // Load students
  useEffect(() => {
    loadStudents();
  }, []);

  // Filter and sort students
  useEffect(() => {
    let filtered = students;

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.studentName.toLowerCase().includes(lowerQuery) ||
        student.studentId.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'grade') return b.averageGrade - a.averageGrade;
      if (sortBy === 'attendance') return b.attendancePercentage - a.attendancePercentage;
      return a.studentName.localeCompare(b.studentName);
    });

    setFilteredStudents(filtered);
  }, [students, searchQuery, sortBy]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockStudents: StudentPerformance[] = [
        {
          studentId: 'student-1',
          studentName: 'Alice Johnson',
          averageGrade: 92,
          assignmentCount: 10,
          completedAssignments: 10,
          attendancePercentage: 95,
          trend: 'up',
          lastUpdated: new Date()
        },
        {
          studentId: 'student-2',
          studentName: 'Bob Smith',
          averageGrade: 78,
          assignmentCount: 10,
          completedAssignments: 9,
          attendancePercentage: 85,
          trend: 'stable',
          lastUpdated: new Date()
        },
        {
          studentId: 'student-3',
          studentName: 'Carol Davis',
          averageGrade: 85,
          assignmentCount: 10,
          completedAssignments: 10,
          attendancePercentage: 90,
          trend: 'up',
          lastUpdated: new Date()
        }
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-500/20 text-green-400';
    if (grade >= 80) return 'bg-blue-500/20 text-blue-400';
    if (grade >= 70) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-400';
    if (attendance >= 80) return 'text-blue-400';
    if (attendance >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Award className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Student Performance</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary-foreground/10 border-primary/20 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'grade' | 'attendance' | 'name')}
          className="px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
        >
          <option value="grade">Sort by Grade</option>
          <option value="attendance">Sort by Attendance</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-400 py-8">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">No students found</div>
        ) : (
          filteredStudents.map((student) => (
            <button
              key={student.studentId}
              onClick={() => onStudentSelect?.(student)}
              className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4 hover:bg-secondary-foreground/20 transition-colors text-left"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white font-semibold">{student.studentName}</div>
                  <div className="text-gray-400 text-sm">{student.studentId}</div>
                </div>
                {getTrendIcon(student.trend)}
              </div>

              {/* Grade */}
              <div className="mb-3">
                <div className="text-gray-400 text-xs mb-1">Average Grade</div>
                <Badge className={`${getGradeColor(student.averageGrade)} border-0`}>
                  {student.averageGrade}%
                </Badge>
              </div>

              {/* Metrics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Assignments</span>
                  <span className="text-white">
                    {student.completedAssignments}/{student.assignmentCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Attendance</span>
                  <span className={`font-semibold ${getAttendanceColor(student.attendancePercentage)}`}>
                    {student.attendancePercentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-primary-foreground rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{ width: `${student.averageGrade}%` }}
                />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Students</div>
          <div className="text-2xl font-bold text-primary mt-1">{students.length}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Class Average</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {students.length > 0
              ? Math.round(students.reduce((sum, s) => sum + s.averageGrade, 0) / students.length)
              : 0}
            %
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Avg Attendance</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {students.length > 0
              ? Math.round(students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length)
              : 0}
            %
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Completion Rate</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {students.length > 0
              ? Math.round(
                  (students.reduce((sum, s) => sum + s.completedAssignments, 0) /
                    students.reduce((sum, s) => sum + s.assignmentCount, 0)) *
                    100
                )
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
}
