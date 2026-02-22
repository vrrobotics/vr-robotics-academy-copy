import { BaseCrudService } from '@/integrations';
import { Notifications } from '@/entities';

export const messageService = {
  // Send a message (anonymous or authenticated)
  async sendMessage(
    message: string,
    title: string = 'New Message',
    senderName?: string,
    senderEmail?: string,
    notificationType: string = 'contact'
  ): Promise<Notifications> {
    const newMessage: Notifications = {
      _id: crypto.randomUUID(),
      title,
      message,
      notificationType,
      isRead: false,
      createdAt: new Date(),
      senderName,
      senderEmail,
    };

    await BaseCrudService.create('notifications', newMessage);
    return newMessage;
  },

  // Get all messages (admin only)
  async getAllMessages(): Promise<Notifications[]> {
    const { items } = await BaseCrudService.getAll<Notifications>('notifications');
    return items;
  },

  // Get unread message count
  async getUnreadCount(): Promise<number> {
    const { items } = await BaseCrudService.getAll<Notifications>('notifications');
    return items.filter(msg => !msg.isRead).length;
  },

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    await BaseCrudService.update<Notifications>('notifications', {
      _id: messageId,
      isRead: true,
    });
  },

  // Mark multiple messages as read
  async markMultipleAsRead(messageIds: string[]): Promise<void> {
    await Promise.all(
      messageIds.map(id =>
        BaseCrudService.update<Notifications>('notifications', {
          _id: id,
          isRead: true,
        })
      )
    );
  },

  // Delete message
  async deleteMessage(messageId: string): Promise<void> {
    await BaseCrudService.delete('notifications', messageId);
  },

  // Delete multiple messages
  async deleteMultiple(messageIds: string[]): Promise<void> {
    await Promise.all(
      messageIds.map(id => BaseCrudService.delete('notifications', id))
    );
  },

  // Get unread messages
  async getUnreadMessages(): Promise<Notifications[]> {
    const { items } = await BaseCrudService.getAll<Notifications>('notifications');
    return items.filter(msg => !msg.isRead);
  },
};
