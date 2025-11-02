const express = require("express");
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getAllBorrowRecords,
  getMyBorrowRecords,
  deleteBorrowRecord,
} = require("../controllers/borrowRecordController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// (User)
router.post("/borrow", protect, borrowBook);
router.post("/return", protect, returnBook);
router.get("/my-records", protect, getMyBorrowRecords);

// Admin (View all records)
router.get("/", protect, adminOnly, getAllBorrowRecords);
router.delete("/:id", protect, adminOnly, deleteBorrowRecord);

module.exports = router;
