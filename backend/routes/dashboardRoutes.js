const express = require("express");
const router = express.Router();
const {
  protect,
  adminOnly,
  teacherOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

// Admin Dashboard
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome to the Admin Dashboard",
    user: req.user,
  });
});

// Teacher Dashboard
router.get("/teacher", protect, teacherOnly, (req, res) => {
  res.json({
    message: "Welcome to the Teacher Dashboard",
    user: req.user,
  });
});

// Student Dashboard
router.get("/student", protect, studentOnly, (req, res) => {
  res.json({
    message: "Welcome to the Student Dashboard",
    user: req.user,
  });
});

module.exports = router;
