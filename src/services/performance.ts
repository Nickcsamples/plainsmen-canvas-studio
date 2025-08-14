import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetrics = {};

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private initialize() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    // Measure Core Web Vitals
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTFB();
  }

  private measureLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        this.reportMetric('LCP', this.metrics.lcp);
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.warn('LCP measurement failed:', error);
    }
  }

  private measureFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.fid);
        });
      });
      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.warn('FID measurement failed:', error);
    }
  }

  private measureCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.reportMetric('CLS', this.metrics.cls);
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('CLS measurement failed:', error);
    }
  }

  private measureTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
            this.reportMetric('TTFB', this.metrics.ttfb);
          }
        });
      });
      observer.observe({ type: 'navigation', buffered: true });
    } catch (error) {
      console.warn('TTFB measurement failed:', error);
    }
  }

  private reportMetric(name: string, value: number) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}:`, value);
    }

    // Send to analytics service
    try {
      if (window.gtag) {
        window.gtag('event', 'performance_metric', {
          event_category: 'Performance',
          event_label: name,
          value: Math.round(value),
          custom_map: {
            metric_name: name,
            metric_value: value,
          },
        });
      }
    } catch (error) {
      console.warn('Performance metric reporting failed:', error);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public measureResourceTiming(resourceName: string) {
    try {
      const resources = performance.getEntriesByName(resourceName);
      if (resources.length > 0) {
        const resource = resources[0];
        return {
          name: resourceName,
          duration: resource.duration,
          size: (resource as any).transferSize || 0,
          startTime: resource.startTime,
        };
      }
    } catch (error) {
      console.warn('Resource timing measurement failed:', error);
    }
    return null;
  }

  public measureCustomTiming(name: string, startTime: number) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.reportMetric(name, duration);
    return duration;
  }
}

// React hooks for performance monitoring
export function usePerformanceMonitoring() {
  const performance = PerformanceService.getInstance();

  const startTiming = useCallback(() => {
    return window.performance.now();
  }, []);

  const endTiming = useCallback((name: string, startTime: number) => {
    return performance.measureCustomTiming(name, startTime);
  }, []);

  const measureResource = useCallback((resourceName: string) => {
    return performance.measureResourceTiming(resourceName);
  }, []);

  return {
    startTiming,
    endTiming,
    measureResource,
    getMetrics: () => performance.getMetrics(),
  };
}

// Component performance measurement hook
export function useComponentPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time:`, duration);
      }
    };
  });
}

// Image loading performance hook
export function useImageLoadPerformance(imageSrc: string) {
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      const loadTime = performance.now() - startTime;
      PerformanceService.getInstance().measureCustomTiming(`image_load_${imageSrc}`, startTime);
    };

    img.onerror = () => {
      const errorTime = performance.now() - startTime;
      console.warn(`Image failed to load: ${imageSrc} (${errorTime}ms)`);
    };

    img.src = imageSrc;
  }, [imageSrc]);
}

// Export singleton instance
export const performanceService = PerformanceService.getInstance();

// Type declarations
declare global {
  interface Window {
    PerformanceObserver: any;
  }
}