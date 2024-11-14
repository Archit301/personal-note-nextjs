import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define and export the model correctly
const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
export default Note;
