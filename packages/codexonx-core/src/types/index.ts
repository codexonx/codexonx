export type CodexonxEnvironment = 'development' | 'staging' | 'production';

export type AIModelId =
  | 'codexonx-tr'
  | 'codexonx-architect'
  | 'gpt-4o'
  | 'claude-3-opus'
  | 'gemini-2-pro';

export interface AIModelDescriptor {
  id: AIModelId;
  label: string;
  provider: 'openai' | 'anthropic' | 'google' | 'codexonx';
  latencyClass: 'fast' | 'balanced' | 'thorough';
  contextLength: number;
  strengths: string[];
  limitations: string[];
}

export interface CodeAnalysisResult {
  diagnostics: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    column?: number;
    docUrl?: string;
  }>;
  optimizations: string[];
  recommendedActions: Array<{
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    referenceUrl?: string;
  }>;
  turkishSummary?: string;
  generatedAt: string;
}

export interface CollaborationPresence {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  cursor?: {
    line: number;
    column: number;
    color: string;
  };
  speaking?: boolean;
}

export type CollaborationActivityType = 'join' | 'leave' | 'cursor' | 'speaking';

export interface CollaborationActivity {
  id: string;
  userId: string;
  message: string;
  type: CollaborationActivityType;
  timestamp: string;
}

export interface CodexonxConfig {
  environment: CodexonxEnvironment;
  featureFlags: Record<string, boolean>;
  aiModels: AIModelDescriptor[];
}
