'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/lib/types';
import { tasksAPI, CreateTaskInput } from '@/lib/api/tasks';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
  runTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  searchTasks: (query: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const searchTasks = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksAPI.getTasks(query);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const addTask = async (taskData: CreateTaskInput) => {
    setError(null);
    try {
      const newTask = await tasksAPI.createTask(taskData);
      setTasks([newTask, ...tasks]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setError(null);
    try {
      const updatedTask = await tasksAPI.updateTask(id, updates);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    setError(null);
    try {
      await tasksAPI.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  const getTask = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const runTask = async (id: string) => {
    setError(null);
    try {
      const response = await tasksAPI.runTask(id);
      setTasks(tasks.map(task => task.id === id ? response.task : task));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run task');
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      isLoading, 
      error, 
      addTask, 
      updateTask, 
      deleteTask, 
      getTask, 
      runTask,
      refreshTasks,
      searchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
