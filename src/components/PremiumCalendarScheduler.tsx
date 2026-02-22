import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  date: number;
  title: string;
  type: 'class' | 'demo' | 'event';
}

interface PremiumCalendarSchedulerProps {
  events?: Event[];
  onDateSelect?: (date: number) => void;
}

export const PremiumCalendarScheduler: React.FC<PremiumCalendarSchedulerProps> = ({
  events = [],
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getEventForDate = (date: number) => {
    return events.find((e) => e.date === date);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  } as const;

  const dayVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-background to-background/80 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-orange-500/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </motion.button>

          <h2 className="font-heading text-xl text-foreground text-glow-primary">
            {monthName}
          </h2>

          <motion.button
            onClick={handleNextMonth}
            className="p-2 hover:bg-orange-500/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-paragraph text-foreground/60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => {
            const event = getEventForDate(day);
            const isSelected = selectedDate === day;

            return (
              <motion.button
                key={day}
                variants={dayVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleDateSelect(day)}
                className={`relative p-2 rounded-lg font-paragraph text-sm transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-foreground/5 text-foreground hover:bg-orange-500/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}

                {/* Event indicator */}
                {event && (
                  <motion.div
                    className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      event.type === 'class'
                        ? 'bg-orange-400'
                        : event.type === 'demo'
                          ? 'bg-orange-500'
                          : 'bg-orange-600'
                    }`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected date info */}
        {selectedDate && getEventForDate(selectedDate) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <p className="font-paragraph text-sm text-foreground/80">
              <span className="font-heading text-primary">{getEventForDate(selectedDate)?.title}</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
