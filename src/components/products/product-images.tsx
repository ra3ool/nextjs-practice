'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm aspect-square mx-auto">
        <Image
          src={images[current]}
          alt="product image"
          fill
          sizes="(max-width: 640px) 100vw, 350px"
          className="object-contain rounded-lg"
          priority={current === 0}
        />
      </div>

      <div className="flex space-x-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              'relative w-16 h-16 rounded-md overflow-hidden border cursor-pointer',
              current === index ? 'border-blue-500' : 'border-transparent',
            )}
          >
            <Image
              src={image}
              alt={`thumbnail ${index}`}
              fill
              sizes="64px"
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
