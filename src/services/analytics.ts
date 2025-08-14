import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  custom_properties?: Record<string, any>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Initialize Google Analytics (replace with your GA4 tracking ID)
    const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual tracking ID
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
  }

  public trackEvent({ event, category, action, label, value, custom_properties }: AnalyticsEvent) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      // Google Analytics 4 Event
      window.gtag('event', event, {
        event_category: category,
        event_label: label,
        value: value,
        ...custom_properties,
      });

      // Custom analytics (you can add other services here)
      this.trackCustomEvent({ event, category, action, label, value, custom_properties });

    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  public trackPageView(path: string, title?: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    try {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: path,
        page_title: title || document.title,
      });
    } catch (error) {
      console.warn('Page view tracking error:', error);
    }
  }

  public trackPurchase(transactionId: string, items: any[], value: number, currency = 'USD') {
    if (!this.isInitialized) return;

    try {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.title,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    } catch (error) {
      console.warn('Purchase tracking error:', error);
    }
  }

  public trackAddToCart(item: any, value: number, currency = 'USD') {
    this.trackEvent({
      event: 'add_to_cart',
      custom_properties: {
        currency: currency,
        value: value,
        items: [{
          item_id: item.id,
          item_name: item.title,
          category: item.category,
          quantity: item.quantity || 1,
          price: item.price,
        }],
      },
    });
  }

  public trackRemoveFromCart(item: any, value: number, currency = 'USD') {
    this.trackEvent({
      event: 'remove_from_cart',
      custom_properties: {
        currency: currency,
        value: value,
        items: [{
          item_id: item.id,
          item_name: item.title,
          category: item.category,
          quantity: item.quantity || 1,
          price: item.price,
        }],
      },
    });
  }

  public trackViewItem(item: any, value?: number, currency = 'USD') {
    this.trackEvent({
      event: 'view_item',
      custom_properties: {
        currency: currency,
        value: value || item.price,
        items: [{
          item_id: item.id,
          item_name: item.title,
          category: item.category,
          price: item.price,
        }],
      },
    });
  }

  public trackSearch(searchTerm: string, resultsCount?: number) {
    this.trackEvent({
      event: 'search',
      custom_properties: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    });
  }

  public trackUserSignup(method: string) {
    this.trackEvent({
      event: 'sign_up',
      custom_properties: {
        method: method,
      },
    });
  }

  public trackUserLogin(method: string) {
    this.trackEvent({
      event: 'login',
      custom_properties: {
        method: method,
      },
    });
  }

  private trackCustomEvent({ event, category, action, label, value, custom_properties }: AnalyticsEvent) {
    // Add your custom analytics service here (e.g., Mixpanel, Amplitude, etc.)
    console.log('Custom Analytics Event:', {
      event,
      category,
      action,
      label,
      value,
      custom_properties,
      timestamp: new Date().toISOString(),
    });
  }
}

// React hook for analytics
export function useAnalytics() {
  const analytics = AnalyticsService.getInstance();

  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackRemoveFromCart: analytics.trackRemoveFromCart.bind(analytics),
    trackViewItem: analytics.trackViewItem.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackUserSignup: analytics.trackUserSignup.bind(analytics),
    trackUserLogin: analytics.trackUserLogin.bind(analytics),
  };
}

// Page view tracking hook
export function usePageTracking() {
  useEffect(() => {
    const analytics = AnalyticsService.getInstance();
    analytics.trackPageView(window.location.pathname, document.title);
  }, []);
}

// Global analytics instance
export const analytics = AnalyticsService.getInstance();

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}