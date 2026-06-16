import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  children,
  variant = 'secondary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-magnetic inline-flex items-center justify-center rounded-xl font-medium cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        // Size
        size === 'sm' && "px-3 py-1.5 text-xs",
        size === 'md' && "px-5 py-2.5 text-sm",
        size === 'lg' && "px-7 py-3.5 text-base",
        // Variants
        variant === 'primary' && "bg-white text-black hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        variant === 'secondary' && "bg-card-bg text-foreground border border-card-border hover:border-[#333] hover:bg-[#1a1a1a]",
        variant === 'ghost' && "text-secondary hover:text-foreground hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
