import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fallback = '/placeholder.svg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority || imageSrc) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setImageSrc(src);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load images 50px before they come into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  };

  // Create optimized src with query parameters for responsive images
  const getOptimizedSrc = (originalSrc: string, targetWidth?: number) => {
    if (!targetWidth || originalSrc.includes('http')) return originalSrc;
    
    // Add image optimization parameters if using a CDN
    // This is a placeholder - replace with your actual image service
    return `${originalSrc}?w=${targetWidth}&q=75&f=webp`;
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted transition-all duration-300',
        !isLoaded && 'animate-pulse',
        className
      )}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* Skeleton/Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer" />
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={getOptimizedSrc(imageSrc, width)}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}
      
      {/* Error fallback */}
      {hasError && imageSrc === fallback && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          Image unavailable
        </div>
      )}
      
      {/* WebP support with fallback */}
      <picture className="hidden">
        <source srcSet={getOptimizedSrc(imageSrc, width)} type="image/webp" />
        <source srcSet={imageSrc} type="image/jpeg" />
      </picture>
    </div>
  );
}