import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Note from '../../../models/Note';
import User from '../../../models/User';
import { NEXT_AUTH } from "../../lib/auth";

// Utility function to parse the request body
const parseBody = async (req) => {
    const reader = req.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        result += decoder.decode(value, { stream: !done });
    }

    return JSON.parse(result);
};

export const POST = async (req) => {
    const session = await getServerSession(NEXT_AUTH);
    console.log(session);

    if (!session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connect();

    try {
        const body = await parseBody(req); // Parse the request body
        console.log("Request Body:", body);

        const { transcript } = body; // Access parsed body
        if (!transcript) {
            return NextResponse.json({ success: false, message: 'Transcript is required' }, { status: 400 });
        }

        // Retrieve the user by their email address
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Create a new note associated with the user
        const newNote = new Note({
            transcript,
            user: user._id,
        });

        // Save the note to the database
        await newNote.save();

        // Respond with success message and the created note
        return NextResponse.json({ success: true, note: newNote }, { status: 200 });
    } catch (error) {
        // Handle errors
        console.error("Error saving note:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};
