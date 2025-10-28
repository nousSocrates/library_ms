const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes protected + adminOnly
router.post(
  "/register/student",
  protect,
  adminOnly,
  adminController.createStudent
);
router.post(
  "/register/teacher",
  protect,
  adminOnly,
  adminController.createTeacher
);

router.get("/users", protect, adminOnly, adminController.getAllUsers);
router.get("/user/:id", protect, adminOnly, adminController.getUser);
router.put("/user/:id", protect, adminOnly, adminController.updateUser);
router.delete("/user/:id", protect, adminOnly, adminController.deleteUser);

module.exports = router;
