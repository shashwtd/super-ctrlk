'use client';

import { Command } from 'cmdk';
import { Search, Plus, Zap } from 'lucide-react';
import { CommandActionItem, Task } from '@/lib/types';
import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import Fuse from 'fuse.js';
import Image from 'next/image';
import { getAppLogo } from '@/lib/apps';

interface CommandPaletteMainProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAction: (action: CommandActionItem) => void;
  onTaskSelect: (taskId: string) => void;
  onRunTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  tasks: Task[];
}

export interface CommandPaletteMainRef {
  focusInput: () => void;
}

const CommandPaletteMain = forwardRef<CommandPaletteMainRef, CommandPaletteMainProps>(function CommandPaletteMain({ 
  searchQuery, 
  setSearchQuery, 
  onAction,
  onTaskSelect,
  tasks 
}, ref) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }));

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part) => 
      part.toLowerCase() === query.toLowerCase() 
        ? `<mark style="background: rgba(99, 102, 241, 0.3); color: #a5b4fc; padding: 0 2px; border-radius: 2px;">${part}</mark>` 
        : part
    ).join('');
  };

  const fuse = useMemo(() => {
    return new Fuse(tasks, {
      keys: ['title', 'description', 'apps'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks.slice(0, 5);
    const results = fuse.search(searchQuery);
    return results.map(result => result.item).slice(0, 5);
  }, [searchQuery, fuse, tasks]);

  return (
    <Command
      className="bg-[#111] backdrop-blur-2xl border border-white/8 rounded-xl overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-geist-sans)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      }}
      shouldFilter={false}
      defaultValue={searchQuery ? filteredTasks[0]?.id : undefined}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 relative">
        <Search className="w-4 h-4 shrink-0" style={{ color: '#999' }} strokeWidth={2} />
        <Command.Input
          ref={inputRef}
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Type a command or search..."
          className="flex-1 bg-transparent outline-none text-sm focus:outline-none focus:ring-0"
          style={{ color: '#e0e0e0', boxShadow: 'none' }}
          autoFocus
        />
        <kbd className="px-2 py-1 bg-white/4 border border-white/8 rounded text-xs font-mono" style={{ color: '#777' }}>
          ESC
        </kbd>
      </div>

      <Command.List className="max-h-[400px] overflow-y-auto p-2">
        {!searchQuery && (
          <Command.Group>
            <Command.Item
              onSelect={() => onAction({ id: 'new-task', label: 'Create New Task', icon: 'plus', description: 'Add a new task to your list' })}
              className="group flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-all data-[selected=true]:bg-white/6"
              style={{ boxShadow: 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ 
                  background: 'rgba(255, 255, 255, 0.06)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}>
                  <Plus className="w-4 h-4" style={{ color: '#e0e0e0' }} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-sm" style={{ color: '#e0e0e0' }}>Create new task</div>
                  <div className="text-xs" style={{ color: '#888' }}>Add a new automated workflow</div>
                </div>
              </div>
              <kbd className="opacity-0 group-data-[selected=true]:opacity-100 px-2 py-1 bg-white/4 border border-white/8 rounded text-xs font-mono transition-opacity" style={{ color: '#888' }}>
                ↵
              </kbd>
            </Command.Item>
          </Command.Group>
        )}

        <Command.Group className={!searchQuery ? 'mt-2 pt-2 border-t border-white/5' : ''}>
          {(searchQuery || tasks.length > 0) && (
            <div className="text-xs font-mono uppercase tracking-wider mb-2 px-3" style={{ color: '#666' }}>
              {searchQuery ? 'Search Results' : `Recent Tasks (${filteredTasks.length})`}
            </div>
          )}
          
          {filteredTasks.length === 0 && searchQuery ? (
            <div className="px-4 py-8 text-center text-xs" style={{ color: '#666' }}>
              No matching tasks found
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="px-4 py-4 text-center text-xs" style={{ color: '#666' }}>
              No tasks yet. Create your first task to get started.
            </div>
          ) : (
            filteredTasks.map((task: Task) => {
              // Determine icon based on connected apps or trigger type
              let taskIcon;
              if (task.apps && task.apps.length > 0) {
                const primaryApp = task.apps[0];
                const logo = getAppLogo(primaryApp);
                taskIcon = (
                  <div className="w-7 h-7 rounded-md flex items-center justify-center p-[3px]" style={{
                    background: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                  }}>
                    <Image 
                      src={logo} 
                      unoptimized 
                      alt={primaryApp} 
                      width={18} 
                      height={18} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                );
              } else {
                taskIcon = (
                  <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" style={{ color: '#e0e0e0' }} strokeWidth={2.5} />
                  </div>
                );
              }
              
              return (
              <Command.Item
                key={task.id}
                onSelect={() => onTaskSelect(task.id)}
                className="group flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-all data-[selected=true]:bg-white/6"
                style={{ boxShadow: 'none' }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {taskIcon}
                  <div className="min-w-0 flex-1">
                    <div 
                      className="text-sm truncate mb-0.5" 
                      style={{ color: '#e0e0e0' }}
                      dangerouslySetInnerHTML={{ __html: highlightMatch(task.title, searchQuery) }}
                    />
                    {task.description && (
                      <div 
                        className="text-xs truncate" 
                        style={{ color: '#888' }}
                        dangerouslySetInnerHTML={{ __html: highlightMatch(task.description, searchQuery) }}
                      />
                    )}
                  </div>
                </div>
                <kbd className="opacity-0 group-data-[selected=true]:opacity-100 px-2 py-1 bg-white/4 border border-white/8 rounded text-xs font-mono transition-opacity" style={{ color: '#999' }}>
                  ↵
                </kbd>
              </Command.Item>
            );
            })
          )}
        </Command.Group>
      </Command.List>
    </Command>
  );
});

export default CommandPaletteMain;
