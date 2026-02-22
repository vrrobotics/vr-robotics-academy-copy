import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { convertUTCToLocalDate } from '@/lib/dateNormalization';

interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  description?: string;
}

interface CalendarSchedulerProps {
  meetings?: Meeting[];
  onAddMeeting?: (meeting: Meeting) => void;
  readOnly?: boolean;
}

export default function CalendarScheduler({ meetings = [], onAddMeeting, readOnly = false }: CalendarSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    meetingLink: ''
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const getMeetingsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return meetings.filter(m => {
      const mDate = convertUTCToLocalDate(m.startTime);
      return mDate && mDate.getDate() === day && 
             mDate.getMonth() === currentDate.getMonth() &&
             mDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const handleAddMeeting = () => {
    if (!selectedDate || !newMeeting.title || !newMeeting.startTime) return;

    const meeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: newMeeting.title,
      startTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${newMeeting.startTime}`),
      endTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${newMeeting.endTime}`),
      location: newMeeting.location,
      meetingLink: newMeeting.meetingLink,
    };

    onAddMeeting?.(meeting);
    setNewMeeting({ title: '', startTime: '', endTime: '', location: '', meetingLink: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl text-foreground">{monthName}</h2>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 rounded-lg bg-foreground/5 border border-foreground/10 hover:bg-foreground/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 rounded-lg bg-foreground/5 border border-foreground/10 hover:bg-foreground/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
          {!readOnly && (
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Add Meeting
            </motion.button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(216, 255, 145, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-heading text-sm text-foreground/60 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const dayMeetings = getMeetingsForDate(day);
            const isSelected = selectedDate?.getDate() === day;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            return (
              <motion.button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'bg-primary/20 border-primary'
                    : 'bg-foreground/5 border-foreground/10 hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-full flex flex-col">
                  <span className="font-heading text-sm text-foreground">{day}</span>
                  {dayMeetings.length > 0 && (
                    <div className="mt-1 flex-1 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Add Meeting Form */}
      {showAddForm && !readOnly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 145, 0.05)',
            border: '1px solid rgba(216, 255, 145, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3 className="font-heading text-lg text-foreground mb-4">
            Add Meeting for {selectedDate?.toLocaleDateString()}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Meeting Title"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background/50 border border-foreground/20 text-foreground font-paragraph focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                value={newMeeting.startTime}
                onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                className="px-4 py-2 rounded-lg bg-background/50 border border-foreground/20 text-foreground font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="time"
                value={newMeeting.endTime}
                onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                className="px-4 py-2 rounded-lg bg-background/50 border border-foreground/20 text-foreground font-paragraph focus:outline-none focus:border-primary"
              />
            </div>
            <input
              type="text"
              placeholder="Location (optional)"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background/50 border border-foreground/20 text-foreground font-paragraph focus:outline-none focus:border-primary"
            />
            <input
              type="url"
              placeholder="Meeting Link (optional)"
              value={newMeeting.meetingLink}
              onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background/50 border border-foreground/20 text-foreground font-paragraph focus:outline-none focus:border-primary"
            />
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddMeeting}
                className="flex-1 bg-primary text-primary-foreground font-heading py-2 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Meeting
              </motion.button>
              <motion.button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-foreground/10 text-foreground font-heading py-2 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Meetings List */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(216, 255, 145, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3 className="font-heading text-lg text-foreground mb-4">
            Meetings on {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {getMeetingsForDate(selectedDate.getDate()).length > 0 ? (
              getMeetingsForDate(selectedDate.getDate()).map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-foreground/5 border border-foreground/10"
                >
                  <h4 className="font-heading text-foreground mb-2">{meeting.title}</h4>
                  <div className="space-y-1 text-sm font-paragraph text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {meeting.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {meeting.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {meeting.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        {meeting.location}
                      </div>
                    )}
                    {meeting.meetingLink && (
                      <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Join Meeting
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="font-paragraph text-foreground/60 text-center py-4">No meetings scheduled</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
