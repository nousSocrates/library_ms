const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register route
router.post("/register", authController.register);

// Login routes
router.post("/login/student", authController.loginStudent);
router.post("/login/teacher", authController.loginTeacher);
router.post("/login/admin", authController.loginAdmin);

//middleware routes
const {
  protect,
  adminOnly,
  teacherOnly,
  studentOnly,
} = require("../middleware/authMiddleware");

// Test route - Protected
router.get("/protected", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Admin only test
router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin route accessed", user: req.user });
});

// Teacher only test
router.get("/teacher-test", protect, teacherOnly, (req, res) => {
  res.json({ message: "Teacher route accessed", user: req.user });
});

// Student only test
router.get("/student-test", protect, studentOnly, (req, res) => {
  res.json({ message: "Student route accessed", user: req.user });
});





module.exports = router;
