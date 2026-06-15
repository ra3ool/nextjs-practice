'use client';

import { cn } from '@/lib/utils';
import { ImageOff, Loader2 } from 'lucide-react';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ImageWithLoaderProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  loaderComponent?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

function ImageWithLoader({
  src,
  alt,
  fill = true,
  sizes,
  className,
  priority,
  loaderComponent,
  errorFallback,
  ...props
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {isLoading && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          {loaderComponent || (
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          )}
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent text-gray-400">
          {errorFallback || <ImageOff className="w-8 h-8" />}
        </div>
      )}

      {!isError && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setIsError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}

export { ImageWithLoader };
