import { NextResponse } from "next/server"
import Canva from "../../../models/canvas"
import connect from "../../../utils/db"

export const POST = async(request) => {
    await connect();
    const { userId, items, canvasId, name } = await request.json();
  
    if (canvasId) {
      // Update existing canvas
      const canvas = await Canva.findById(canvasId);
      if (canvas) {
        canvas.items = items;
        await canvas.save();
        return NextResponse.json({ result: "Canvas updated successfully" }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
      }
    } else {
      // Create new canvas
      const newCanvas = new Canva({ userId, items, name: name || "Untitled Canvas" });
      await newCanvas.save();
      return NextResponse.json({ result: "Canvas saved successfully", canvasId: newCanvas._id }, { status: 201 });
    }
  };
  

  export const GET = async(request) => {
    await connect();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
  
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
  
    try {
      const canvases = await Canva.find({ userId });
      if (canvases.length > 0) {
        return NextResponse.json({ result: canvases }, { status: 200 });
      } else {
        return NextResponse.json({ error: "No canvases found for this user" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error in GET request:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
  