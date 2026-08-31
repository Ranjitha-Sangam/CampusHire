const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const registerStudent = async (req, res) => {
  try {
    const { name, usn, email, branch, cgpa, password } = req.body;
    const existingEmail = await Student.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const existingUSN = await Student.findOne({ usn });

    if (existingUSN) {
      console.log("USN ALREADY EXISTS");

      return res.status(400).json({
        message: "USN is already registered",
      });
    }
    //to hash the passwrods
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      usn,
      email,
      branch,
      cgpa,
      //storing the hashed password instaed of plain pw
      password: hashedPassword,
    });

    await student.save();

    res.status(201).json({
      message: "Student Registered Successfully",
      student: {
        id: student._id,
        name: student.name,
        usn: student.usn,
        email: student.email,
        branch: student.branch,
        cgpa: student.cgpa,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//login student controller
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }
  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: student._id,
      email: student.email,
      role: student.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  return res.status(200).json({
    message: "Login Successful",
    token,
    student: {
      id: student._id,
      name: student.name,
      usn: student.usn,
      email: student.email,
      branch: student.branch,
      cgpa: student.cgpa,
    },
  });
};

//FORGOT PASSOWRD FUNCTION to SEND EMAIL
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: "No student found with this email.",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token
    student.resetPasswordToken = hashedToken;

    // Token valid for 15 minutes
    student.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await student.save();

    // Reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    // Send email
    await sendEmail(
      student.email,
      "CampusHire Password Reset",
      `Hi ${student.name},

You requested to reset your CampusHire password.

Click the link below to reset your password:

${resetLink}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.

CampusHire Team`,
    );

    return res.status(200).json({
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to send password reset email.",
    });
  }
};

//RESET PASSWORD FUNCTION
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find student with valid token
    const student = await Student.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!student) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    student.password = hashedPassword;

    // Remove reset token
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;

    await student.save();

    return res.status(200).json({
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password.",
    });
  }
};

//student profile
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//update profile
const updateProfile = async (req, res) => {
  try {
    const studentId = req.student.id;
    const updates = { ...req.body };
    const allowedUpdates = [
      "name",
      "phone",
      "cgpa",
      "skills",
      "github",
      "linkedin",
    ];
    const isValidOperation = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key),
    );
    if (!isValidOperation) {
      return res.status(400).json({
        message: "Invalid updates!",
      });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    Object.keys(updates).forEach((key) => {
      student[key] = updates[key];
    });
    await student.save();

    const updatedStudent =
      await Student.findById(studentId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//soft deleting the student
const deleteProfile = async (req, res) => {
  try {
    const studentId = req.student.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    student.isActive = false;
    await student.save();
    return res.status(200).json({
      message: "Account deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//to upload the resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "CampusHire/Resumes",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      {
        resume: result.secure_url,
        resumeName: req.file.originalname,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: student.resume,
      resumeName: student.resumeName,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error uploading resume",
    });
  }
};

//to get all students by search(filter)
const getAllStudents = async (req, res) => {
  try {
    const { search, branch, placementStatus } = req.query;

    const filter = {
      role: "student",
    };

    // Search by name or USN
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          usn: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by branch
    if (branch) {
      filter.branch = branch;
    }

    // Filter by placement status
    if (placementStatus) {
      filter.placementStatus = placementStatus;
    }

    const students = await Student.find(filter)
      .select("-password")
      .sort({ name: 1 });

    return res.status(200).json({
      message: "Students fetched successfully",
      count: students.length,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadResume,
  getAllStudents,
  forgotPassword,
  resetPassword,
};
