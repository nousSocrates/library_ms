const Book = require("../models/Book");

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { learning_area, level, serial_number, publisher, quantity } =
      req.body;

    if (!learning_area || !level || !publisher || !serial_number || !quantity) {
      return res.status(400).json({
        message:
          "Learning Area, Publisher, Level, Serial Number and Quantity are required",
      });
    }

    // ✅ Check if a book already exists with the same title, serial_number, level, and publisher
    const exists = await Book.findOne({
      learning_area,
      serial_number,
      level,
      publisher,
    });

    if (exists) {
      return res.status(400).json({
        message:
          "A book with the same Title, Serial Number, Level, and Publisher already exists",
      });
    }

    // Create and save new book
    const book = new Book({
      learning_area,
      level,
      publisher,
      serial_number,
      quantity,
      available: quantity,
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const updates = req.body;

    const book = await Book.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book updated", book });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const Book = require("../models/Book");
const BorrowRecord = require("../models/BorrowRecord");

// Borrow a book (with tracking)
exports.borrowBook = async (req, res) => {
  try {
    const { bookId, borrower } = req.body;

    if (!bookId || !borrower)
      return res
        .status(400)
        .json({ message: "Book ID and borrower are required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.available <= 0)
      return res.status(400).json({ message: "No available copies left" });

    // Check if borrower already has this book not yet returned
    const existingRecord = await BorrowRecord.findOne({
      book: bookId,
      borrower,
      status: "Borrowed",
    });
    if (existingRecord)
      return res.status(400).json({
        message: `${borrower} already borrowed this book and has not returned it.`,
      });

    // Create a borrow record
    const borrowRecord = new BorrowRecord({
      book: bookId,
      borrower,
    });
    await borrowRecord.save();

    // Decrease available count
    book.available -= 1;
    await book.save();

    res.status(201).json({
      message: `Book borrowed successfully by ${borrower}`,
      book,
      borrowRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Return a book (updates record)
exports.returnBook = async (req, res) => {
  try {
    const { bookId, borrower } = req.body;

    if (!bookId || !borrower)
      return res
        .status(400)
        .json({ message: "Book ID and borrower are required" });

    const record = await BorrowRecord.findOne({
      book: bookId,
      borrower,
      status: "Borrowed",
    });
    if (!record)
      return res
        .status(404)
        .json({ message: "No active borrow record found for this user." });

    // Update record
    record.status = "Returned";
    record.returnDate = new Date();
    await record.save();

    // Increase available count
    const book = await Book.findById(bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.status(200).json({
      message: `Book returned successfully by ${borrower}`,
      record,
      book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
