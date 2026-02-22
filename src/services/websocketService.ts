/**
 * WebSocketService - Real-time bidirectional communication
 * Handles WebSocket connections with automatic reconnection and offline support
 */

export type WebSocketMessageType =
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'batch_created'
  | 'batch_updated'
  | 'batch_deleted'
  | 'assignment_created'
  | 'assignment_updated'
  | 'assignment_deleted'
  | 'submission_created'
  | 'submission_graded'
  | 'task_created'
  | 'task_updated'
  | 'task_completed'
  | 'sync_request'
  | 'sync_response'
  | 'ping'
  | 'pong'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: Date;
  id?: string;
  userId?: string;
}

export interface WebSocketListener {
  (message: WebSocketMessage): void;
}

class WebSocketServiceClass {
  private ws: WebSocket | null = null;
  private url: string = '';
  private listeners: Map<WebSocketMessageType, Set<WebSocketListener>> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private isOnline: boolean = navigator.onLine;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 30000;
  private isConnected: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private userId: string | null = null;

  constructor() {
    this.setupEventListeners();
    this.setupOnlineOfflineHandlers();
  }

  /**
   * Setup initial event listeners
   */
  private setupEventListeners(): void {
    const messageTypes: WebSocketMessageType[] = [
      'user_created',
      'user_updated',
      'user_deleted',
      'batch_created',
      'batch_updated',
      'batch_deleted',
      'assignment_created',
      'assignment_updated',
      'assignment_deleted',
      'submission_created',
      'submission_graded',
      'task_created',
      'task_updated',
      'task_completed',
      'sync_request',
      'sync_response',
      'ping',
      'pong',
      'error'
    ];

    messageTypes.forEach(type => {
      this.listeners.set(type, new Set());
    });
  }

  /**
   * Setup online/offline handlers
   */
  private setupOnlineOfflineHandlers(): void {
    window.addEventListener('online', () => {
      console.log('[WebSocketService] Online - attempting to reconnect');
      this.isOnline = true;
      if (!this.isConnected) {
        this.reconnect();
      }
    });

    window.addEventListener('offline', () => {
      console.log('[WebSocketService] Offline - queuing messages');
      this.isOnline = false;
    });
  }

  /**
   * Connect to WebSocket server
   */
  connect(url: string, userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.url = url;
        this.userId = userId || null;

        console.log('[WebSocketService] Connecting to:', url);

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('[WebSocketService] Connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.processMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocketService] Error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocketService] Disconnected');
          this.isConnected = false;
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      } catch (error) {
        console.error('[WebSocketService] Connection failed:', error);
        reject(error);
      }
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      message.timestamp = new Date(message.timestamp);

      // Handle pong
      if (message.type === 'pong') {
        this.resetHeartbeatTimeout();
        return;
      }

      // Broadcast to listeners
      this.broadcastMessage(message);
    } catch (error) {
      console.error('[WebSocketService] Error parsing message:', error);
    }
  }

  /**
   * Broadcast message to listeners
   */
  private broadcastMessage(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          console.error('[WebSocketService] Error in listener:', error);
        }
      });
    }
  }

  /**
   * Send message
   */
  send(message: WebSocketMessage): void {
    if (!this.isOnline || !this.isConnected) {
      console.log('[WebSocketService] Offline - queuing message:', message.type);
      this.messageQueue.push(message);
      return;
    }

    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      } else {
        this.messageQueue.push(message);
      }
    } catch (error) {
      console.error('[WebSocketService] Error sending message:', error);
      this.messageQueue.push(message);
    }
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        console.log('[WebSocketService] Processing queued message:', message.type);
        this.send(message);
      }
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocketService] Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    console.log(`[WebSocketService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    setTimeout(() => {
      this.reconnect();
    }, delay);
  }

  /**
   * Reconnect to WebSocket
   */
  private reconnect(): void {
    if (!this.isOnline || this.isConnected) {
      return;
    }

    this.reconnectAttempts++;
    this.connect(this.url, this.userId || undefined).catch(error => {
      console.error('[WebSocketService] Reconnection failed:', error);
      this.attemptReconnect();
    });
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'ping',
        data: { timestamp: new Date() },
        timestamp: new Date()
      });

      // Set timeout for pong response
      this.heartbeatTimeout = setTimeout(() => {
        console.warn('[WebSocketService] Heartbeat timeout - reconnecting');
        this.disconnect();
        this.attemptReconnect();
      }, 5000);
    }, 30000);
  }

  /**
   * Reset heartbeat timeout
   */
  private resetHeartbeatTimeout(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.resetHeartbeatTimeout();
  }

  /**
   * Subscribe to message type
   */
  subscribe(messageType: WebSocketMessageType, listener: WebSocketListener): () => void {
    const listeners = this.listeners.get(messageType);
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
   * Subscribe to multiple message types
   */
  subscribeMultiple(messageTypes: WebSocketMessageType[], listener: WebSocketListener): () => void {
    const unsubscribers = messageTypes.map(type => this.subscribe(type, listener));

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.messageQueue.length;
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.messageQueue = [];
  }

  /**
   * Get listener count
   */
  getListenerCount(messageType: WebSocketMessageType): number {
    return this.listeners.get(messageType)?.size || 0;
  }

  /**
   * Send user created message
   */
  sendUserCreated(userId: string, data: any): void {
    this.send({
      type: 'user_created',
      data: { userId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send user updated message
   */
  sendUserUpdated(userId: string, data: any): void {
    this.send({
      type: 'user_updated',
      data: { userId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send user deleted message
   */
  sendUserDeleted(userId: string): void {
    this.send({
      type: 'user_deleted',
      data: { userId },
      timestamp: new Date()
    });
  }

  /**
   * Send batch created message
   */
  sendBatchCreated(batchId: string, data: any): void {
    this.send({
      type: 'batch_created',
      data: { batchId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send batch updated message
   */
  sendBatchUpdated(batchId: string, data: any): void {
    this.send({
      type: 'batch_updated',
      data: { batchId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send batch deleted message
   */
  sendBatchDeleted(batchId: string): void {
    this.send({
      type: 'batch_deleted',
      data: { batchId },
      timestamp: new Date()
    });
  }

  /**
   * Send assignment created message
   */
  sendAssignmentCreated(assignmentId: string, data: any): void {
    this.send({
      type: 'assignment_created',
      data: { assignmentId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send assignment updated message
   */
  sendAssignmentUpdated(assignmentId: string, data: any): void {
    this.send({
      type: 'assignment_updated',
      data: { assignmentId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send assignment deleted message
   */
  sendAssignmentDeleted(assignmentId: string): void {
    this.send({
      type: 'assignment_deleted',
      data: { assignmentId },
      timestamp: new Date()
    });
  }

  /**
   * Send submission graded message
   */
  sendSubmissionGraded(submissionId: string, grade: number, feedback: string): void {
    this.send({
      type: 'submission_graded',
      data: { submissionId, grade, feedback },
      timestamp: new Date()
    });
  }

  /**
   * Send task created message
   */
  sendTaskCreated(taskId: string, data: any): void {
    this.send({
      type: 'task_created',
      data: { taskId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send task updated message
   */
  sendTaskUpdated(taskId: string, data: any): void {
    this.send({
      type: 'task_updated',
      data: { taskId, ...data },
      timestamp: new Date()
    });
  }

  /**
   * Send task completed message
   */
  sendTaskCompleted(taskId: string): void {
    this.send({
      type: 'task_completed',
      data: { taskId },
      timestamp: new Date()
    });
  }

  /**
   * Send sync request
   */
  sendSyncRequest(entityType: string, entityId?: string): void {
    this.send({
      type: 'sync_request',
      data: { entityType, entityId },
      timestamp: new Date()
    });
  }
}

// Export singleton instance
export const WebSocketService = new WebSocketServiceClass();
