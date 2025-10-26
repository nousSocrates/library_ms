import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected for seeding"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: "noussocrates@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Skipping seeding.");
      mongoose.connection.close();
      return;
    }

    const adminUser = new User({
      name: "nousSocrates", // ✅ Add this line
      firstName: "Phelix",
      lastName: "Ouma",
      email: "noussocrates@gmail.com",
      password: "nousAdmin",
      role: "admin",
      gender: "Male",
      phone: "0700000000",
    });

    await adminUser.save();
    console.log("✅ Admin user seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    mongoose.connection.close();
  }
};

seedAdmin();
