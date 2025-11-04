'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/lib/types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'lastRun'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  runTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      let existingTasks: Task[] = [];
      
      if (saved) {
        try {
          existingTasks = JSON.parse(saved);
        } catch {
          existingTasks = [];
        }
      }
      
      if (existingTasks.length === 0) {
        const sampleTasks: Task[] = [
          {
            id: '1',
            title: 'Send Weekly Newsletter',
            description: 'Automated email campaign to subscribers',
            triggerType: 'automatic',
            inputs: [{ name: 'subject', defaultValue: 'Weekly Update' }],
            files: [],
            apps: ['gmail'],
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now() - 1800000,
            lastRun: Date.now() - 86400000,
            runCount: 12,
          },
          {
            id: '2',
            title: 'Generate Monthly Report',
            description: 'Compile analytics and create PDF report',
            triggerType: 'manual',
            inputs: [{ name: 'month', defaultValue: 'Current' }],
            files: [],
            apps: ['sheets', 'drive'],
            createdAt: Date.now() - 7200000,
            updatedAt: Date.now() - 7200000,
            runCount: 0,
          },
          {
            id: '3',
            title: 'Backup Database',
            description: 'Create automated database backup to cloud storage',
            triggerType: 'automatic',
            inputs: [],
            files: [],
            apps: ['drive'],
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now() - 3600000,
            lastRun: Date.now() - 3600000,
            runCount: 45,
          },
          {
            id: '4',
            title: 'Sync Calendar Events',
            description: 'Synchronize events across multiple calendars',
            triggerType: 'automatic',
            inputs: [],
            files: [],
            apps: ['calendar'],
            createdAt: Date.now() - 10800000,
            updatedAt: Date.now() - 5400000,
            lastRun: Date.now() - 7200000,
            runCount: 8,
          },
          {
            id: '5',
            title: 'Post Social Media Update',
            description: 'Share content across social platforms',
            triggerType: 'manual',
            inputs: [{ name: 'message', defaultValue: '' }, { name: 'hashtags', defaultValue: '' }],
            files: [],
            apps: ['slack'],
            createdAt: Date.now() - 14400000,
            updatedAt: Date.now() - 14400000,
            runCount: 0,
          },
          {
            id: '6',
            title: 'Create Project Tasks',
            description: 'Import tasks from template into project board',
            triggerType: 'manual',
            inputs: [{ name: 'project', defaultValue: '' }],
            files: [],
            apps: ['trello', 'notion'],
            createdAt: Date.now() - 172800000,
            updatedAt: Date.now() - 86400000,
            lastRun: Date.now() - 86400000,
            runCount: 3,
          },
          {
            id: '7',
            title: 'Analyze GitHub Issues',
            description: 'Review and categorize open issues in repository',
            triggerType: 'manual',
            inputs: [{ name: 'repository', defaultValue: '' }],
            files: [],
            apps: ['github'],
            createdAt: Date.now() - 259200000,
            updatedAt: Date.now() - 172800000,
            runCount: 0,
          },
        ];
        
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        return sampleTasks;
      }
      
      return existingTasks;
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'lastRun'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      runCount: 0,
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const runTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        lastRun: Date.now(), 
        runCount: task.runCount + 1,
        updatedAt: Date.now() 
      } : task
    ));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, getTask, runTask }}
    >
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
