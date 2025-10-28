const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Helper: remove sensitive fields before sending user back
const sanitizeUser = (user) => {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : user;
  delete u.password;
  return u;
};

// Create student (Admin only)
exports.createStudent = async (req, res) => {
  try {
    const { name, gender, admissionNumber, classLevel, password } = req.body;

    if (!name || !admissionNumber || !password) {
      return res
        .status(400)
        .json({ message: "Name, admissionNumber and password are required" });
    }

    // check unique admissionNumber
    const exists = await User.findOne({ admissionNumber });
    if (exists)
      return res
        .status(400)
        .json({ message: "Admission number already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      role: "student",
      gender,
      admissionNumber,
      classLevel,
      password: hashed,
    });

    await student.save();
    res
      .status(201)
      .json({ message: "Student created", user: sanitizeUser(student) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create teacher (Admin only)
exports.createTeacher = async (req, res) => {
  try {
    const { name, gender, tscNumber, phone, department, password } = req.body;

    if (!name || !tscNumber || !password) {
      return res
        .status(400)
        .json({ message: "Name, tscNumber and password are required" });
    }

    const exists = await User.findOne({ tscNumber });
    if (exists)
      return res.status(400).json({ message: "TSC number already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const teacher = new User({
      name,
      role: "teacher",
      gender,
      tscNumber,
      phone,
      department,
      password: hashed,
    });

    await teacher.save();
    res
      .status(201)
      .json({ message: "Teacher created", user: sanitizeUser(teacher) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (optionally filter by role via ?role=student/teacher)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    const filter = role ? { role } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ total, page: Number(page), limit: Number(limit), users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    // if updating password, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    // prevent role from being escalated accidentally (optional)
    if (
      updates.role &&
      updates.role !== "student" &&
      updates.role !== "teacher" &&
      updates.role !== "admin"
    ) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
