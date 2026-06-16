import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
}

export function Badge({ className, children, variant = 'outline', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium select-none tracking-wide",
        variant === 'primary' && "bg-white text-black",
        variant === 'secondary' && "bg-[#1a1a1a] text-foreground border border-card-border",
        variant === 'accent' && "bg-[#1a1a1a] text-foreground border border-[#2a2a2a]",
        variant === 'outline' && "border border-card-border text-secondary bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
