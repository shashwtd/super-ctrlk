'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trash2, Settings, FileText, Link2, Clock } from 'lucide-react';
import { Task } from '@/lib/types';
import Image from 'next/image';

interface TaskDetailViewProps {
  task: Task;
  onBack: () => void;
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
}

export default function TaskDetailView({ 
  task, 
  onBack, 
  onDelete, 
  onRun 
}: TaskDetailViewProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const appLogos: { [key: string]: string } = {
    gmail: '/logos/gmail-svgrepo-com.svg',
    slack: '/logos/slack-svgrepo-com.svg',
    notion: '/logos/notion-svgrepo-com.svg',
    trello: '/logos/trello-svgrepo-com.svg',
    github: '/logos/github-svgrepo-com.svg',
    drive: '/logos/google-drive-svgrepo-com.svg',
    calendar: '/logos/g-calendar-svgrepo-com.svg',
    sheets: '/logos/sheets-sheet-svgrepo-com.svg'
  };

  const appNames: { [key: string]: string } = {
    gmail: 'Gmail',
    slack: 'Slack',
    notion: 'Notion',
    trello: 'Trello',
    github: 'GitHub',
    drive: 'Google Drive',
    calendar: 'Google Calendar',
    sheets: 'Google Sheets'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="bg-[#111] backdrop-blur-2xl border border-white/8 rounded-xl overflow-hidden"
      style={{
        fontFamily: 'var(--font-geist-sans)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      }}
    >
      <div className="flex flex-col max-h-[520px]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/6" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#999' }} strokeWidth={2} />
            </button>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span className="text-sm" style={{ color: '#666' }}>Tasks</span>
              <span style={{ color: '#444' }}>/</span>
              <h2 className="text-sm font-medium truncate" style={{ color: '#e0e0e0' }}>{task.title}</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#888' }}>
              {task.triggerType === 'manual' ? (
                <>
                  <Play className="w-3 h-3" strokeWidth={2} fill="#888" />
                  <span>Manual</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" strokeWidth={2} />
                  <span>Scheduled</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.08) transparent'
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 12px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              border-radius: 4px;
              border: 4px solid #111;
              background: rgba(255, 255, 255, 0.08);
            }
          `}</style>

          {/* Description */}
          {task.description && (
            <div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#b0b0b0' }}>{task.description}</p>
            </div>
          )}

          {/* Inputs Section */}
          {task.inputs && task.inputs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-3.5 h-3.5" style={{ color: '#666' }} strokeWidth={2} />
                <label className="text-xs font-mono uppercase tracking-wider" style={{ color: '#888' }}>
                  Input Fields ({task.inputs.length})
                </label>
              </div>
              <div className="space-y-2">
                {task.inputs.map((input, idx) => (
                  <div 
                    key={idx}
                    className="px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="text-xs font-medium mb-0.5" style={{ color: '#b0b0b0' }}>{input.name}</div>
                    <div className="text-xs font-mono" style={{ color: '#777' }}>{input.defaultValue}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          {task.files && task.files.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5" style={{ color: '#666' }} strokeWidth={2} />
                <label className="text-xs font-mono uppercase tracking-wider" style={{ color: '#888' }}>
                  Files ({task.files.length})
                </label>
              </div>
              <div className="space-y-2">
                {task.files.map((file, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                  >
                    <FileText className="w-4 h-4 shrink-0" style={{ color: '#999' }} strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate" style={{ color: '#e0e0e0' }}>{file.name}</div>
                      <div className="text-[10px]" style={{ color: '#666' }}>{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apps Section */}
          {task.apps && task.apps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-3.5 h-3.5" style={{ color: '#666' }} strokeWidth={2} />
                <label className="text-xs font-mono uppercase tracking-wider" style={{ color: '#888' }}>
                  Connected Apps ({task.apps.length})
                </label>
              </div>
              <div className="space-y-2">
                {task.apps.map((appId) => (
                  <div 
                    key={appId}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center p-1.5" style={{
                      background: '#ffffff',
                      boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Image src={appLogos[appId]} unoptimized alt={appNames[appId]} width={16} height={16} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs" style={{ color: '#e0e0e0' }}>{appNames[appId]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-2 border-t border-white/6">
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: '#666' }}>
              Metadata
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#777' }}>Created</span>
                <span style={{ color: '#999' }}>{formatDate(task.createdAt)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#777' }}>Updated</span>
                <span style={{ color: '#999' }}>{formatDate(task.updatedAt)}</span>
              </div>
              {task.lastRun && (
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#777' }}>Last Run</span>
                  <span style={{ color: '#999' }}>{formatDate(task.lastRun)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span style={{ color: '#777' }}>Run Count</span>
                <span style={{ color: '#999' }}>{task.runCount} time{task.runCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-2 p-4 border-t border-white/6" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
          <button
            onClick={() => onRun(task.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#e0e0e0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <Play className="w-3.5 h-3.5" strokeWidth={2} fill="#e0e0e0" />
            Run Task
          </button>

          <button
            onClick={() => console.log('Edit task:', task.id)}
            className="px-3.5 py-2.5 rounded-lg text-xs transition-all cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#999',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#b0b0b0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = '#999';
            }}
          >
            <Settings className="w-4 h-4" strokeWidth={2} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="px-3.5 py-2.5 rounded-lg text-xs transition-all cursor-pointer"
            style={{
              background: 'rgba(255, 77, 79, 0.1)',
              color: '#ff6b6b',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 77, 79, 0.15)';
              e.currentTarget.style.color = '#ff8585';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
              e.currentTarget.style.color = '#ff6b6b';
            }}
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
