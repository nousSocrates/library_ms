const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER (Student or Teacher)
exports.register = async (req, res) => {
  try {
    const {
      name,
      role,
      gender,
      phone,
      classLevel,
      department,
      admissionNumber,
      tscNumber,
      email,
      password,
    } = req.body;

    // Prevent admin registration from API
    if (role === "admin") {
      return res.status(403).json({ message: "Admin cannot register here" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ admissionNumber }, { tscNumber }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      role,
      gender,
      phone,
      classLevel,
      department,
      admissionNumber,
      tscNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN STUDENT
exports.loginStudent = async (req, res) => {
  try {
    const { admissionNumber, password } = req.body;

    const student = await User.findOne({ admissionNumber, role: "student" });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.json({ message: "Student login successful", token, user: student });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN TEACHER
exports.loginTeacher = async (req, res) => {
  try {
    const { tscNumber, password } = req.body;

    const teacher = await User.findOne({ tscNumber, role: "teacher" });
    if (!teacher) return res.status(400).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.json({ message: "Teacher login successful", token, user: teacher });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.json({ message: "Admin login successful", token, user: admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT USER
exports.logout = async (req, res) => {
  try {
    // For JWT, logout is handled on the frontend by deleting the token
    return res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
