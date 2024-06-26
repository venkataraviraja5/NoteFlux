import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Note from '../../../models/Note';
import User from '../../../models/User'; 

export const POST=async(request)=> {
  await connect();

  try {
    const { transcript, userId } = await request.json(); // Parse the request body

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Create a new note associated with the user
    const newNote = new Note({
      transcript,
      user: userId, // Assigning the user's ObjectId to the note
    });

    // Save the note to the database
    await newNote.save();

    // Respond with success message and the created note
    return NextResponse.json({ success: true, note: newNote }, { status: 200 });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
