import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Monitor,
  Zap,
  Eye,
  Search,
  Settings
} from 'lucide-react';
import { useQATestRunner } from '@/hooks/useQATestRunner';
import { SEO } from '@/components/SEO';

const categoryIcons = {
  ui: Monitor,
  performance: Zap,
  accessibility: Eye,
  seo: Search,
  functionality: Settings
};

const categoryColors = {
  ui: 'blue',
  performance: 'green', 
  accessibility: 'purple',
  seo: 'orange',
  functionality: 'red'
} as const;

export default function QATestingPage() {
  const { tests, isRunning, results, runAllTests, runSingleTest } = useQATestRunner();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'passed':
        return 'default' as const;
      case 'failed':
        return 'destructive' as const;
      case 'running':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <>
      <SEO 
        title="QA Testing Dashboard - Quality Assurance"
        description="Comprehensive quality assurance testing dashboard for web application testing"
        keywords="qa testing, quality assurance, web testing, automated testing"
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">QA Testing Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive quality assurance testing for your application
            </p>
          </div>
          
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            size="lg"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>

        {/* Results Summary */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.totalTests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Passed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {results.passedTests}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {results.failedTests}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pass Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(results.passRate)}%
                </div>
                <Progress value={results.passRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Results by Category */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="accessibility">A11y</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="functionality">Functionality</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {Object.entries(
                tests.reduce((acc, test) => {
                  if (!acc[test.category]) acc[test.category] = [];
                  acc[test.category].push(test);
                  return acc;
                }, {} as Record<string, typeof tests>)
              ).map(([category, categoryTests]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                
                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        <Icon className="h-5 w-5" />
                        {category} Tests
                        <Badge variant="outline" className="ml-auto">
                          {categoryTests.filter(t => t.status === 'passed').length} / {categoryTests.length} passed
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categoryTests.map((test) => (
                          <div 
                            key={test.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(test.status)}
                              <div>
                                <div className="font-medium">{test.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {test.description}
                                </div>
                                {test.actual && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Result: {test.actual}
                                  </div>
                                )}
                                {test.error && (
                                  <div className="text-xs text-red-600 mt-1">
                                    Error: {test.error}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {test.duration && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(test.duration)}ms
                                </Badge>
                              )}
                              <Badge variant={getStatusVariant(test.status)}>
                                {test.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => runSingleTest(test)}
                                disabled={isRunning || test.status === 'running'}
                              >
                                Run
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {Object.keys(categoryIcons).map((category) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {React.createElement(categoryIcons[category as keyof typeof categoryIcons], { className: 'h-5 w-5' })}
                    {category} Tests
                  </CardTitle>
                  <CardDescription>
                    {category === 'ui' && 'User interface and visual testing'}
                    {category === 'performance' && 'Performance metrics and optimization testing'}
                    {category === 'accessibility' && 'Accessibility compliance and usability testing'}
                    {category === 'seo' && 'Search engine optimization testing'}
                    {category === 'functionality' && 'Core functionality and feature testing'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tests
                      .filter(test => test.category === category)
                      .map((test) => (
                        <div 
                          key={test.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(test.status)}
                            <div className="flex-1">
                              <div className="font-medium">{test.name}</div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {test.description}
                              </div>
                              
                              <div className="text-xs space-y-1">
                                <div>
                                  <span className="font-medium">Expected:</span> {test.expected}
                                </div>
                                {test.actual && (
                                  <div>
                                    <span className="font-medium">Actual:</span> {test.actual}
                                  </div>
                                )}
                                {test.error && (
                                  <Alert className="mt-2">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>{test.error}</AlertDescription>
                                  </Alert>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {test.duration && (
                              <Badge variant="outline">
                                {Math.round(test.duration)}ms
                              </Badge>
                            )}
                            <Badge variant={getStatusVariant(test.status)}>
                              {test.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => runSingleTest(test)}
                              disabled={isRunning || test.status === 'running'}
                            >
                              {test.status === 'running' ? 'Running...' : 'Run Test'}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Testing Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Guidelines & Best Practices</CardTitle>
            <CardDescription>
              Follow these guidelines to ensure comprehensive quality assurance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  UI Testing
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Test on multiple screen sizes and devices</li>
                  <li>• Verify responsive design behavior</li>
                  <li>• Check color contrast and readability</li>
                  <li>• Validate form interactions and feedback</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance Testing
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitor Core Web Vitals (LCP, FID, CLS)</li>
                  <li>• Test loading times on slow connections</li>
                  <li>• Verify image optimization and lazy loading</li>
                  <li>• Check for memory leaks and resource usage</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Accessibility Testing
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Test keyboard navigation throughout the app</li>
                  <li>• Verify screen reader compatibility</li>
                  <li>• Check ARIA labels and semantic HTML</li>
                  <li>• Test with accessibility tools and validators</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  SEO Testing
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Validate meta tags on all pages</li>
                  <li>• Test structured data implementation</li>
                  <li>• Check URL structure and canonical tags</li>
                  <li>• Verify sitemap and robots.txt</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}