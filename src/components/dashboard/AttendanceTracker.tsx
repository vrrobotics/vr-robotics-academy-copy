import React, { useState, useEffect } from 'react';
import { AttendanceRecords } from '@/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Calendar } from 'lucide-react';

interface AttendanceTrackerProps {
  batchId?: string;
  onAttendanceUpdate?: (records: AttendanceRecords[]) => void;
}

export default function AttendanceTracker({
  batchId,
  onAttendanceUpdate
}: AttendanceTrackerProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecords[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load attendance records
  useEffect(() => {
    loadAttendanceRecords();
  }, [selectedDate]);

  const loadAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockRecords: AttendanceRecords[] = [
        {
          _id: '1',
          attendanceDate: new Date(selectedDate),
          studentName: 'Alice Johnson',
          batchIdentifier: batchId || 'batch-1',
          attendanceStatus: 'present',
          teacherNotes: ''
        },
        {
          _id: '2',
          attendanceDate: new Date(selectedDate),
          studentName: 'Bob Smith',
          batchIdentifier: batchId || 'batch-1',
          attendanceStatus: 'present',
          teacherNotes: ''
        },
        {
          _id: '3',
          attendanceDate: new Date(selectedDate),
          studentName: 'Carol Davis',
          batchIdentifier: batchId || 'batch-1',
          attendanceStatus: 'absent',
          teacherNotes: 'Sick'
        }
      ];
      setAttendanceRecords(mockRecords);
    } catch (error) {
      console.error('Error loading attendance records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAttendance = (recordId: string) => {
    setAttendanceRecords(records =>
      records.map(record =>
        record._id === recordId
          ? {
              ...record,
              attendanceStatus:
                record.attendanceStatus === 'present' ? 'absent' : 'present'
            }
          : record
      )
    );
  };

  const handleSaveAttendance = async () => {
    try {
      setIsSaving(true);
      // TODO: Replace with actual API call
      onAttendanceUpdate?.(attendanceRecords);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = attendanceRecords.filter(
    r => r.attendanceStatus === 'present'
  ).length;
  const absentCount = attendanceRecords.filter(
    r => r.attendanceStatus === 'absent'
  ).length;
  const attendancePercentage =
    attendanceRecords.length > 0
      ? Math.round((presentCount / attendanceRecords.length) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">Attendance Tracker</h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
          />
          <Button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Present</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{presentCount}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Absent</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{absentCount}</div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Attendance %</div>
          <div className="text-2xl font-bold text-primary mt-1">{attendancePercentage}%</div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading attendance records...</div>
        ) : attendanceRecords.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No students found</div>
        ) : (
          <div className="divide-y divide-primary/20">
            {attendanceRecords.map((record, index) => (
              <div
                key={record._id}
                className={`p-4 flex items-center justify-between ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-secondary-foreground/5'
                } hover:bg-primary/10 transition-colors`}
              >
                <div className="flex-1">
                  <div className="text-white font-medium">{record.studentName}</div>
                  {record.teacherNotes && (
                    <div className="text-gray-400 text-sm">{record.teacherNotes}</div>
                  )}
                </div>

                <button
                  onClick={() => handleToggleAttendance(record._id)}
                  className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor:
                      record.attendanceStatus === 'present'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    color:
                      record.attendanceStatus === 'present'
                        ? '#10b981'
                        : '#ef4444'
                  }}
                >
                  {record.attendanceStatus === 'present' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Present</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Absent</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() =>
            setAttendanceRecords(records =>
              records.map(r => ({ ...r, attendanceStatus: 'present' }))
            )
          }
          variant="outline"
          className="flex-1 border-primary/30 text-gray-300 hover:bg-primary/10"
        >
          Mark All Present
        </Button>
        <Button
          onClick={() =>
            setAttendanceRecords(records =>
              records.map(r => ({ ...r, attendanceStatus: 'absent' }))
            )
          }
          variant="outline"
          className="flex-1 border-primary/30 text-gray-300 hover:bg-primary/10"
        >
          Mark All Absent
        </Button>
      </div>
    </div>
  );
}
