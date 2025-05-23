// Task related types
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
  createdAt: string;
  scheduledFor: string | null;
  completedAt: string | null;
  approvalMode: 'manual' | 'auto' | 'semi-auto';
  output: string;
  changes: FileChange[];
}

export interface CreateTaskRequest {
  description: string;
  type: TaskType;
  scheduledFor?: string;
  approvalMode?: 'manual' | 'auto' | 'semi-auto';
}

// File related types
export interface FileItem {
  path: string;
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: string;
}

export interface FileContent {
  path: string;
  content: string;
  modifiedTime: string;
}

// Interaction related types
export enum InteractionType {
  CONFIRMATION = 'confirmation',
  INPUT = 'input',
  CHOICE = 'choice'
}

export interface Interaction {
  id: string;
  taskId: string;
  type: InteractionType;
  message: string;
  options?: string[];
  response?: string;
  timestamp: string;
}

export interface InteractionResponse {
  interactionId: string;
  response: string | boolean | number;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface StatusUpdateMessage extends WebSocketMessage {
  type: 'status_update';
  status: TaskStatus;
  message: string;
  result?: any;
}

export interface OutputUpdateMessage extends WebSocketMessage {
  type: 'output_update';
  output: string;
}

export interface InteractionRequestMessage extends WebSocketMessage {
  type: 'interaction_request';
  interaction: Interaction;
}

export interface InteractionProcessedMessage extends WebSocketMessage {
  type: 'interaction_processed';
  interactionId: string;
  message: string;
}