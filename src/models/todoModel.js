import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
 },
  title: String,
  isCompleted: { 
    type: Boolean,
     default: false 
    },
  dueDate: Date,
  createdAt: { 
    type: Date, 
    default: Date.now
 }
});

const Todo= mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
export default Todo