const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  phone: {
    type: String,
  },
  classLevel: {
    type: String, // For students only
  },
  department: {
    type: String, // For teachers only
  },
  admissionNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows it to be optional
  },
  tscNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows it to be optional
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Used by admin
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
