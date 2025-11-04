export interface Task {
  id: string;
  title: string;
  description: string;
  triggerType: 'manual' | 'automatic';
  inputs: Array<{ name: string; defaultValue: string }>;
  files: Array<{ name: string; size: number }>;
  apps: string[];
  createdAt: number;
  updatedAt: number;
  lastRun?: number;
  runCount: number;
}

export interface CommandActionItem {
  id: string;
  label: string;
  description?: string;
  icon: 'plus' | 'settings' | 'task';
}

export type CommandAction = 
  | 'create-task'
  | 'search-tasks'
  | 'view-task'
  | 'delete-task'
  | 'mark-complete'
  | 'change-status';

export type CommandPage = 'home' | 'create-task' | 'view-task';
