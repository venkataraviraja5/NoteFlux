import { NextResponse } from 'next/server';
import connect from '../../../../utils/db';
import Task from '../../../../models/Task';
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH } from '../../../lib/auth';

export async function PUT(request, { params }) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  await connect();

  try {
    const body = await request.json();
    console.log('Updating task:', id, 'with data:', body);

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { 
        content: body.content, 
        completed: body.completed, 
        subtasks: body.subtasks,
        columnId: body.columnId
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      console.log('Task not found:', id);
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    console.log('Updated task:', task);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(NEXT_AUTH );
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  await connect();

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}