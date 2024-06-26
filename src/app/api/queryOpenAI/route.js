import { getServerSession } from "next-auth/next";
import connect from "../../../utils/db";
import Note from "../../../models/Note";
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req, res) => {
  if (req.method !== "POST") {
    return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
  }

  const session = await getServerSession(req, res);

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connect();

  try {
    const userId = session.user.id;

    // Fetch user's notes
    const notes = await Note.find({ user: userId });

    const { question } = req.body;

    if (!question) {
      return NextResponse.json({ success: false, message: "Question is required" }, { status: 400 });
    }

    // Create a context for the OpenAI query
    const context = notes.map((note) => note.transcript).join("\n");

    // Send request to OpenAI
    const completion = await openai.chat.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: question },
        { role: "assistant", content: context },
      ],
    });

    return NextResponse.json({ success: true, answer: completion.data.choices[0].message.content }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
