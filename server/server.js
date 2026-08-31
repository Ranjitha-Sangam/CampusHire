require("dotenv").config();
require("./config/mail");

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const aiMentorRoutes = require("./routes/aiMentorRoutes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

const createStudent = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT;

    app.get("/", (req, res) => {
      res.send("Welcome to CampusHire API  v2");
    });

    //api to register the students
    app.use("/api/students", studentRoutes);

    //api to register the company
    app.use("/api/companies", companyRoutes);

    // api to create the application
    app.use("/api/applications", applicationRoutes);

    //admin dashboard he can see placed students,rejected student
    app.use("/api/admin", adminRoutes);

    app.use("/api/ai", aiRoutes);

    app.use("/api/recruiters", recruiterRoutes);

      //Ai-mentor
    app.use("/api/ai-mentor", aiMentorRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
createStudent();
