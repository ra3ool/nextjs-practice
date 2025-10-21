'use client';

import {
  CART_STEPS_INFO,
  CART_STEPS_LEVEL,
  CART_STEPS_MAP,
} from '@/constants/cart.constants';
import { useCart } from '@/contexts/cart.context';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect } from 'react';

function CheckoutSteps({ className }: { className?: string }) {
  const { currentStep, setCurrentStep } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const step = CART_STEPS_MAP[pathname] || 'cart';
    setCurrentStep(step);
  }, [pathname, setCurrentStep]);

  return (
    <div
      className={cn(
        'flex flex-wrap sm:flex-nowrap items-center justify-around gap-1 sm:gap-6 select-none',
        className,
      )}
    >
      {CART_STEPS_INFO.map((step, index) => (
        <Fragment key={step.name}>
          {index !== 0 && (
            <hr className="shrink-0 bg-gray-600 w-0 sm:w-10 lg:w-20" />
          )}
          {index + 1 < CART_STEPS_LEVEL[currentStep] ? (
            <Link
              href={step.link}
              className={cn(
                'flex justify-center items-center gap-2 rounded-full px-4 py-1 w-full bg-emerald-100 dark:bg-emerald-900',
              )}
            >
              {step.label}
              <CheckIcon />
            </Link>
          ) : (
            <span
              className={cn(
                'flex justify-center items-center rounded-full px-4 py-1 w-full',
                currentStep === step.name ? 'bg-gray-300 dark:bg-gray-600' : '',
              )}
            >
              {step.label}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export { CheckoutSteps };
