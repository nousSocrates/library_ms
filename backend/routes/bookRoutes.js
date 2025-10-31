const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ==============================
// 📘 ADMIN ROUTES (Restricted)
// ==============================
// Add a new book
router.post("/", protect, adminOnly, bookController.addBook);
// Update an existing book
router.put("/:id", protect, adminOnly, bookController.updateBook);
// Delete a book
router.delete("/:id", protect, adminOnly, bookController.deleteBook);
// ==============================
// 📚 GENERAL ROUTES (Protected)
// ==============================
// Get all books
router.get("/", protect, bookController.getBooks);
// Get a single book by ID
router.get("/:id", protect, bookController.getBook);
// ==============================
// 🔁 BORROW & RETURN ROUTES
// ==============================
// Borrow a book — any authenticated user can borrow
router.post("/borrow", protect, bookController.borrowBook);
// Return a borrowed book — any authenticated user can return
router.post("/return", protect, bookController.returnBook);

module.exports = router;
