import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/lib/types';
import { tasks, setTasks } from './data';

const SEARCH_DELAY = 100;
const CREATE_DELAY_MIN = 0;
const CREATE_DELAY_MAX = 1000;

// GET /api/tasks - Get all tasks or search
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY));

  if (query) {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    return NextResponse.json(filtered);
  }

  return NextResponse.json(tasks);
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const delay = Math.floor(Math.random() * (CREATE_DELAY_MAX - CREATE_DELAY_MIN + 1)) + CREATE_DELAY_MIN;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const newTask: Task = {
    ...body,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    runCount: 0,
  };

  setTasks([newTask, ...tasks]);

  return NextResponse.json(newTask, { status: 201 });
}
