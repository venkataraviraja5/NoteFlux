import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connect from '../../../utils/db';
import WrittenNote from '../../../models/NoteSchema';
import { NEXT_AUTH } from '../../lib/auth';

export const GET = async (req) => {
  await connect();

  const session = await getServerSession(NEXT_AUTH);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const notes = await WrittenNote.find({ user: userId });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
};
