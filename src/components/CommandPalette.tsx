'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { CommandActionItem } from '@/lib/types';
import CommandPaletteLayout from './CommandPaletteLayout';
import CommandPaletteMain, { type CommandPaletteMainRef } from './CommandPaletteMain';
import CreateTaskForm from './CreateTaskForm';
import TaskDetailView from './TaskDetailView';
import { toast } from 'sonner';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CommandPalette({ isOpen, setIsOpen }: CommandPaletteProps) {
  const [currentPage, setCurrentPage] = useState<'main' | 'create' | 'view'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [prefilledTitle, setPrefilledTitle] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { tasks, addTask, deleteTask, runTask } = useTaskContext();
  const mainRef = useRef<CommandPaletteMainRef>(null);

  const handleAction = (action: CommandActionItem) => {
    if (action.id === 'new-task') {
      setCurrentPage('create');
      setSearchQuery('');
      setPrefilledTitle('');
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentPage('view');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentPage('main');
      setSearchQuery('');
      setPrefilledTitle('');
      setSelectedTaskId(null);
    }, 200);
  };

  const handleCreateTask = useCallback(async (taskData: {
    title: string;
    description: string;
    triggerType: 'manual' | 'automatic';
    inputs: Array<{ name: string; defaultValue: string }>;
    files: Array<{ name: string; size: number }>;
    apps: string[];
  }) => {
    setIsCreating(true);
    try {
      await addTask(taskData);
      toast.success('Task created successfully', {
        description: taskData.title,
      });
      setCurrentPage('main');
      setSearchQuery('');
      setPrefilledTitle('');
      setSelectedTaskId(null);
      setTimeout(() => {
        mainRef.current?.focusInput();
      }, 100);
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsCreating(false);
    }
  }, [addTask]);

  const handleBackToMain = () => {
    setCurrentPage('main');
    setPrefilledTitle('');
    setSelectedTaskId(null);
    mainRef.current?.focusInput();
  };

  const handleDeleteTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted', {
        description: task?.title || 'Task removed successfully',
      });
      setCurrentPage('main');
      setPrefilledTitle('');
      setSelectedTaskId(null);
      mainRef.current?.focusInput();
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTask, tasks]);

  const handleRunTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setIsRunning(true);
    try {
      await runTask(taskId);
      toast.success('Task completed successfully', {
        description: task?.title || 'Task executed',
      });
    } catch (error) {
      console.error('Failed to run task:', error);
      toast.error('Task execution failed', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsRunning(false);
    }
  }, [runTask, tasks]);

  const handleDeleteFromMain = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted', {
        description: task?.title || 'Task removed successfully',
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task', {
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTask, tasks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        if (currentPage === 'create' || currentPage === 'view') {
          setCurrentPage('main');
          setPrefilledTitle('');
          setSelectedTaskId(null);
          setTimeout(() => {
            mainRef.current?.focusInput();
          }, 100);
        } else {
          setIsOpen(false);
          setTimeout(() => {
            setCurrentPage('main');
            setSearchQuery('');
            setPrefilledTitle('');
            setSelectedTaskId(null);
          }, 200);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, setIsOpen]);

  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  return (
    <CommandPaletteLayout isOpen={isOpen} onClose={handleClose} currentPage={currentPage}>
      {currentPage === 'main' ? (
        <CommandPaletteMain
          ref={mainRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAction={handleAction}
          onTaskSelect={handleTaskSelect}
          onRunTask={handleRunTask}
          onDeleteTask={handleDeleteFromMain}
          tasks={tasks}
        />
      ) : currentPage === 'create' ? (
        <CreateTaskForm
          onBack={handleBackToMain}
          onSubmit={handleCreateTask}
          prefilledTitle={prefilledTitle}
          isLoading={isCreating}
        />
      ) : selectedTask ? (
        <TaskDetailView
          task={selectedTask}
          onBack={handleBackToMain}
          onDelete={handleDeleteTask}
          onRun={handleRunTask}
          isDeleting={isDeleting}
          isRunning={isRunning}
        />
      ) : null}
    </CommandPaletteLayout>
  );
}
