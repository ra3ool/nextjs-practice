'use client';

import { CART_STEPS_INFO, CART_STEPS_MAP } from '@/constants/cart.constants';
import { useCart } from '@/contexts/cart.context';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, memo, useCallback, useEffect, useMemo } from 'react';

const CheckoutSteps = memo(({ className }: { className?: string }) => {
  const { currentStep, setCurrentStep } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const stepFromPath = useMemo(
    () => CART_STEPS_MAP[pathname] || '',
    [pathname],
  );

  const currentIndex = useMemo(
    () =>
      CART_STEPS_INFO.findIndex((step) => step.name === (currentStep || '')),
    [currentStep],
  );

  const goToRoute = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  useEffect(() => {
    if (stepFromPath && stepFromPath !== currentStep) {
      setCurrentStep(stepFromPath);
    }
  }, [stepFromPath, currentStep, setCurrentStep]);

  const stepsContent = useMemo(
    () =>
      CART_STEPS_INFO.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <Fragment key={step.name}>
            {index !== 0 && (
              <hr className="shrink-0 bg-gray-600 w-0 sm:w-5 lg:w-10" />
            )}
            <span
              {...(isCompleted && { onClick: () => goToRoute(step.link) })}
              className={cn(
                'flex justify-center items-center text-center gap-2 rounded-full px-4 py-1 w-full transition-colors duration-200',
                isCompleted &&
                  'bg-emerald-100 dark:bg-emerald-900 cursor-pointer',
                isCurrent && !isCompleted && 'bg-gray-300 dark:bg-gray-600',
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {step.label}
              {isCompleted && (
                <CheckIcon className="h-4 w-4 block sm:hidden md:block" />
              )}
            </span>
          </Fragment>
        );
      }),
    [currentIndex, goToRoute],
  );

  return (
    <nav
      aria-label="Checkout steps"
      className={cn(
        'flex flex-wrap sm:flex-nowrap items-center justify-around gap-1 sm:gap-3 lg:gap-6 select-none',
        className,
      )}
    >
      {stepsContent}
    </nav>
  );
});

export { CheckoutSteps };
