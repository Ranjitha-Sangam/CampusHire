const Application = require("../models/Application");
const Company = require("../models/Company");
const sendEmail = require("../utils/sendEmail");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");

const applyForJob = async (req, res) => {
  try {
    if (req.student.role !== "student") {
      return res.status(403).json({
        message: "Only students can apply for jobs.",
      });
    }
    const studentId = req.student.id;
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
      });
    }

    if (company.applicationDeadline < new Date()) {
      return res.status(400).json({
        message: "Application deadline has passed.",
      });
    }

    const existingApplication = await Application.findOne({
      student: studentId,
      company: companyId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied to this company.",
      });
    }

    const application = await Application.create({
      student: studentId,
      company: companyId,
    });
    //to send email confirmation to an student
    const student = await Student.findById(studentId);

    await sendEmail(
      student.email,
      "Application Submitted Successfully",
      `Hi ${student.name},

Your application for the role of ${company.role} at ${company.companyName} has been submitted successfully.

Current Status: Applied

Best of luck!

CampusHire Team`,
    );

    return res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//get all the applications of a student
const getMyApplications = async (req, res) => {
  try {
    // 1. Get logged-in student's ID from JWT
    const studentId = req.student.id;

    // 2. Fetch all applications of the student
    const applications = await Application.find({
      student: studentId,
    }).populate("company", "companyName role package location ");

    // 3. Return response
    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications (Admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email cgpa branch -_id")
      .populate("company", "companyName role package location -_id");

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Updating the application  status of a student by admin
const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application Not Found",
      });
    }
    const validStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }
    application.status = status;
    await application.save();

    //sending email after status is changed
    const student = await Student.findById(application.student);
    const company = await Company.findById(application.company);

    await sendEmail(
      student.email,
      `Application Status Updated - ${company.companyName}`,
      `Hi ${student.name},

Your application status for the role of ${company.role} at ${company.companyName} has been updated.

New Status: ${status}

Thank you for using CampusHire.

CampusHire Team`,
    );

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get applications for the recruiter's company
const getRecruiterApplications = async (req, res) => {
  try {
    const companyId = req.recruiter.companyId;
    const applications = await Application.find({
      company: companyId,
    })
      .populate("student", "name email usn branch cgpa")
      .populate("company", "companyName role package");

    return res.status(200).json({
      message: "Recruiter applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Error fetching recruiter applications:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update application status by recruiter
const updateRecruiterApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const validStatuses = ["Shortlisted", "Interview", "Selected", "Rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    // Find application and ensure it belongs to this recruiter's company
    const application = await Application.findOne({
      _id: applicationId,
      company: req.recruiter.companyId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found for your company.",
      });
    }

    application.status = status;
    await application.save();

    // Send status update email to student
    const student = await Student.findById(application.student);
    const company = await Company.findById(application.company);

    await sendEmail(
      student.email,
      `Application Status Updated - ${company.companyName}`,
      `Hi ${student.name},

Your application status for the role of ${company.role} at ${company.companyName} has been updated.

New Status: ${status}

Thank you for participating in the recruitment process.

CampusHire Team`,
    );

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//To send OA link for all the rigistered studnets
const sendOALink = async (req, res) => {
  try {
    const { oaLink } = req.body;

    if (!oaLink) {
      return res.status(400).json({
        message: "Please provide an OA link",
      });
    }

    // Get logged-in recruiter's company
    const companyId = req.recruiter.companyId;

    // Find only applications belonging to this company
    const applications = await Application.find({
      company: companyId,
      status: "Applied",
    })
      .populate("student", "name email")
      .populate("company", "companyName");

    if (applications.length === 0) {
      return res.status(404).json({
        message: "No valid applications found",
      });
    }

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to each selected student
    for (const application of applications) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: application.student.email,
        subject: `Online Assessment Invitation - ${application.company.companyName}`,

        html: `
  <h2>Hello ${application.student.name},</h2>
  
  <p>
    You have been invited to attend the Online Assessment for
    <strong>${application.company.companyName}</strong>.
  </p>
  
  <p>
    <strong>Company:</strong>
    ${application.company.companyName}
  </p>

  <p>
    <strong>Assessment Link:</strong>
    <a href="${oaLink}">${oaLink}</a>
  </p>

  <p>Best of luck!</p>
  
  <p>
    Regards,<br/>
    <strong>${application.company.companyName} Recruitment Team</strong>
  </p>
`,
      });

  // Update application status after email is sent
      application.status = "OA Sent";
      await application.save();
    }

    return res.status(200).json({
      message: `OA link sent successfully to ${applications.length} student(s)`,
    });
  } catch (error) {
    console.error("Error sending OA link:", error);

    return res.status(500).json({
      message: "Failed to send OA link",
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getRecruiterApplications,
  updateRecruiterApplicationStatus,
  sendOALink,
};
