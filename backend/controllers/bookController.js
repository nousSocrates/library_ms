const Book = require("../models/Book");
const BorrowRecord = require("../models/BorrowRecord");

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
