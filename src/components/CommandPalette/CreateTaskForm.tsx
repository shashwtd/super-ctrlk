'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Settings, FileText, Link2, X, Check, Upload, Plus, Play, Clock } from 'lucide-react';
import Image from 'next/image';
import { AVAILABLE_APPS } from '@/lib/apps';
import Spinner from '../Spinner';

type Tab = 'basic' | 'inputs' | 'files' | 'apps';
type TriggerType = 'manual' | 'automatic';

interface CreateTaskFormProps {
  onBack: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    triggerType: TriggerType;
    inputs: Array<{ name: string; defaultValue: string }>;
    files: Array<{ name: string; size: number }>;
    apps: string[];
  }) => void;
  prefilledTitle?: string;
  isLoading?: boolean;
}

export default function CreateTaskForm({ onBack, onSubmit, prefilledTitle, isLoading = false }: CreateTaskFormProps) {
  const [currentTab, setCurrentTab] = useState<Tab>('basic');
  const [taskName, setTaskName] = useState(prefilledTitle);
  const [taskDescription, setTaskDescription] = useState('');
  const [triggerType, setTriggerType] = useState<TriggerType>('manual');
  const [inputName, setInputName] = useState('');
  const [inputDefaultValue, setInputDefaultValue] = useState('');
  const [taskInputs, setTaskInputs] = useState<Array<{ name: string; defaultValue: string }>>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [appSearchQuery, setAppSearchQuery] = useState('');

  const filteredApps = AVAILABLE_APPS.filter(app => 
    app.name.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!taskName?.trim()) return;
    onSubmit({
      title: taskName?.trim() || '',
      description: taskDescription.trim(),
      triggerType,
      inputs: taskInputs,
      files: uploadedFiles.map(file => ({ name: file.name, size: file.size })),
      apps: selectedApps,
    });
  };

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#111] backdrop-blur-2xl border border-white/8 rounded-xl overflow-hidden"
      style={{
        fontFamily: 'var(--font-geist-sans)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      }}
    >
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
        div::-webkit-scrollbar-thumb:hover {
          border: 3px solid #111;
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>

      <div className="flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/6" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#999' }} strokeWidth={2} />
            </button>
            <div className="flex-1">
              <h2 className="text-sm font-medium" style={{ color: '#e0e0e0' }}>Create New Task</h2>
              <p className="text-[11px]" style={{ color: '#777' }}>Configure name, inputs, files, and apps</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/6 px-5" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
          {[
            { id: 'basic', label: 'Basic', icon: Layers },
            { id: 'inputs', label: 'Inputs', icon: Settings },
            { id: 'files', label: 'Files', icon: FileText },
            { id: 'apps', label: 'Apps', icon: Link2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as Tab)}
              className="flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all cursor-pointer relative"
              style={{
                color: currentTab === tab.id ? '#e0e0e0' : '#888',
                borderBottom: currentTab === tab.id ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              <tab.icon className="w-3.5 h-3.5" strokeWidth={2} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.08) transparent'
        }}>
          {currentTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono mb-2" style={{ color: '#888' }}>
                  TASK NAME
                  <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="w-full px-3 py-3 bg-white/3 border border-white/8 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-white/12"
                  style={{ 
                    color: '#e0e0e0',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: '#888' }}>DESCRIPTION</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe what this task does..."
                  className="w-full px-3 py-2.5 bg-white/3 border border-white/8 rounded-lg text-sm resize-none transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-white/12"
                  style={{ 
                    color: '#e0e0e0',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                  rows={8}
                />
              </div>
            </div>
          )}

          {currentTab === 'inputs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono" style={{ color: '#888' }}>INPUT FIELDS</label>
                <span className="text-[10px] font-mono" style={{ color: '#666' }}>{taskInputs.length} fields</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputName.trim() && inputDefaultValue.trim()) {
                      const isUnique = !taskInputs.some(input => input.name.toLowerCase() === inputName.trim().toLowerCase());
                      if (isUnique) {
                        setTaskInputs([...taskInputs, { name: inputName.trim(), defaultValue: inputDefaultValue.trim() }]);
                        setInputName('');
                        setInputDefaultValue('');
                      }
                    }
                  }}
                  placeholder="Field name"
                  className="flex-1 px-3 py-2.5 bg-white/3 border border-white/8 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-white/12"
                  style={{ 
                    color: '#e0e0e0',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                />
                <input
                  type="text"
                  value={inputDefaultValue}
                  onChange={(e) => setInputDefaultValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputName.trim() && inputDefaultValue.trim()) {
                      const isUnique = !taskInputs.some(input => input.name.toLowerCase() === inputName.trim().toLowerCase());
                      if (isUnique) {
                        setTaskInputs([...taskInputs, { name: inputName.trim(), defaultValue: inputDefaultValue.trim() }]);
                        setInputName('');
                        setInputDefaultValue('');
                      }
                    }
                  }}
                  placeholder="Default value"
                  className="flex-1 px-3 py-2.5 bg-white/3 border border-white/8 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-white/12"
                  style={{ 
                    color: '#e0e0e0',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                />
                <button
                  onClick={() => {
                    if (inputName.trim() && inputDefaultValue.trim()) {
                      const isUnique = !taskInputs.some(input => input.name.toLowerCase() === inputName.trim().toLowerCase());
                      if (isUnique) {
                        setTaskInputs([...taskInputs, { name: inputName.trim(), defaultValue: inputDefaultValue.trim() }]);
                        setInputName('');
                        setInputDefaultValue('');
                      }
                    }
                  }}
                  disabled={!inputName.trim() || !inputDefaultValue.trim() || taskInputs.some(input => input.name.toLowerCase() === inputName.trim().toLowerCase())}
                  className="px-4 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  style={{
                    background: (inputName.trim() && inputDefaultValue.trim() && !taskInputs.some(input => input.name.toLowerCase() === inputName.trim().toLowerCase())) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    color: (inputName.trim() && inputDefaultValue.trim() && !taskInputs.some(input => input.name.toLowerCase() === inputName.trim().toLowerCase())) ? '#e0e0e0' : '#666',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Add
                </button>
              </div>

              {taskInputs.length > 0 && (
                <div className="space-y-2 mt-4">
                  {taskInputs.map((input, index) => (
                    <div key={index} className="flex items-center gap-3 px-3 py-2.5 rounded-lg group hover:bg-white/5 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-0.5" style={{ color: '#e0e0e0' }}>{input.name}</div>
                        <div className="text-xs font-mono" style={{ color: '#777' }}>{input.defaultValue}</div>
                      </div>
                      <button
                        onClick={() => setTaskInputs(taskInputs.filter((_, i) => i !== index))}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/8 rounded-lg transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" style={{ color: '#999' }} strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentTab === 'files' && (
            <div className="h-full flex flex-col pb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono" style={{ color: '#888' }}>UPLOAD FILES</label>
                <span className="text-[10px] font-mono" style={{ color: '#666' }}>{uploadedFiles.length} files</span>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="relative flex-1">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full flex items-center justify-center px-6 py-12 rounded-lg border-2 border-dashed border-white/10 hover:border-white/15 transition-colors cursor-pointer"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                        <Upload className="w-6 h-6" style={{ color: '#999' }} strokeWidth={2} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm mb-1" style={{ color: '#b0b0b0' }}>Drop files here or click to browse</p>
                        <p className="text-xs" style={{ color: '#666' }}>Support for multiple files</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="px-4 py-6 rounded-lg border-2 border-dashed border-white/10 hover:border-white/15 transition-colors cursor-pointer text-center"
                      style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" style={{ color: '#999' }} strokeWidth={2} />
                        <span className="text-sm" style={{ color: '#999' }}>Add more files</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <FileText className="w-4 h-4 shrink-0" style={{ color: '#999' }} strokeWidth={2} />
                          <div className="min-w-0">
                            <div className="text-sm truncate" style={{ color: '#e0e0e0' }}>{file.name}</div>
                            <div className="text-xs" style={{ color: '#777' }}>{(file.size / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                          className="p-1.5 hover:bg-white/8 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          <X className="w-3.5 h-3.5" style={{ color: '#999' }} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'apps' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono" style={{ color: '#888' }}>CONNECT APPS</label>
                <span className="text-[10px] font-mono" style={{ color: '#666' }}>{selectedApps.length} selected</span>
              </div>

              <input
                type="text"
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                placeholder="Search for apps..."
                className="w-full px-3 py-2.5 bg-white/3 border border-white/8 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-white/12 mb-3"
                style={{ 
                  color: '#e0e0e0',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                }}
              />

              <div className="flex-1 space-y-1 pb-5">
                {filteredApps.map((app) => {
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        if (selectedApps.includes(app.id)) {
                          setSelectedApps(selectedApps.filter(id => id !== app.id));
                        } else {
                          setSelectedApps([...selectedApps, app.id]);
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all cursor-pointer hover:bg-white/5"
                      style={{
                        background: selectedApps.includes(app.id) ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                        border: selectedApps.includes(app.id) ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center p-0.5" style={{
                          background: '#222',
                          boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}>
                          <Image src={app.logo} unoptimized alt={app.name} width={20} height={20} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm" style={{ color: '#e0e0e0' }}>{app.name}</span>
                      </div>
                      {selectedApps.includes(app.id) && (
                        <Check className="w-4 h-4" style={{ color: '#52c41a' }} strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-5 border-t border-white/6" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
          {/* Execution Mode */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#666' }}>Run</label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTriggerType('manual')}
                className="px-3 py-1.5 text-xs font-medium transition-all cursor-pointer rounded-md flex items-center gap-1.5"
                style={{
                  background: triggerType === 'manual' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  color: triggerType === 'manual' ? '#e0e0e0' : '#777',
                  border: triggerType === 'manual' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.06)',
                  fontWeight: triggerType === 'manual' ? '500' : '400'
                }}
              >
                <Play className="w-3 h-3" strokeWidth={2} fill={triggerType === 'manual' ? '#e0e0e0' : 'none'} />
                Manual
              </button>
              <button
                onClick={() => setTriggerType('automatic')}
                className="px-3 py-1.5 text-xs font-medium transition-all cursor-pointer rounded-md flex items-center gap-1.5"
                style={{
                  background: triggerType === 'automatic' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  color: triggerType === 'automatic' ? '#e0e0e0' : '#777',
                  border: triggerType === 'automatic' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.06)',
                  fontWeight: triggerType === 'automatic' ? '500' : '400'
                }}
              >
                <Clock className="w-3 h-3" strokeWidth={2} />
                Scheduled
              </button>
            </div>
          </div>

          {/* Tab Indicators */}
          {(taskInputs.length > 0 || uploadedFiles.length > 0 || selectedApps.length > 0) && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div className="flex items-center gap-2">
                {taskInputs.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3" style={{ color: '#888' }} strokeWidth={2} />
                    <span className="text-xs" style={{ color: '#b0b0b0' }}>{taskInputs.length}</span>
                  </div>
                )}
                {taskInputs.length > 0 && (uploadedFiles.length > 0 || selectedApps.length > 0) && (
                  <span style={{ color: '#444' }}>·</span>
                )}
                {uploadedFiles.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" style={{ color: '#888' }} strokeWidth={2} />
                    <span className="text-xs" style={{ color: '#b0b0b0' }}>{uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {uploadedFiles.length > 0 && selectedApps.length > 0 && (
                  <span style={{ color: '#444' }}>·</span>
                )}
                {selectedApps.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Link2 className="w-3 h-3" style={{ color: '#888' }} strokeWidth={2} />
                    <span className="text-xs" style={{ color: '#b0b0b0' }}>{selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg text-xs transition-all cursor-pointer"
            style={{ 
              color: '#999',
              background: 'rgba(255, 255, 255, 0.04)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = '#b0b0b0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = '#999';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!taskName?.trim() || isLoading}
            className="px-5 py-2 rounded-lg text-xs font-medium transition-all disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            style={{ 
              background: taskName?.trim() && !isLoading ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              color: taskName?.trim() && !isLoading ? '#ffffff' : '#666',
              opacity: isLoading ? 0.6 : 1,
              boxShadow: taskName?.trim() && !isLoading
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3)'
                : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}
          >
            {isLoading && <Spinner size={12} />}
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
