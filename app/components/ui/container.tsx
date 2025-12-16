import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={clsx(
        'mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
}
