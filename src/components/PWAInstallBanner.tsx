import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallBanner() {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isInstallable || !isVisible) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-background border shadow-lg md:max-w-md md:left-auto md:right-4">
      <div className="flex items-center gap-3">
        <Download className="h-6 w-6 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Install Canvas Studio</h3>
          <p className="text-xs text-muted-foreground">
            Install our app for a better experience with offline access
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss install banner"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={installApp}
            className="whitespace-nowrap"
          >
            Install
          </Button>
        </div>
      </div>
    </Card>
  );
}