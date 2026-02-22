import { useState, useMemo } from 'react';
import { Meetings } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Link as LinkIcon, Search, Filter } from 'lucide-react';
import { 
  convertUTCToLocalDate, 
  formatDateForDisplay,
  isDateInFuture,
  compareDates
} from '@/lib/dateNormalization';

interface GlobalMeetingCalendarProps {
  meetings: Meetings[];
  onMeetingClick?: (meeting: Meetings) => void;
  onCancelMeeting?: (meetingId: string) => Promise<void>;
  onRescheduleMeeting?: (meetingId: string) => Promise<void>;
}

export function GlobalMeetingCalendar({
  meetings,
  onMeetingClick,
  onCancelMeeting,
  onRescheduleMeeting
}: GlobalMeetingCalendarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');

  // Get unique teachers
  const teachers = useMemo(() => {
    const unique = new Set(meetings.map(m => m.teacherId).filter(Boolean));
    return Array.from(unique);
  }, [meetings]);

  // Filter and search meetings
  const filteredMeetings = useMemo(() => {
    let filtered = [...meetings];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => {
        if (filterStatus === 'upcoming') {
          return isDateInFuture(m.startTime);
        } else if (filterStatus === 'completed') {
          return !isDateInFuture(m.startTime);
        } else if (filterStatus === 'cancelled') {
          return m.batchId === null; // Placeholder for cancelled status
        }
        return true;
      });
    }

    // Filter by teacher
    if (selectedTeacher !== 'all') {
      filtered = filtered.filter(m => m.teacherId === selectedTeacher);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(m =>
        (m.title || m.meetingTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date
    return filtered.sort((a, b) => compareDates(a.startTime, b.startTime));
  }, [meetings, filterStatus, selectedTeacher, searchTerm]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Meetings[]> = {};

    filteredMeetings.forEach(meeting => {
      const date = meeting.startTime
        ? formatDateForDisplay(meeting.startTime, 'full')
        : 'No Date';

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(meeting);
    });

    return groups;
  }, [filteredMeetings]);

  // Calculate statistics
  const stats = useMemo(() => {
    const upcoming = meetings.filter(m => isDateInFuture(m.startTime)).length;

    return {
      total: meetings.length,
      upcoming,
      completed: meetings.length - upcoming
    };
  }, [meetings]);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="text-sm text-gray-400">Total Meetings</div>
          <div className="text-3xl font-heading font-bold text-foreground mt-2">{stats.total}</div>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="text-sm text-gray-400">Upcoming</div>
          <div className="text-3xl font-heading font-bold text-primary mt-2">{stats.upcoming}</div>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="text-sm text-gray-400">Completed</div>
          <div className="text-3xl font-heading font-bold text-green-400 mt-2">{stats.completed}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-800 p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-foreground"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="text-sm text-gray-400 block mb-2">Status</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(status => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className={filterStatus === status ? 'bg-primary hover:bg-primary/90' : 'border-gray-700'}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Teacher Filter */}
            <div className="flex-1">
              <label className="text-sm text-gray-400 block mb-2">Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded text-foreground px-3 py-2"
              >
                <option value="all">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher} value={teacher}>
                    {teacher || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Meetings List */}
      {filteredMeetings.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No meetings found</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateMeetings]) => (
            <div key={date}>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {date}
              </h3>

              <div className="space-y-3">
                {dateMeetings.map((meeting) => (
                  <Card
                    key={meeting._id}
                    onClick={() => onMeetingClick?.(meeting)}
                    className="bg-gray-900/50 border-gray-800 p-4 hover:border-primary/50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-foreground mb-2">
                          {meeting.title || meeting.meetingTitle || 'Untitled Meeting'}
                        </h4>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            {meeting.startTime && (
                              <span>
                                {convertUTCToLocalDate(meeting.startTime)?.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                {meeting.endTime && (
                                  <>
                                    {' - '}
                                    {convertUTCToLocalDate(meeting.endTime)?.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          {meeting.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{meeting.location}</span>
                            </div>
                          )}

                          {meeting.description && (
                            <p className="text-sm text-gray-400 mt-2">{meeting.description}</p>
                          )}

                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                              {meeting.batchId ? 'Batch' : 'General'}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              Teacher: {meeting.teacherId || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {meeting.meetingLink && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition"
                          >
                            <LinkIcon className="w-3 h-3" />
                            Join
                          </a>
                        )}

                        <div className="flex gap-2">
                          {onCancelMeeting && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCancelMeeting(meeting._id);
                              }}
                              className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                            >
                              Cancel
                            </Button>
                          )}

                          {onRescheduleMeeting && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRescheduleMeeting(meeting._id);
                              }}
                              className="border-gray-700 text-gray-400 hover:bg-gray-800"
                            >
                              Reschedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
