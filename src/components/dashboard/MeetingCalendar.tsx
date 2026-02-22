import { useMemo } from 'react';
import { Meetings } from '@/entities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Link as LinkIcon } from 'lucide-react';
import { 
  convertUTCToLocalDate, 
  formatDateForDisplay,
  isDateInFuture,
  compareDates
} from '@/lib/dateNormalization';

interface MeetingCalendarProps {
  meetings: Meetings[];
  onMeetingClick?: (meeting: Meetings) => void;
  showUpcomingOnly?: boolean;
}

export function MeetingCalendar({
  meetings,
  onMeetingClick,
  showUpcomingOnly = true
}: MeetingCalendarProps) {
  const filteredMeetings = useMemo(() => {
    if (!showUpcomingOnly) return meetings;

    return meetings.filter(m => {
      return isDateInFuture(m.startTime);
    }).sort((a, b) => {
      return compareDates(a.startTime, b.startTime);
    });
  }, [meetings, showUpcomingOnly]);

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

  if (filteredMeetings.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">
          {showUpcomingOnly ? 'No upcoming meetings' : 'No meetings scheduled'}
        </p>
      </Card>
    );
  }

  return (
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
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/10"
                    >
                      {meeting.batchId ? 'Batch' : 'General'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
