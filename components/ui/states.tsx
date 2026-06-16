import { Loader2, AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-10 w-10 rounded-full border border-card-border animate-ping" />
        <Loader2 className="h-7 w-7 text-foreground animate-spin" />
      </div>
      <span className="text-xs font-medium text-muted uppercase tracking-wider font-mono">{message}</span>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto p-6 border-rose-500/20 text-center flex flex-col items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-secondary leading-relaxed">{description}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </Button>
      )}
    </Card>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Nothing here',
  description = 'No results found.',
  icon = <Inbox className="h-6 w-6 text-muted" />,
}: EmptyStateProps) {
  return (
    <Card className="w-full py-16 text-center border-dashed flex flex-col items-center justify-center gap-3">
      <div className="h-12 w-12 rounded-xl bg-white/[0.02] border border-card-border flex items-center justify-center mb-1">
        {icon}
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{title}</h3>
        <p className="text-[10px] text-muted leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
