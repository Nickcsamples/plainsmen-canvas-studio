import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { cn } from '@/lib/utils';

interface AccessibleImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallback?: string;
  decorative?: boolean;
  longDescription?: string;
  captionId?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fallback,
  decorative = false,
  longDescription,
  captionId,
  onLoad,
  onError,
  ...props
}: AccessibleImageProps) {
  // For decorative images, use empty alt text
  const accessibleAlt = decorative ? '' : alt;
  
  // Generate unique ID for long description if provided
  const descriptionId = longDescription ? `img-desc-${Math.random().toString(36).substr(2, 9)}` : undefined;

  return (
    <div className={cn('relative', className)}>
        <OptimizedImage
          src={src}
          alt={accessibleAlt}
          width={width}
          height={height}
          priority={priority}
          fallback={fallback}
          onLoad={onLoad}
          onError={onError}
          aria-describedby={cn(descriptionId, captionId)}
          role={decorative ? 'presentation' : undefined}
          {...props}
        />
      
      {/* Long description for complex images */}
      {longDescription && (
        <div
          id={descriptionId}
          className="sr-only"
          aria-label="Image description"
        >
          {longDescription}
        </div>
      )}
    </div>
  );
}