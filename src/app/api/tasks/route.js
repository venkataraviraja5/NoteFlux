// app/api/tasks/route.js
import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Task from '../../../models/Task';
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from "../../lib/auth";

export async function GET(request) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  try {
    const tasks = await Task.find({ userId: session.user.id });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  try {
    const body = await request.json();
    const task = await Task.create({
      ...body,
      userId: session.user.id,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}