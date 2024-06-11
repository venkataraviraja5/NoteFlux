import User from "../../../models/User";
import connect from "../../../utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { email, username, password } = await request.json(); // Extract username

  await connect();

  // Check if the email is already in use
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  // Check if the username is already in use
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return new NextResponse("Username is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    username, // Include username
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
  } catch (err) {
    return new NextResponse(err.message || "Internal Server Error", {
      status: 500,
    });
  }
};
