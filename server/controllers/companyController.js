const Company = require("../models/Company");
const Student = require("../models/Student");
const Application = require("../models/Application");

const createCompany = async (req, res) => {
  const {
    companyName,
    role,
    jobDescription,
    package,
    location,
    eligibleBranches,
    minimumCGPA,
    skillsRequired,
    applicationDeadline,
  } = req.body;
  if (
    !companyName ||
    !role ||
    !jobDescription ||
    !package ||
    !location ||
    !eligibleBranches ||
    !minimumCGPA ||
    !skillsRequired ||
    !applicationDeadline
  ) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }
  const existingCompany = await Company.findOne({ companyName, role });
  if (existingCompany) {
    return res.status(400).json({
      message: "Company already exists for this role",
    });
  }
  const company = new Company({
    companyName,
    role,
    jobDescription,
    package,
    location,
    eligibleBranches,
    minimumCGPA,
    skillsRequired,
    applicationDeadline,
  });
  await company.save();
  return res.status(201).json({
    message: "Company created successfully",
    company: {
      id: company._id,
      companyName: company.companyName,
      role: company.role,
      jobDescription: company.jobDescription,
      package: company.package,
      location: company.location,
      eligibleBranches: company.eligibleBranches,
      minimumCGPA: company.minimumCGPA,
      skillsRequired: company.skillsRequired,
      applicationDeadline: company.applicationDeadline,
    },
  });
};

//get all companies
const getAllCompanies = async (req, res) => {
  const {
    search,
    location,
    branch,
    role,
    minPackage,
    page = 1,
    limit = 10000,
  } = req.query;
  const filter = {};
  //pagination
  const skip = (Number(page) - 1) * Number(limit);
  if (search) {
    filter.companyName = {
      $regex: search,
      $options: "i",
    };
  }

  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  if (role) {
    filter.role = {
      $regex: role,
      $options: "i",
    };
  }

  if (branch) {
    filter.eligibleBranches = branch;
  }

  if (minPackage) {
    filter.package = {
      $gte: Number(minPackage),
    };
  }

  //pagination
  const companies = await Company.find(filter).skip(skip).limit(Number(limit));
  const totalCompanies = await Company.countDocuments(filter);
  const totalPages = Math.ceil(totalCompanies / Number(limit));

  return res.status(200).json({
    message: "Companies fetched successfully",
    count: companies.length,
    companies,
  });
};

//get specific company by id
const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const company = await Company.findById(id);
  if (!company) {
    return res.status(404).json({
      message: "Company not found",
    });
  }
  return res.status(200).json({
    message: "Company fetched successfully",
    company,
  });
};

//update company data
const updateCompany = async (req, res) => {
  const { id } = req.params;
  const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedCompany) {
    return res.status(404).json({
      message: "Company not found",
    });
  }

  return res.status(200).json({
    message: "Company updated successfully",
    company: updatedCompany,
  });
};

//to delete company
const deleteCompany = async (req, res) => {
  const { id } = req.params;
  const deletedCompany = await Company.findByIdAndDelete(id);

  if (!deletedCompany) {
    return res.status(404).json({
      message: "Company not found",
    });
  }

  // Delete all applications related to this company
  await Application.deleteMany({
    company: id,
  });

  return res.status(200).json({
    message: "Company and related applications deleted successfully",
    company: deletedCompany,
  });
};

const getRecommendedCompanies = async (req, res) => {

  try {
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }



    const companies = await Company.find({
      eligibleBranches: student.branch,
      minimumCGPA: { $lte: student.cgpa },
      applicationDeadline: { $gte: new Date() },
    }).sort({ createdAt: -1 });


    return res.status(200).json({
      message: "Recommended companies fetched successfully",
      count: companies.length,
      companies,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getRecommendedCompanies,
};
