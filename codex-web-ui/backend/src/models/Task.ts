export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  INTERRUPTED = 'interrupted',
  ROLLED_BACK = 'rolled_back'
}

export enum TaskType {
  CODE_GENERATION = 'code_generation',
  CODE_MODIFICATION = 'code_modification',
  CODE_ANALYSIS = 'code_analysis',
  CUSTOM = 'custom'
}

export interface FileChange {
  path: string;
  operation: 'create' | 'modify' | 'delete';
  diff?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Task {
  id: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: Date;
  scheduledFor: Date | null;
  completedAt: Date | null;
  approvalMode: 'manual' | 'auto' | 'semi-auto';
  output: string;
  changes: FileChange[];
}

export interface Interaction {
  id: string;
  taskId: string;
  type: 'confirmation' | 'input' | 'choice';
  message: string;
  options?: string[];
  response?: string;
  timestamp: Date;
}