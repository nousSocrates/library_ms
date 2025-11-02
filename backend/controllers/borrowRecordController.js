// controllers/borrowRecordController.js
const BorrowRecord = require("../models/BorrowRecord");
const Book = require("../models/Book");

// =============================
// 📚 BORROW A BOOK
// =============================
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.available <= 0)
      return res.status(400).json({ message: "No available copies left" });

    // Prevent duplicate active borrow
    const existingRecord = await BorrowRecord.findOne({
      book: bookId,
      borrower: userId,
      status: "Borrowed",
    });
    if (existingRecord) {
      return res
        .status(400)
        .json({
          message: "You already borrowed this book and haven't returned it.",
        });
    }

    const borrowRecord = new BorrowRecord({
      book: bookId,
      borrower: userId,
    });

    await borrowRecord.save();

    book.available -= 1;
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      book,
      borrowRecord,
    });
  } catch (error) {
    console.error("❌ Borrow book error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =============================
// 🔁 RETURN A BOOK
// =============================
exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const record = await BorrowRecord.findOne({
      book: bookId,
      borrower: userId,
      status: "Borrowed",
    });

    if (!record)
      return res
        .status(404)
        .json({ message: "No active borrow record found for this book." });

    record.status = "Returned";
    record.returnDate = new Date();
    await record.save();

    const book = await Book.findById(bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.status(200).json({
      message: "Book returned successfully",
      record,
      book,
    });
  } catch (error) {
    console.error("❌ Return book error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =============================
// 📜 ADMIN: Get all borrow records
// =============================
exports.getAllBorrowRecords = async (req, res) => {
  try {
    let { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && ["Borrowed", "Returned"].includes(status)) {
      query.status = status;
    }

    page = parseInt(page);
    limit = parseInt(limit);

    const totalRecords = await BorrowRecord.countDocuments(query);
    const records = await BorrowRecord.find(query)
      .populate("book", "learning_area publisher serial_number")
      .populate("borrower", "name admissionNumber tscNumber")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      records,
    });
  } catch (error) {
    console.error("❌ Borrow record fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =============================
// 🙋‍♂️ USER: Get my borrow records
// =============================
exports.getMyBorrowRecords = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await BorrowRecord.find({ borrower: userId })
      .populate("book", "learning_area publisher serial_number")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("❌ User borrow record fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================================
// 🗑️ Delete a borrow record (Admin only)
// ================================
exports.deleteBorrowRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await BorrowRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // If the record was active (Borrowed), restore the book's availability
    if (record.status === "Borrowed") {
      const book = await Book.findById(record.book);
      if (book) {
        book.available += 1;
        await book.save();
      }
    }

    await BorrowRecord.findByIdAndDelete(id);

    res.status(200).json({ message: "Borrow record deleted successfully." });
  } catch (error) {
    console.error("❌ Delete record error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
