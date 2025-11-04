import { NextRequest, NextResponse } from 'next/server';
import { tasks, setTasks } from '../../data';

const RUN_DELAY_MIN = 1000;
const RUN_DELAY_MAX = 3000;

// POST /api/tasks/[id]/run - Run a task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const delay = Math.floor(Math.random() * (RUN_DELAY_MAX - RUN_DELAY_MIN + 1)) + RUN_DELAY_MIN;
  await new Promise(resolve => setTimeout(resolve, delay));

  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const updatedTasks = [...tasks];
  updatedTasks[taskIndex] = {
    ...updatedTasks[taskIndex],
    lastRun: Date.now(),
    runCount: updatedTasks[taskIndex].runCount + 1,
    updatedAt: Date.now(),
  };
  setTasks(updatedTasks);

  return NextResponse.json({
    success: true,
    task: updatedTasks[taskIndex],
    message: 'Task executed successfully'
  });
}
