import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connect from '../../../utils/db';
import WrittenNote from '../../../models/NoteSchema';
import { NEXT_AUTH } from '../../lib/auth';

export const POST = async (req) => {
  await connect();
  const session = await getServerSession(NEXT_AUTH);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { notes } = await req.json();
    if (!notes || !Array.isArray(notes)) {
      return NextResponse.json({ error: 'Invalid note data' }, { status: 400 });
    }

    const updatedNotes = await Promise.all(notes.map(async (note) => {
      if (!note._id) {
        // New note
        const newNote = new WrittenNote({
          ...note,
          user: userId,
        });
        return await newNote.save();
      } else {
        // Existing note
        return await WrittenNote.findOneAndUpdate(
          { _id: note._id, user: userId },
          { $set: { content: note.content, position: note.position, title: note.title } },
          { new: true, upsert: true }
        );
      }
    }));

    console.log('Updated notes:', updatedNotes);
    return NextResponse.json({ message: 'Notes updated successfully', notes: updatedNotes }, { status: 200 });
  } catch (error) {
    console.error('Error updating notes:', error);
    return NextResponse.json({ error: 'Failed to update notes' }, { status: 500 });
  }
};