const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    learning_area: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    serial_number: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
    },
    // isbn: {
    //   type: String,
    //   unique: true,
    //   sparse: true, // allows multiple nulls / empty ISBN fields
    //   trim: true,
    // },
    // author: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },

    // category: {
    //   type: String,
    //   default: "General",
    // },

    // description: {
    //   type: String,
    //   default: "",
    // },
  },
  { timestamps: true }
);

// Automatically set available equal to quantity if not provided
bookSchema.pre("save", function (next) {
  if (this.isNew) {
    this.available = this.quantity;
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
