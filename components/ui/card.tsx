import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, children, hoverEffect = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card-bg border border-card-border rounded-2xl p-6 transition-all duration-200",
        hoverEffect && "hover:border-[#2a2a2a] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
