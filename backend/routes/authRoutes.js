const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register route
router.post("/register", authController.register);

// Login routes
router.post("/login/student", authController.loginStudent);
router.post("/login/teacher", authController.loginTeacher);
router.post("/login/admin", authController.loginAdmin);

module.exports = router;
