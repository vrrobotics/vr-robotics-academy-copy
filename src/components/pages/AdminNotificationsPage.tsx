import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Circle, Mail, Clock } from 'lucide-react';
import { messageService } from '@/services/messageService';
import { Notifications } from '@/entities';
import { format } from 'date-fns';

export default function AdminNotificationsPage() {
  const [messages, setMessages] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
    // Refresh every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const allMessages = await messageService.getAllMessages();
      setMessages(allMessages.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'read') return msg.isRead;
    return true;
  });

  const handleSelectMessage = (id: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(filteredMessages.map(m => m._id)));
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageService.markAsRead(id);
      await loadMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      await messageService.markMultipleAsRead(Array.from(selectedMessages));
      setSelectedMessages(new Set());
      await loadMessages();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await messageService.deleteMessage(id);
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await messageService.deleteMultiple(Array.from(selectedMessages));
      setSelectedMessages(new Set());
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete messages:', error);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background pt-20 sm:pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-2">
            Messages & Notifications
          </h1>
          <p className="text-foreground/60 font-paragraph">
            Manage all incoming messages and notifications
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-foreground/60 text-sm font-paragraph mb-1">Total Messages</p>
            <p className="text-3xl font-heading font-bold text-foreground">{messages.length}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-foreground/60 text-sm font-paragraph mb-1">Unread</p>
            <p className="text-3xl font-heading font-bold text-yellow-500">{unreadCount}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-foreground/60 text-sm font-paragraph mb-1">Read</p>
            <p className="text-3xl font-heading font-bold text-green-500">{messages.length - unreadCount}</p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-paragraph font-semibold transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Bulk Actions */}
        {selectedMessages.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4"
          >
            <p className="text-foreground font-paragraph">
              {selectedMessages.size} message{selectedMessages.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleMarkSelectedAsRead}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-paragraph font-semibold transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-paragraph font-semibold transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 font-paragraph">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-foreground/5 rounded-lg border border-foreground/10">
              <Mail className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/60 font-paragraph">No messages found</p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <input
                  type="checkbox"
                  checked={selectedMessages.size === filteredMessages.length && filteredMessages.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <span className="text-foreground/60 font-paragraph text-sm">
                  Select all {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Messages */}
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border transition-all ${
                    message.isRead
                      ? 'bg-foreground/5 border-foreground/10'
                      : 'bg-primary/5 border-primary/20'
                  } ${selectedMessages.has(message._id) ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedMessages.has(message._id)}
                      onChange={() => handleSelectMessage(message._id)}
                      className="w-5 h-5 rounded cursor-pointer mt-1 flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          {message.isRead ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground font-heading font-semibold truncate">
                              {message.title}
                            </h3>
                            {message.senderName && (
                              <p className="text-foreground/60 text-sm font-paragraph">
                                From: {message.senderName}
                                {message.senderEmail && ` (${message.senderEmail})`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!message.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(message._id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-paragraph font-semibold transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(message._id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-foreground/80 font-paragraph mb-3 break-words">
                        {message.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-foreground/50 font-paragraph">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {message.createdAt
                            ? format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')
                            : 'Unknown date'}
                        </div>
                        {message.notificationType && (
                          <span className="px-2 py-1 bg-foreground/10 rounded">
                            {message.notificationType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
