require("dotenv").config();

const mongoose = require("mongoose");
const Student = require("../models/Student");
const bcrypt = require("bcrypt");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
    const admin = await Student.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (admin) {
      console.log("Admin already exists.");
      return;
    }
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Student.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
