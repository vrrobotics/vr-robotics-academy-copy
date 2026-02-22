import { useEffect, useState } from 'react';
import { RealtimeService, RealtimeEvent } from '@/services/realtimeService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  event?: RealtimeEvent;
}

export function RealtimeNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Subscribe to all real-time events
    const unsubscribe = RealtimeService.subscribeMultiple(
      [
        'assignment_created',
        'assignment_updated',
        'meeting_created',
        'meeting_updated',
        'meeting_cancelled',
        'grade_posted',
        'batch_created',
        'batch_updated',
        'enrollment_changed',
        'notification_received'
      ],
      (event: RealtimeEvent) => {
        const notification = createNotificationFromEvent(event);
        addNotification(notification);
      }
    );

    return () => unsubscribe();
  }, []);

  const createNotificationFromEvent = (event: RealtimeEvent): Notification => {
    const baseNotification = {
      id: event.id || crypto.randomUUID(),
      timestamp: event.timestamp,
      event
    };

    switch (event.type) {
      case 'assignment_created':
        return {
          ...baseNotification,
          type: 'info',
          title: 'New Assignment',
          message: `A new assignment has been created: ${event.data?.title || 'Untitled'}`
        };

      case 'assignment_updated':
        return {
          ...baseNotification,
          type: 'info',
          title: 'Assignment Updated',
          message: `Assignment has been updated: ${event.data?.title || 'Untitled'}`
        };

      case 'meeting_created':
        return {
          ...baseNotification,
          type: 'info',
          title: 'New Meeting',
          message: `Meeting scheduled: ${event.data?.title || 'Untitled'}`
        };

      case 'meeting_updated':
        return {
          ...baseNotification,
          type: 'info',
          title: 'Meeting Updated',
          message: `Meeting details have been updated`
        };

      case 'meeting_cancelled':
        return {
          ...baseNotification,
          type: 'warning',
          title: 'Meeting Cancelled',
          message: `Meeting has been cancelled${event.data?.reason ? ': ' + event.data.reason : ''}`
        };

      case 'grade_posted':
        return {
          ...baseNotification,
          type: 'success',
          title: 'Grade Posted',
          message: `You received a grade: ${event.data?.grade}/${event.data?.maxPoints}`
        };

      case 'batch_created':
        return {
          ...baseNotification,
          type: 'success',
          title: 'Batch Created',
          message: `New batch created: ${event.data?.batchName || 'Untitled'}`
        };

      case 'batch_updated':
        return {
          ...baseNotification,
          type: 'info',
          title: 'Batch Updated',
          message: `Batch has been updated`
        };

      case 'enrollment_changed':
        return {
          ...baseNotification,
          type: 'info',
          title: 'Enrollment Changed',
          message: `Your enrollment status has changed to: ${event.data?.status}`
        };

      case 'notification_received':
        return {
          ...baseNotification,
          type: 'info',
          title: event.data?.title || 'Notification',
          message: event.data?.message || 'You have a new notification'
        };

      default:
        return {
          ...baseNotification,
          type: 'info',
          title: 'Update',
          message: 'An update has occurred'
        };
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500/30';
      case 'error':
        return 'bg-red-900/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/30';
      case 'info':
      default:
        return 'bg-blue-900/20 border-blue-500/30';
    }
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 right-4 z-50 max-w-md space-y-3">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border ${getBgColor(notification.type)} p-4 backdrop-blur-sm`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-foreground text-sm">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.message}
                  </p>
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-foreground transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Notification Bell Icon Component
 */
export function NotificationBell({ unreadCount = 0 }: { unreadCount?: number }) {
  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-400 hover:text-foreground transition cursor-pointer" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </div>
  );
}
