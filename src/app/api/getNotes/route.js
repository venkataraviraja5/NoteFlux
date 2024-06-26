import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Note from '../../../models/Note';
import { NEXT_AUTH } from "../../lib/auth";

export const POST = async (req) => {
  const session = await getServerSession(NEXT_AUTH);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Establish MongoDB connection
  await connect();

  try {
    const userId = session.user.id;

    // Fetch notes for the authenticated user
    const notes = await Note.find({ user: userId });

    // If no notes are found, handle this case accordingly
    if (!notes) {
      return NextResponse.json({ success: false, message: 'No notes found for the user' }, { status: 404 });
    }

    // Return success response with fetched notes
    return NextResponse.json({ success: true, notes }, { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
