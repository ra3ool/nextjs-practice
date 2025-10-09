import { cn } from '@/lib/utils';

function ProductPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [intValue, floatValue] = value.toFixed(2).split('.');
  return (
    <span className={cn('text-xl', className)}>
      <span className="text-xs align-super">$</span>
      <span>{intValue}</span>
      <span className="text-xs align-super">.{floatValue}</span>
    </span>
  );
}

export { ProductPrice };
