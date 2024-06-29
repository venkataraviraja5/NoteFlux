import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';
import connect from "../../../utils/db";
import Note from "../../../models/Note";
import User from "../../../models/User";
import OpenAI from "openai";
import { NEXT_AUTH } from "../../lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req, res) => {
  if (req.method !== "POST") {
    return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
  }

  const session = await getServerSession(NEXT_AUTH);

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connect();

  try {
    // Retrieve the user by their email address
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Use the user's MongoDB _id to query notes
    const notes = await Note.find({ user: user._id });

    const { question } = await req.json(); // Correctly parses the request body for the question

    if (!question) {
      return NextResponse.json({ success: false, message: "Question is required" }, { status: 400 });
    }

    // Create context for the OpenAI query
    const context = notes.map((note) => note.transcript).join("\n");

    // Send request to OpenAI for completions
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "assistant", content: `${context}\n${question}` },
        { role: "user", content: "Answer the question based on the context provided. If no context is present then give general answers." } // Instructs the model to answer the question
      ],
    });

    // Extract and return the answer from OpenAI response
    const answer = completion.choices[0].message.content;
    return NextResponse.json({ success: true, answer }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
