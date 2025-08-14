import { analytics } from '@/services/analytics';

interface ABTest {
  id: string;
  name: string;
  variants: {
    [key: string]: {
      name: string;
      weight: number;
      active: boolean;
    };
  };
  startDate: Date;
  endDate?: Date;
  targetAudience?: {
    userType?: 'new' | 'returning' | 'all';
    location?: string[];
    device?: 'mobile' | 'desktop' | 'all';
  };
}

interface ABTestResult {
  testId: string;
  variant: string;
  userId?: string;
  timestamp: Date;
}

class ABTestingService {
  private static instance: ABTestingService;
  private activeTests: Map<string, ABTest> = new Map();
  private userVariants: Map<string, Map<string, string>> = new Map();
  private results: ABTestResult[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): ABTestingService {
    if (!ABTestingService.instance) {
      ABTestingService.instance = new ABTestingService();
    }
    return ABTestingService.instance;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('ab-testing-data');
      if (stored) {
        const data = JSON.parse(stored);
        this.userVariants = new Map(data.userVariants || []);
        this.results = data.results || [];
      }
    } catch (error) {
      console.warn('Failed to load A/B testing data:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        userVariants: Array.from(this.userVariants.entries()),
        results: this.results.slice(-1000) // Keep last 1000 results
      };
      localStorage.setItem('ab-testing-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save A/B testing data:', error);
    }
  }

  public createTest(test: ABTest): void {
    // Validate test configuration
    const totalWeight = Object.values(test.variants).reduce((sum, variant) => sum + variant.weight, 0);
    if (totalWeight !== 100) {
      throw new Error('Variant weights must sum to 100');
    }

    this.activeTests.set(test.id, test);
    console.log(`A/B Test created: ${test.name} (${test.id})`);
  }

  public getVariant(testId: string, userId?: string): string | null {
    const test = this.activeTests.get(testId);
    if (!test) return null;

    // Check if test is active
    const now = new Date();
    if (now < test.startDate || (test.endDate && now > test.endDate)) {
      return null;
    }

    // Get user identifier
    const userKey = userId || this.getUserId();
    
    // Check if user already has a variant assigned
    if (!this.userVariants.has(userKey)) {
      this.userVariants.set(userKey, new Map());
    }
    
    const userTests = this.userVariants.get(userKey)!;
    if (userTests.has(testId)) {
      return userTests.get(testId)!;
    }

    // Check target audience
    if (!this.isUserInTargetAudience(test.targetAudience)) {
      return null;
    }

    // Assign variant based on weights
    const variant = this.assignVariant(test.variants);
    userTests.set(testId, variant);
    
    // Track assignment
    this.trackResult({
      testId,
      variant,
      userId: userKey,
      timestamp: now
    });

    this.saveToStorage();
    return variant;
  }

  private assignVariant(variants: ABTest['variants']): string {
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    
    for (const [variantKey, variant] of Object.entries(variants)) {
      if (!variant.active) continue;
      
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variantKey;
      }
    }
    
    // Fallback to first active variant
    return Object.keys(variants).find(key => variants[key].active) || 'control';
  }

  private isUserInTargetAudience(targetAudience?: ABTest['targetAudience']): boolean {
    if (!targetAudience) return true;

    // Check user type
    if (targetAudience.userType && targetAudience.userType !== 'all') {
      const isReturning = this.isReturningUser();
      if (targetAudience.userType === 'new' && isReturning) return false;
      if (targetAudience.userType === 'returning' && !isReturning) return false;
    }

    // Check device type
    if (targetAudience.device && targetAudience.device !== 'all') {
      const isMobile = this.isMobileDevice();
      if (targetAudience.device === 'mobile' && !isMobile) return false;
      if (targetAudience.device === 'desktop' && isMobile) return false;
    }

    return true;
  }

  private isReturningUser(): boolean {
    return localStorage.getItem('user-visit-count') ? 
      parseInt(localStorage.getItem('user-visit-count') || '0') > 1 : false;
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private getUserId(): string {
    let userId = localStorage.getItem('ab-user-id');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ab-user-id', userId);
    }
    return userId;
  }

  private trackResult(result: ABTestResult): void {
    this.results.push(result);
    
    // Send to analytics
    analytics.trackEvent({
      event: 'ab_test_assignment',
      category: 'A/B Testing',
      custom_properties: {
        test_id: result.testId,
        variant: result.variant,
        user_id: result.userId,
        timestamp: result.timestamp.toISOString()
      }
    });
  }

  public trackConversion(testId: string, conversionType: string, value?: number): void {
    const userKey = this.getUserId();
    const userTests = this.userVariants.get(userKey);
    const variant = userTests?.get(testId);
    
    if (!variant) return;

    analytics.trackEvent({
      event: 'ab_test_conversion',
      category: 'A/B Testing',
      custom_properties: {
        test_id: testId,
        variant: variant,
        conversion_type: conversionType,
        value: value,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`A/B Test Conversion: ${testId} - ${variant} - ${conversionType}`);
  }

  public getActiveTests(): ABTest[] {
    const now = new Date();
    return Array.from(this.activeTests.values()).filter(test => 
      now >= test.startDate && (!test.endDate || now <= test.endDate)
    );
  }

  public stopTest(testId: string): void {
    const test = this.activeTests.get(testId);
    if (test) {
      test.endDate = new Date();
      console.log(`A/B Test stopped: ${test.name} (${testId})`);
    }
  }
}

// React hook for A/B testing
export function useABTest(testId: string, userId?: string) {
  const abTesting = ABTestingService.getInstance();
  const variant = abTesting.getVariant(testId, userId);

  const trackConversion = (conversionType: string, value?: number) => {
    abTesting.trackConversion(testId, conversionType, value);
  };

  return {
    variant,
    trackConversion,
    isInTest: variant !== null
  };
}

// Export singleton instance
export const abTesting = ABTestingService.getInstance();

// Example test configurations
export const exampleTests: ABTest[] = [
  {
    id: 'homepage-hero-test',
    name: 'Homepage Hero Button Text',
    variants: {
      control: { name: 'Shop Now', weight: 50, active: true },
      variant_a: { name: 'Create Canvas', weight: 50, active: true }
    },
    startDate: new Date(),
    targetAudience: { userType: 'all', device: 'all' }
  },
  {
    id: 'pricing-display-test',
    name: 'Pricing Display Format',
    variants: {
      control: { name: 'Standard Pricing', weight: 33, active: true },
      variant_a: { name: 'Bold Pricing', weight: 33, active: true },
      variant_b: { name: 'Highlight Savings', weight: 34, active: true }
    },
    startDate: new Date(),
    targetAudience: { userType: 'all', device: 'all' }
  }
];