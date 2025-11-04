import { Task } from '@/lib/types';

export interface CreateTaskInput {
  title: string;
  description: string;
  triggerType: 'manual' | 'automatic';
  inputs: Array<{ name: string; defaultValue: string }>;
  files: Array<{ name: string; size: number }>;
  apps: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  triggerType?: 'manual' | 'automatic';
  inputs?: Array<{ name: string; defaultValue: string }>;
  files?: Array<{ name: string; size: number }>;
  apps?: string[];
}

export interface TaskRunResponse {
  success: boolean;
  task: Task;
  message: string;
}

class TasksAPI {
  private baseUrl = '/api/tasks';

  async getTasks(searchQuery?: string): Promise<Task[]> {
    const url = searchQuery 
      ? `${this.baseUrl}?q=${encodeURIComponent(searchQuery)}`
      : this.baseUrl;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }

  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }

  async runTask(id: string): Promise<TaskRunResponse> {
    const response = await fetch(`${this.baseUrl}/${id}/run`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to run task');
    }
    return response.json();
  }
}

export const tasksAPI = new TasksAPI();
