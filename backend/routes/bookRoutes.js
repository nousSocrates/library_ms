const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only: Add, update, delete books
router.post("/", protect, adminOnly, bookController.addBook);
router.put("/:id", protect, adminOnly, bookController.updateBook);
router.delete("/:id", protect, adminOnly, bookController.deleteBook);

// Public: View books
router.get("/", protect, bookController.getBooks);
router.get("/:id", protect, bookController.getBook);

module.exports = router;
