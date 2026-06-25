// System Visualizer Elements
export interface VisualNode {
  id: string;
  label: string;
  type: 'user' | 'frontend' | 'backend' | 'api' | 'validation' | 'auth' | 'database' | 'ai' | 'analytics' | 'admin' | 'external';
  status: 'online' | 'warning' | 'offline';
  x: number;
  y: number;
  details?: Record<string, string>;
}

export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  label?: string;
  flowSpeed?: 'normal' | 'fast' | 'slow';
}

// Data Flow Steps
export interface DataFlowStep {
  sequence: number;
  nodeId: string;
  title: string;
  description: string;
  input: string;
  action: string;
  output: string;
  securityNote: string;
  latencyMs?: number;
  
  // Custom perspective overrides
  businessView?: {
    title?: string;
    description?: string;
    metric?: string;
  };
  technicalView?: {
    title?: string;
    description?: string;
    metric?: string;
  };
  recruiterView?: {
    title?: string;
    description?: string;
    metric?: string;
  };
}

export interface DataFlow {
  id: string;
  name: string;
  description: string;
  accentColor: string; // hex color e.g., '#06b6d4'
  projectSlug?: string;
  steps: DataFlowStep[];
}

// Live Telemetry Event Messages
export interface LiveEventMessage {
  id: string;
  timestamp: string;
  type: 'portfolio' | 'ask-vraj' | 'ask_vraj' | 'contact' | 'metrics' | 'github-sync' | 'github_sync' | 'cli' | 'analytics' | 'admin' | 'dashboard';
  severity: 'info' | 'success' | 'warning' | 'warn' | 'error' | 'trace';
  message: string;
  metadata?: Record<string, any>;
  is_public?: boolean;
}

// Metrics Cards and Snapshots
export interface MetricCardConfig {
  id: string;
  title: string;
  metricName: string;
  format: 'percentage' | 'ms' | 'count' | 'bytes';
  currentValue: number;
  change24h?: number;
}

export interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity
  contributionCount?: number;
  intensity?: 0 | 1 | 2 | 3 | 4;
  color?: string;
  account?: string;
  weekday?: number;
  weekIndex?: number;
}

// Security Configuration Layer
export interface SecurityLayerConfig {
  id: string;
  name: string;
  description: string;
  layerOrder: number;
  status: 'active' | 'bypassed' | 'audit';
  blockedThreatsCount: number;
  lastTriggeredAt?: string;
}

// Request Trace Pipeline Step
export interface RequestTraceStep {
  name: string;
  durationMs: number;
  status: 'success' | 'warning' | 'error';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RequestTraceRecord {
  id: string;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  totalDurationMs: number;
  steps: RequestTraceStep[];
}

// CLI Console Commands & Executions
export interface ConsoleCommandResult {
  command: string;
  output: string;
  success: boolean;
  timestamp: string;
  executionTimeMs: number;
}
