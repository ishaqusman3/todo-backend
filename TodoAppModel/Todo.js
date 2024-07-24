const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Corrected spelling
  }
);

const TodoModel = mongoose.model('tasks', todoSchema);
module.exports = TodoModel;
