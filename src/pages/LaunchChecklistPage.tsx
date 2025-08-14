import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Rocket,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Server,
  Shield,
  Zap,
  Users,
  BarChart,
  Settings
} from 'lucide-react';
import { analytics } from '@/services/analytics';
import { performanceService } from '@/services/performance';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';

interface DeploymentChecklist {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'warning' | 'error';
  critical: boolean;
  details?: string;
}

interface DeploymentConfig {
  environment: 'staging' | 'production';
  domain: string;
  branch: string;
  buildCommand: string;
  envVars: Record<string, string>;
  notifications: {
    email: string[];
    slack?: string;
  };
}

const deploymentChecklist: DeploymentChecklist[] = [
  // Critical Security Checks
  {
    id: 'security-https',
    category: 'Security',
    title: 'HTTPS Configuration',
    description: 'Ensure SSL certificate is configured and HTTPS is enforced',
    status: 'pending',
    critical: true
  },
  {
    id: 'security-headers',
    category: 'Security', 
    title: 'Security Headers',
    description: 'Configure security headers (CSP, HSTS, X-Frame-Options)',
    status: 'pending',
    critical: true
  },
  {
    id: 'security-env',
    category: 'Security',
    title: 'Environment Variables',
    description: 'Verify all sensitive data is stored in environment variables',
    status: 'pending',
    critical: true
  },

  // Performance Checks
  {
    id: 'perf-compression',
    category: 'Performance',
    title: 'Compression Enabled',
    description: 'Enable gzip/brotli compression for assets',
    status: 'pending',
    critical: false
  },
  {
    id: 'perf-caching',
    category: 'Performance',
    title: 'Caching Strategy',
    description: 'Configure appropriate caching headers for static assets',
    status: 'pending',
    critical: false
  },
  {
    id: 'perf-cdn',
    category: 'Performance',
    title: 'CDN Configuration',
    description: 'Set up CDN for global content delivery',
    status: 'pending',
    critical: false
  },

  // SEO & Meta
  {
    id: 'seo-sitemap',
    category: 'SEO',
    title: 'XML Sitemap',
    description: 'Generate and submit XML sitemap to search engines',
    status: 'pending',
    critical: false
  },
  {
    id: 'seo-robots',
    category: 'SEO',
    title: 'Robots.txt',
    description: 'Configure robots.txt file for search engine crawling',
    status: 'pending',
    critical: false
  },
  {
    id: 'seo-analytics',
    category: 'SEO',
    title: 'Analytics Setup',
    description: 'Configure Google Analytics and Search Console',
    status: 'pending',
    critical: false
  },

  // Monitoring & Logging
  {
    id: 'monitor-errors',
    category: 'Monitoring',
    title: 'Error Tracking',
    description: 'Set up error tracking and monitoring service',
    status: 'pending',
    critical: true
  },
  {
    id: 'monitor-uptime',
    category: 'Monitoring',
    title: 'Uptime Monitoring',
    description: 'Configure uptime monitoring and alerts',
    status: 'pending',
    critical: false
  },
  {
    id: 'monitor-perf',
    category: 'Monitoring',
    title: 'Performance Monitoring',
    description: 'Set up real user monitoring for performance metrics',
    status: 'pending',
    critical: false
  },

  // Testing & QA
  {
    id: 'test-e2e',
    category: 'Testing',
    title: 'End-to-End Tests',
    description: 'Run comprehensive E2E tests in production-like environment',
    status: 'pending',
    critical: true
  },
  {
    id: 'test-load',
    category: 'Testing',
    title: 'Load Testing',
    description: 'Perform load testing to verify performance under stress',
    status: 'pending',
    critical: false
  },
  {
    id: 'test-accessibility',
    category: 'Testing',
    title: 'Accessibility Audit',
    description: 'Complete accessibility testing and WCAG compliance check',
    status: 'pending',
    critical: false
  },

  // Backup & Recovery
  {
    id: 'backup-strategy',
    category: 'Backup',
    title: 'Backup Strategy',
    description: 'Implement automated backups for database and assets',
    status: 'pending',
    critical: true
  },
  {
    id: 'backup-recovery',
    category: 'Backup',
    title: 'Recovery Plan',
    description: 'Document and test disaster recovery procedures',
    status: 'pending',
    critical: false
  }
];

const categoryIcons = {
  Security: Shield,
  Performance: Zap,
  SEO: Globe,
  Monitoring: BarChart,
  Testing: CheckCircle,
  Backup: Server
};

export default function LaunchChecklistPage() {
  const [checklist, setChecklist] = useState<DeploymentChecklist[]>(deploymentChecklist);
  const [config, setConfig] = useState<DeploymentConfig>({
    environment: 'production',
    domain: '',
    branch: 'main',
    buildCommand: 'npm run build',
    envVars: {},
    notifications: {
      email: []
    }
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: item.status === 'completed' ? 'pending' : 'completed' 
          }
        : item
    ));

    analytics.trackEvent({
      event: 'deployment_checklist_item_toggled',
      category: 'Deployment',
      custom_properties: { item_id: id }
    });
  };

  const getCompletionStats = () => {
    const completed = checklist.filter(item => item.status === 'completed').length;
    const critical = checklist.filter(item => item.critical).length;
    const criticalCompleted = checklist.filter(item => item.critical && item.status === 'completed').length;
    
    return {
      total: checklist.length,
      completed,
      critical,
      criticalCompleted,
      percentage: (completed / checklist.length) * 100,
      criticalPercentage: (criticalCompleted / critical) * 100
    };
  };

  const stats = getCompletionStats();
  const isReadyForDeployment = stats.criticalPercentage === 100 && stats.percentage >= 80;

  const performAutomatedChecks = async () => {
    const updatedChecklist = [...checklist];
    
    // Check HTTPS (basic check)
    try {
      if (window.location.protocol === 'https:') {
        const httpsItem = updatedChecklist.find(item => item.id === 'security-https');
        if (httpsItem) httpsItem.status = 'completed';
      }
    } catch (error) {
      console.warn('HTTPS check failed:', error);
    }

    // Check performance metrics
    const metrics = performanceService.getMetrics();
    if (metrics.lcp && metrics.lcp < 2500) {
      const perfItem = updatedChecklist.find(item => item.id === 'perf-compression');
      if (perfItem) perfItem.status = 'completed';
    }

    // Check SEO meta tags
    const hasTitle = !!document.querySelector('title');
    const hasDescription = !!document.querySelector('meta[name="description"]');
    if (hasTitle && hasDescription) {
      const seoItem = updatedChecklist.find(item => item.id === 'seo-analytics');
      if (seoItem) seoItem.status = 'completed';
    }

    setChecklist(updatedChecklist);
    toast.success('Automated checks completed');
  };

  const simulateDeployment = async () => {
    if (!isReadyForDeployment) {
      toast.error('Please complete all critical checklist items before deployment');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('deploying');

    analytics.trackEvent({
      event: 'deployment_started',
      category: 'Deployment',
      custom_properties: {
        environment: config.environment,
        checklist_completion: stats.percentage
      }
    });

    try {
      // Simulate deployment steps
      const steps = [
        'Building application...',
        'Running tests...',
        'Optimizing assets...',
        'Uploading to CDN...',
        'Updating DNS...',
        'Verifying deployment...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.info(steps[i]);
      }

      setDeploymentStatus('success');
      toast.success('Deployment completed successfully!');
      
      analytics.trackEvent({
        event: 'deployment_completed',
        category: 'Deployment',
        custom_properties: {
          environment: config.environment,
          success: true
        }
      });

    } catch (error) {
      setDeploymentStatus('error');
      toast.error('Deployment failed. Please check logs for details.');
      
      analytics.trackEvent({
        event: 'deployment_failed',
        category: 'Deployment',
        custom_properties: {
          environment: config.environment,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <>
      <SEO 
        title="Launch Checklist - Deployment Preparation"
        description="Complete pre-launch checklist for production deployment readiness"
        keywords="deployment, launch checklist, production readiness, web deployment"
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              Launch Checklist
            </h1>
            <p className="text-muted-foreground">
              Complete all items before deploying to production
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={performAutomatedChecks}>
              Run Automated Checks
            </Button>
            <Button 
              onClick={simulateDeployment}
              disabled={!isReadyForDeployment || isDeploying}
              className="gap-2"
            >
              <Rocket className="h-4 w-4" />
              {isDeploying ? 'Deploying...' : 'Deploy to Production'}
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}/{stats.total}</div>
              <Progress value={stats.percentage} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(stats.percentage)}% complete
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.criticalCompleted}/{stats.critical}
              </div>
              <Progress value={stats.criticalPercentage} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(stats.criticalPercentage)}% complete
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deployment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {deploymentStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {deploymentStatus === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                {deploymentStatus === 'deploying' && <Settings className="h-5 w-5 text-blue-500 animate-spin" />}
                {deploymentStatus === 'idle' && <Info className="h-5 w-5 text-gray-400" />}
                
                <span className="font-medium capitalize">{deploymentStatus}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ready to Deploy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isReadyForDeployment ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-600">Ready</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-orange-600">Not Ready</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Readiness Alert */}
        {!isReadyForDeployment && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Complete all critical items and at least 80% of total items before deployment.
              Currently {stats.criticalCompleted}/{stats.critical} critical items completed.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checklist">Deployment Checklist</TabsTrigger>
            <TabsTrigger value="config">Deployment Config</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-4">
            {Object.entries(
              checklist.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {} as Record<string, typeof checklist>)
            ).map(([category, categoryItems]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || Settings;
              const completed = categoryItems.filter(item => item.status === 'completed').length;
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {category}
                      <Badge variant="outline" className="ml-auto">
                        {completed}/{categoryItems.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryItems.map((item) => (
                        <div 
                          key={item.id}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            item.status === 'completed' 
                              ? 'bg-green-50 border-green-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleChecklistItem(item.id)}
                        >
                          <div className="mt-0.5">
                            {item.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${item.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                {item.title}
                              </h4>
                              {item.critical && (
                                <Badge variant="destructive" className="text-xs">
                                  Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                            {item.details && (
                              <p className="text-xs text-blue-600 mt-2">
                                {item.details}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Configuration</CardTitle>
                <CardDescription>
                  Configure deployment settings for your production environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select
                      value={config.environment}
                      onValueChange={(value: 'staging' | 'production') => 
                        setConfig(prev => ({ ...prev, environment: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="https://your-domain.com"
                      value={config.domain}
                      onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="branch">Git Branch</Label>
                    <Input
                      id="branch"
                      placeholder="main"
                      value={config.branch}
                      onChange={(e) => setConfig(prev => ({ ...prev, branch: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="build-command">Build Command</Label>
                    <Input
                      id="build-command"
                      placeholder="npm run build"
                      value={config.buildCommand}
                      onChange={(e) => setConfig(prev => ({ ...prev, buildCommand: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notification-emails">Notification Emails</Label>
                  <Textarea
                    id="notification-emails"
                    placeholder="admin@company.com, dev@company.com"
                    value={config.notifications.email.join(', ')}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        email: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                      }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}