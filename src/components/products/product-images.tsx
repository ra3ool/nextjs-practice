'use client';

import { ImageWithLoader } from '@/components/image-with-loader';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const PREFETCH_COUNT = 4;

function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 md:h-[450px] rounded-lg overflow-hidden">
        <ImageWithLoader
          src={images[current]}
          alt="product image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={current === 0}
          className="object-contain rounded-lg"
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {images.map((image, index) => (
            <div
              className={cn(
                'relative w-16 h-16 md:w-20 md:h-20 cursor-pointer border-2 rounded-md overflow-hidden',
                current === index ? 'border-blue-500' : 'border-transparent',
              )}
              key={index}
              onClick={() => setCurrent(index)}
            >
              <ImageWithLoader
                src={image}
                alt={`thumbnail ${index + 1}`}
                fill
                sizes="64px"
                priority={index < PREFETCH_COUNT}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { ProductImages };
