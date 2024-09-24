import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  id: String,
  content: String,
  completed: Boolean
}, { _id: false });

const TaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  columnId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  subtasks: {
    type: [SubtaskSchema],
    default: []
  },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);