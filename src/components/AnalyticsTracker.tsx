import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Analytics Tracker Component
 * Tracks page views and user interactions
 * Ready for Google Analytics 4 integration
 */
export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    const trackPageView = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: location.pathname,
          page_title: document.title,
        });
      }
    };

    trackPageView();
  }, [location]);

  return null;
};

/**
 * Global event tracking helper
 * Usage: trackEvent('button_click', { button_name: 'book_demo' })
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData || {});
  }
};

/**
 * Track conversion events
 * Usage: trackConversion('demo_booked', { value: 0 })
 */
export const trackConversion = (conversionName: string, value?: number) => {
  trackEvent(conversionName, {
    value: value || 0,
    currency: 'USD',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user engagement
 * Usage: trackEngagement('video_watched', { video_id: '123', duration: 120 })
 */
export const trackEngagement = (engagementType: string, data?: Record<string, any>) => {
  trackEvent(`engagement_${engagementType}`, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};
