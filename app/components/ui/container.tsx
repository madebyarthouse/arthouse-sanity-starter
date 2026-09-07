import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={cn(
        'mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}
