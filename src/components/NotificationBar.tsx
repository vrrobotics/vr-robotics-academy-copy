import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

// Global notification store
let toastQueue: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

export const notificationService = {
  show: (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type, duration };
    toastQueue = [...toastQueue, toast];
    listeners.forEach(listener => listener(toastQueue));

    if (duration > 0) {
      setTimeout(() => {
        toastQueue = toastQueue.filter(t => t.id !== id);
        listeners.forEach(listener => listener(toastQueue));
      }, duration);
    }
  },

  subscribe: (listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  dismiss: (id: string) => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toastQueue));
  },
};

export default function NotificationBar() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-24 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 p-4 rounded-lg border flex items-center gap-3 pointer-events-auto max-w-sm ${getBgColor(toast.type)}`}
          >
            {getIcon(toast.type)}
            <p className="text-sm font-paragraph text-gray-800 flex-1">{toast.message}</p>
            <button
              onClick={() => notificationService.dismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
