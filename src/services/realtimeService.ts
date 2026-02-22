/**
 * RealtimeService - Handles real-time updates and notifications
 * Uses event-based architecture for instant sync across portals
 */

export type RealtimeEventType = 
  | 'assignment_created'
  | 'assignment_updated'
  | 'meeting_created'
  | 'meeting_updated'
  | 'meeting_cancelled'
  | 'grade_posted'
  | 'batch_created'
  | 'batch_updated'
  | 'enrollment_changed'
  | 'user_status_changed'
  | 'notification_received';

export interface RealtimeEvent {
  type: RealtimeEventType;
  userId?: string;
  data: any;
  timestamp: Date;
  id?: string;
}

export interface RealtimeListener {
  (event: RealtimeEvent): void;
}

class RealtimeServiceClass {
  private listeners: Map<RealtimeEventType, Set<RealtimeListener>> = new Map();
  private messageQueue: RealtimeEvent[] = [];
  private isOnline: boolean = navigator.onLine;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor() {
    this.setupEventListeners();
    this.setupOnlineOfflineHandlers();
  }

  /**
   * Setup initial event listeners
   */
  private setupEventListeners(): void {
    // Initialize event type maps
    const eventTypes: RealtimeEventType[] = [
      'assignment_created',
      'assignment_updated',
      'meeting_created',
      'meeting_updated',
      'meeting_cancelled',
      'grade_posted',
      'batch_created',
      'batch_updated',
      'enrollment_changed',
      'user_status_changed',
      'notification_received'
    ];

    eventTypes.forEach(type => {
      this.listeners.set(type, new Set());
    });
  }

  /**
   * Setup online/offline handlers
   */
  private setupOnlineOfflineHandlers(): void {
    window.addEventListener('online', () => {
      console.log('[RealtimeService] Online - processing queued messages');
      this.isOnline = true;
      this.processMessageQueue();
      this.reconnectAttempts = 0;
    });

    window.addEventListener('offline', () => {
      console.log('[RealtimeService] Offline - queuing messages');
      this.isOnline = false;
    });
  }

  /**
   * Subscribe to real-time events
   */
  subscribe(eventType: RealtimeEventType, listener: RealtimeListener): () => void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.add(listener);
    }

    // Return unsubscribe function
    return () => {
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  /**
   * Subscribe to multiple event types
   */
  subscribeMultiple(eventTypes: RealtimeEventType[], listener: RealtimeListener): () => void {
    const unsubscribers = eventTypes.map(type => this.subscribe(type, listener));

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Emit real-time event
   */
  emit(event: RealtimeEvent): void {
    const eventWithId = {
      ...event,
      id: event.id || crypto.randomUUID(),
      timestamp: event.timestamp || new Date()
    };

    if (!this.isOnline) {
      console.log('[RealtimeService] Offline - queuing event:', event.type);
      this.messageQueue.push(eventWithId);
      return;
    }

    this.broadcastEvent(eventWithId);
  }

  /**
   * Broadcast event to all listeners
   */
  private broadcastEvent(event: RealtimeEvent): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('[RealtimeService] Error in listener:', error);
        }
      });
    }
  }

  /**
   * Process queued messages when back online
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const event = this.messageQueue.shift();
      if (event) {
        console.log('[RealtimeService] Processing queued event:', event.type);
        this.broadcastEvent(event);
      }
    }
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.messageQueue.length;
  }

  /**
   * Check if online
   */
  isConnected(): boolean {
    return this.isOnline;
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.messageQueue = [];
  }

  /**
   * Get listener count for event type
   */
  getListenerCount(eventType: RealtimeEventType): number {
    return this.listeners.get(eventType)?.size || 0;
  }

  /**
   * Emit assignment created event
   */
  emitAssignmentCreated(assignmentId: string, data: any): void {
    this.emit({
      type: 'assignment_created',
      data: { assignmentId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Emit assignment updated event
   */
  emitAssignmentUpdated(assignmentId: string, data: any): void {
    this.emit({
      type: 'assignment_updated',
      data: { assignmentId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Emit meeting created event
   */
  emitMeetingCreated(meetingId: string, data: any): void {
    this.emit({
      type: 'meeting_created',
      data: { meetingId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Emit meeting updated event
   */
  emitMeetingUpdated(meetingId: string, data: any): void {
    this.emit({
      type: 'meeting_updated',
      data: { meetingId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Emit meeting cancelled event
   */
  emitMeetingCancelled(meetingId: string, reason?: string): void {
    this.emit({
      type: 'meeting_cancelled',
      data: { meetingId, reason },
      timestamp: new Date()
    });
  }

  /**
   * Emit grade posted event
   */
  emitGradePosted(userId: string, assignmentId: string, grade: number, maxPoints: number): void {
    this.emit({
      type: 'grade_posted',
      userId,
      data: { assignmentId, grade, maxPoints },
      timestamp: new Date()
    });
  }

  /**
   * Emit batch created event
   */
  emitBatchCreated(batchId: string, data: any): void {
    this.emit({
      type: 'batch_created',
      data: { batchId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Emit batch updated event
   */
  emitBatchUpdated(batchId: string, data: any): void {
    this.emit({
      type: 'batch_updated',
      data: { batchId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Emit enrollment changed event
   */
  emitEnrollmentChanged(userId: string, courseId: string, status: string): void {
    this.emit({
      type: 'enrollment_changed',
      userId,
      data: { courseId, status },
      timestamp: new Date()
    });
  }

  /**
   * Emit user status changed event
   */
  emitUserStatusChanged(userId: string, status: string): void {
    this.emit({
      type: 'user_status_changed',
      userId,
      data: { status },
      timestamp: new Date()
    });
  }

  /**
   * Emit notification received event
   */
  emitNotificationReceived(userId: string, notificationId: string, data: any): void {
    this.emit({
      type: 'notification_received',
      userId,
      data: { notificationId, ...data },
      timestamp: new Date()
    });
  }
}

// Export singleton instance
export const RealtimeService = new RealtimeServiceClass();
