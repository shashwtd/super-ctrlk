'use client';

import { useEffect, useState, useRef } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { CommandActionItem } from '@/lib/types';
import CommandPaletteLayout from './CommandPaletteLayout';
import CommandPaletteMain, { type CommandPaletteMainRef } from './CommandPaletteMain';
import CreateTaskForm from './CreateTaskForm';
import TaskDetailView from './TaskDetailView';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CommandPalette({ isOpen, setIsOpen }: CommandPaletteProps) {
  const [currentPage, setCurrentPage] = useState<'main' | 'create' | 'view'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [prefilledTitle, setPrefilledTitle] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
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

  const handleCreateWithTitle = (title: string) => {
    setPrefilledTitle(title);
    setCurrentPage('create');
    setSearchQuery('');
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

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    triggerType: 'manual' | 'automatic';
    inputs: Array<{ name: string; defaultValue: string }>;
    files: Array<{ name: string; size: number }>;
    apps: string[];
  }) => {
    addTask(taskData);
    handleClose();
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setPrefilledTitle('');
    setSelectedTaskId(null);
    mainRef.current?.focusInput();
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    handleBackToMain();
  };

  const handleRunTask = (taskId: string) => {
    runTask(taskId);
    console.log('Task run:', taskId);
  };

  const handleDeleteFromMain = (taskId: string) => {
    deleteTask(taskId);
  };

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
          mainRef.current?.focusInput();
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
          onCreateWithTitle={handleCreateWithTitle}
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
        />
      ) : selectedTask ? (
        <TaskDetailView
          task={selectedTask}
          onBack={handleBackToMain}
          onDelete={handleDeleteTask}
          onRun={handleRunTask}
        />
      ) : null}
    </CommandPaletteLayout>
  );
}
