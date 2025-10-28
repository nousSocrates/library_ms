const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("nousAdmin", 10);

    const admin = new User({
      name: "nousSocrates",
      firstName: "Phelix",
      lastName: "Ouma",
      email: "noussocrates@gmail.com",
      password: hashedPassword,
      role: "admin",
      gender: "Male",
      phone: "0704588581",
    });

    await admin.save();
    console.log("✅ Admin user seeded successfully!");
    process.exit();
  } catch (error) {
    console.log("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
