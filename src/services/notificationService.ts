import { BaseCrudService } from '@/integrations';
import { Notifications } from '@/entities';

export type NotificationType = 'assignment' | 'meeting' | 'grade' | 'system' | 'announcement';

/**
 * NotificationService - Handles notification creation and management
 */
export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    relatedId?: string
  ): Promise<Notifications> {
    try {
      const notification: Notifications = {
        _id: crypto.randomUUID(),
        userId,
        title,
        message,
        notificationType: type,
        isRead: false,
        createdAt: new Date()
      };

      await BaseCrudService.create('notifications', notification);
      return notification;
    } catch (error) {
      console.error('[NotificationService] Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications for user
   */
  static async getUnreadNotifications(userId: string): Promise<Notifications[]> {
    try {
      const { items: notifications = [] } = await BaseCrudService.getAll<Notifications>('notifications');
      return notifications.filter(n => n.userId === userId && !n.isRead);
    } catch (error) {
      console.error('[NotificationService] Error getting unread notifications:', error);
      return [];
    }
  }

  /**
   * Get all notifications for user
   */
  static async getUserNotifications(userId: string, limit = 50): Promise<Notifications[]> {
    try {
      const { items: notifications = [] } = await BaseCrudService.getAll<Notifications>('notifications');
      return notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('[NotificationService] Error getting user notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await BaseCrudService.update<Notifications>('notifications', {
        _id: notificationId,
        isRead: true
      });
    } catch (error) {
      console.error('[NotificationService] Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications = await this.getUnreadNotifications(userId);
      for (const notification of notifications) {
        await this.markAsRead(notification._id);
      }
    } catch (error) {
      console.error('[NotificationService] Error marking all as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await BaseCrudService.delete('notifications', notificationId);
    } catch (error) {
      console.error('[NotificationService] Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Notify teacher about new assignment submission
   */
  static async notifyTeacherAssignmentSubmission(
    teacherId: string,
    studentName: string,
    assignmentTitle: string,
    assignmentId: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'New Assignment Submission',
      `${studentName} submitted "${assignmentTitle}"`,
      'assignment',
      assignmentId
    );
  }

  /**
   * Notify student about new assignment
   */
  static async notifyStudentNewAssignment(
    studentId: string,
    assignmentTitle: string,
    dueDate: Date,
    assignmentId: string
  ): Promise<void> {
    const dueDateStr = new Date(dueDate).toLocaleDateString();
    await this.createNotification(
      studentId,
      'New Assignment',
      `"${assignmentTitle}" is due on ${dueDateStr}`,
      'assignment',
      assignmentId
    );
  }

  /**
   * Notify student about grade
   */
  static async notifyStudentGrade(
    studentId: string,
    assignmentTitle: string,
    grade: number,
    maxPoints: number,
    assignmentId: string
  ): Promise<void> {
    const percentage = Math.round((grade / maxPoints) * 100);
    await this.createNotification(
      studentId,
      'Grade Posted',
      `You scored ${grade}/${maxPoints} (${percentage}%) on "${assignmentTitle}"`,
      'grade',
      assignmentId
    );
  }

  /**
   * Notify students about meeting
   */
  static async notifyStudentsMeeting(
    studentIds: string[],
    meetingTitle: string,
    meetingDate: Date,
    meetingId: string
  ): Promise<void> {
    const dateStr = new Date(meetingDate).toLocaleDateString();
    for (const studentId of studentIds) {
      await this.createNotification(
        studentId,
        'Meeting Scheduled',
        `"${meetingTitle}" is scheduled for ${dateStr}`,
        'meeting',
        meetingId
      );
    }
  }

  /**
   * Notify admin about system event
   */
  static async notifyAdminSystemEvent(
    adminId: string,
    eventTitle: string,
    eventDescription: string
  ): Promise<void> {
    await this.createNotification(
      adminId,
      eventTitle,
      eventDescription,
      'system'
    );
  }

  /**
   * Get notification count for user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const unread = await this.getUnreadNotifications(userId);
      return unread.length;
    } catch (error) {
      console.error('[NotificationService] Error getting unread count:', error);
      return 0;
    }
  }
}
