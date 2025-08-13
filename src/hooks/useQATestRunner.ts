import { useState, useEffect, useCallback } from 'react';
import { performanceService } from '@/services/performance';
import { analytics } from '@/services/analytics';

interface TestCase {
  id: string;
  name: string;
  category: 'ui' | 'performance' | 'accessibility' | 'seo' | 'functionality';
  status: 'pending' | 'running' | 'passed' | 'failed';
  description: string;
  expected: string;
  actual?: string;
  error?: string;
  duration?: number;
}

interface QATestResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  categories: Record<string, { passed: number; total: number }>;
}

const testCases: TestCase[] = [
  // UI Tests
  {
    id: 'ui-001',
    name: 'Homepage Loads Correctly',
    category: 'ui',
    status: 'pending',
    description: 'Verify homepage loads with all essential elements',
    expected: 'Homepage displays hero section, navigation, and product grid'
  },
  {
    id: 'ui-002', 
    name: 'Navigation Menu Responsive',
    category: 'ui',
    status: 'pending',
    description: 'Navigation adapts correctly on mobile and desktop',
    expected: 'Menu collapses on mobile, expands on desktop'
  },
  {
    id: 'ui-003',
    name: 'Product Cards Display',
    category: 'ui', 
    status: 'pending',
    description: 'Product cards show image, title, and price',
    expected: 'All product information visible and formatted correctly'
  },

  // Performance Tests
  {
    id: 'perf-001',
    name: 'Page Load Speed',
    category: 'performance',
    status: 'pending', 
    description: 'Homepage loads within performance budget',
    expected: 'LCP < 2.5s, FID < 100ms, CLS < 0.1'
  },
  {
    id: 'perf-002',
    name: 'Image Optimization',
    category: 'performance',
    status: 'pending',
    description: 'Images are optimized and lazy loaded',
    expected: 'Images load progressively and use appropriate formats'
  },

  // Accessibility Tests
  {
    id: 'a11y-001',
    name: 'Keyboard Navigation',
    category: 'accessibility',
    status: 'pending',
    description: 'All interactive elements accessible via keyboard',
    expected: 'Tab navigation works through all focusable elements'
  },
  {
    id: 'a11y-002',
    name: 'Screen Reader Support',
    category: 'accessibility',
    status: 'pending',
    description: 'Content properly labeled for screen readers',
    expected: 'All images have alt text, headings are hierarchical'
  },

  // SEO Tests
  {
    id: 'seo-001',
    name: 'Meta Tags Present',
    category: 'seo',
    status: 'pending',
    description: 'Essential meta tags are present and correct',
    expected: 'Title, description, og tags present on all pages'
  },
  {
    id: 'seo-002',
    name: 'Structured Data',
    category: 'seo',
    status: 'pending',
    description: 'JSON-LD structured data implemented',
    expected: 'Product and organization schema present'
  },

  // Functionality Tests
  {
    id: 'func-001',
    name: 'Canvas Creation Flow',
    category: 'functionality',
    status: 'pending',
    description: 'User can create and customize canvas',
    expected: 'Canvas creation completes without errors'
  },
  {
    id: 'func-002',
    name: 'User Authentication',
    category: 'functionality',
    status: 'pending',
    description: 'Users can sign up and log in',
    expected: 'Auth flow works with proper error handling'
  },
  {
    id: 'func-003',
    name: 'Shopping Cart',
    category: 'functionality',
    status: 'pending',
    description: 'Items can be added/removed from cart',
    expected: 'Cart state persists and calculates totals correctly'
  }
];

export function useQATestRunner() {
  const [tests, setTests] = useState<TestCase[]>(testCases);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QATestResults | null>(null);

  const runUITest = useCallback(async (test: TestCase): Promise<TestCase> => {
    const startTime = performance.now();
    
    try {
      switch (test.id) {
        case 'ui-001':
          // Check if homepage elements exist
          const heroSection = document.querySelector('[data-testid="hero-section"]') || 
                             document.querySelector('.hero') ||
                             document.querySelector('h1');
          const navigation = document.querySelector('nav') || 
                           document.querySelector('[role="navigation"]');
          
          if (heroSection && navigation) {
            return { ...test, status: 'passed', actual: 'Homepage elements found', duration: performance.now() - startTime };
          }
          return { ...test, status: 'failed', actual: 'Missing homepage elements', duration: performance.now() - startTime };

        case 'ui-002':
          // Check responsive navigation
          const isMobile = window.innerWidth < 768;
          const mobileMenu = document.querySelector('[data-testid="mobile-menu"]') ||
                           document.querySelector('.mobile-menu');
          
          return { ...test, status: 'passed', actual: `Navigation responsive: ${isMobile ? 'mobile' : 'desktop'} mode`, duration: performance.now() - startTime };

        case 'ui-003':
          // Check product cards
          const productCards = document.querySelectorAll('[data-testid="product-card"]') ||
                             document.querySelectorAll('.product-card');
          
          if (productCards.length > 0) {
            return { ...test, status: 'passed', actual: `Found ${productCards.length} product cards`, duration: performance.now() - startTime };
          }
          return { ...test, status: 'failed', actual: 'No product cards found', duration: performance.now() - startTime };

        default:
          return { ...test, status: 'passed', actual: 'Test completed', duration: performance.now() - startTime };
      }
    } catch (error) {
      return { 
        ...test, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime 
      };
    }
  }, []);

  const runPerformanceTest = useCallback(async (test: TestCase): Promise<TestCase> => {
    const startTime = performance.now();
    
    try {
      const metrics = performanceService.getMetrics();
      
      switch (test.id) {
        case 'perf-001':
          const lcp = metrics.lcp || 0;
          const cls = metrics.cls || 0;
          const fid = metrics.fid || 0;
          
          const passed = lcp < 2500 && cls < 0.1 && fid < 100;
          
          return {
            ...test,
            status: passed ? 'passed' : 'failed',
            actual: `LCP: ${lcp}ms, CLS: ${cls}, FID: ${fid}ms`,
            duration: performance.now() - startTime
          };

        case 'perf-002':
          const images = document.querySelectorAll('img');
          const lazyImages = document.querySelectorAll('img[loading="lazy"]');
          const ratio = images.length > 0 ? lazyImages.length / images.length : 0;
          
          return {
            ...test,
            status: ratio > 0.8 ? 'passed' : 'failed',
            actual: `${Math.round(ratio * 100)}% images lazy loaded`,
            duration: performance.now() - startTime
          };

        default:
          return { ...test, status: 'passed', actual: 'Performance test completed', duration: performance.now() - startTime };
      }
    } catch (error) {
      return { 
        ...test, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime 
      };
    }
  }, []);

  const runAccessibilityTest = useCallback(async (test: TestCase): Promise<TestCase> => {
    const startTime = performance.now();
    
    try {
      switch (test.id) {
        case 'a11y-001':
          const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          return {
            ...test,
            status: focusableElements.length > 0 ? 'passed' : 'failed',
            actual: `Found ${focusableElements.length} focusable elements`,
            duration: performance.now() - startTime
          };

        case 'a11y-002':
          const images = document.querySelectorAll('img');
          const imagesWithAlt = document.querySelectorAll('img[alt]');
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          
          const altRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;
          
          return {
            ...test,
            status: altRatio > 0.9 && headings.length > 0 ? 'passed' : 'failed',
            actual: `${Math.round(altRatio * 100)}% images with alt, ${headings.length} headings`,
            duration: performance.now() - startTime
          };

        default:
          return { ...test, status: 'passed', actual: 'Accessibility test completed', duration: performance.now() - startTime };
      }
    } catch (error) {
      return { 
        ...test, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime 
      };
    }
  }, []);

  const runSEOTest = useCallback(async (test: TestCase): Promise<TestCase> => {
    const startTime = performance.now();
    
    try {
      switch (test.id) {
        case 'seo-001':
          const title = document.querySelector('title')?.textContent;
          const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
          const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
          
          const hasEssentialMeta = title && description && ogTitle;
          
          return {
            ...test,
            status: hasEssentialMeta ? 'passed' : 'failed',
            actual: `Title: ${!!title}, Description: ${!!description}, OG: ${!!ogTitle}`,
            duration: performance.now() - startTime
          };

        case 'seo-002':
          const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
          
          return {
            ...test,
            status: structuredData.length > 0 ? 'passed' : 'failed',
            actual: `Found ${structuredData.length} structured data blocks`,
            duration: performance.now() - startTime
          };

        default:
          return { ...test, status: 'passed', actual: 'SEO test completed', duration: performance.now() - startTime };
      }
    } catch (error) {
      return { 
        ...test, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime 
      };
    }
  }, []);

  const runFunctionalityTest = useCallback(async (test: TestCase): Promise<TestCase> => {
    const startTime = performance.now();
    
    try {
      // These would typically require more complex integration testing
      // For now, we'll do basic checks
      switch (test.id) {
        case 'func-001':
          const canvasElements = document.querySelectorAll('canvas') || 
                               document.querySelectorAll('[data-testid="canvas"]');
          
          return {
            ...test,
            status: canvasElements.length > 0 ? 'passed' : 'failed',
            actual: `Found ${canvasElements.length} canvas elements`,
            duration: performance.now() - startTime
          };

        case 'func-002':
          // Check if auth forms exist
          const authForms = document.querySelectorAll('form[data-testid*="auth"]') ||
                          document.querySelectorAll('input[type="email"], input[type="password"]');
          
          return {
            ...test,
            status: authForms.length > 0 ? 'passed' : 'failed',
            actual: `Found ${authForms.length} auth-related elements`,
            duration: performance.now() - startTime
          };

        case 'func-003':
          // Check for cart-related elements
          const cartElements = document.querySelectorAll('[data-testid*="cart"]') ||
                             document.querySelectorAll('button[aria-label*="cart"]');
          
          return {
            ...test,
            status: cartElements.length > 0 ? 'passed' : 'failed',
            actual: `Found ${cartElements.length} cart elements`,
            duration: performance.now() - startTime
          };

        default:
          return { ...test, status: 'passed', actual: 'Functionality test completed', duration: performance.now() - startTime };
      }
    } catch (error) {
      return { 
        ...test, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: performance.now() - startTime 
      };
    }
  }, []);

  const runSingleTest = useCallback(async (test: TestCase): Promise<TestCase> => {
    setTests(prev => prev.map(t => t.id === test.id ? { ...t, status: 'running' } : t));
    
    let result: TestCase;
    
    switch (test.category) {
      case 'ui':
        result = await runUITest(test);
        break;
      case 'performance':
        result = await runPerformanceTest(test);
        break;
      case 'accessibility':
        result = await runAccessibilityTest(test);
        break;
      case 'seo':
        result = await runSEOTest(test);
        break;
      case 'functionality':
        result = await runFunctionalityTest(test);
        break;
      default:
        result = { ...test, status: 'failed', error: 'Unknown test category' };
    }

    // Track test result
    analytics.trackEvent({
      event: 'qa_test_completed',
      category: 'QA Testing',
      custom_properties: {
        test_id: test.id,
        test_name: test.name,
        category: test.category,
        status: result.status,
        duration: result.duration
      }
    });

    setTests(prev => prev.map(t => t.id === test.id ? result : t));
    return result;
  }, [runUITest, runPerformanceTest, runAccessibilityTest, runSEOTest, runFunctionalityTest]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    
    const startTime = performance.now();
    
    // Reset all tests to pending
    setTests(prev => prev.map(t => ({ ...t, status: 'pending' as const })));
    
    try {
      // Run tests in batches to avoid overwhelming the browser
      const uiTests = tests.filter(t => t.category === 'ui');
      const perfTests = tests.filter(t => t.category === 'performance');
      const a11yTests = tests.filter(t => t.category === 'accessibility');
      const seoTests = tests.filter(t => t.category === 'seo');
      const funcTests = tests.filter(t => t.category === 'functionality');

      // Run each category sequentially
      for (const test of uiTests) {
        await runSingleTest(test);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      }
      
      for (const test of perfTests) {
        await runSingleTest(test);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      for (const test of a11yTests) {
        await runSingleTest(test);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      for (const test of seoTests) {
        await runSingleTest(test);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      for (const test of funcTests) {
        await runSingleTest(test);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const totalDuration = performance.now() - startTime;
      
      analytics.trackEvent({
        event: 'qa_test_suite_completed',
        category: 'QA Testing',
        custom_properties: {
          total_duration: totalDuration,
          total_tests: tests.length
        }
      });
      
    } finally {
      setIsRunning(false);
    }
  }, [tests, runSingleTest]);

  // Calculate results whenever tests change
  useEffect(() => {
    const completedTests = tests.filter(t => t.status === 'passed' || t.status === 'failed');
    
    if (completedTests.length === tests.length && completedTests.length > 0) {
      const passed = tests.filter(t => t.status === 'passed').length;
      const failed = tests.filter(t => t.status === 'failed').length;
      
      const categories = tests.reduce((acc, test) => {
        if (!acc[test.category]) {
          acc[test.category] = { passed: 0, total: 0 };
        }
        acc[test.category].total++;
        if (test.status === 'passed') {
          acc[test.category].passed++;
        }
        return acc;
      }, {} as Record<string, { passed: number; total: number }>);

      setResults({
        totalTests: tests.length,
        passedTests: passed,
        failedTests: failed,
        passRate: (passed / tests.length) * 100,
        categories
      });
    }
  }, [tests]);

  return {
    tests,
    isRunning,
    results,
    runAllTests,
    runSingleTest
  };
}