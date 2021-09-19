const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String },
    completed: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user-tasks", taskSchema, "user-tasks");
