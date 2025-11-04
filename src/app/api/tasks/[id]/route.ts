import { NextRequest, NextResponse } from 'next/server';
import { tasks, setTasks } from '../data';

const GET_DELAY = 100;
const UPDATE_DELAY = 150;
const DELETE_DELAY_MIN = 0;
const DELETE_DELAY_MAX = 1000;

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await new Promise(resolve => setTimeout(resolve, GET_DELAY));

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  await new Promise(resolve => setTimeout(resolve, UPDATE_DELAY));

  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const updatedTasks = [...tasks];
  updatedTasks[taskIndex] = {
    ...updatedTasks[taskIndex],
    ...updates,
    updatedAt: Date.now(),
  };
  setTasks(updatedTasks);

  return NextResponse.json(updatedTasks[taskIndex]);
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const delay = Math.floor(Math.random() * (DELETE_DELAY_MAX - DELETE_DELAY_MIN + 1)) + DELETE_DELAY_MIN;
  await new Promise(resolve => setTimeout(resolve, delay));

  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  setTasks(tasks.filter(t => t.id !== id));

  return NextResponse.json({ success: true });
}
