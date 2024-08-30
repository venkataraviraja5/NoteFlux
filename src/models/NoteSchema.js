import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the WrittenNote schema
const writtenNoteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    position: {
      top: {
        type: Number,
        required: true,
      },
      left: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.WrittenNote || mongoose.model("WrittenNote", writtenNoteSchema);
