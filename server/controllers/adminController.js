const Student = require("../models/Student");
const Company = require("../models/Company");
const Application = require("../models/Application");

const getDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({
      role: "student",
    });

    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Application.countDocuments();

    // const placedStudents = await Application.countDocuments({
    //   status: "Selected",
    // });

    const selectedApplications = await Application.find({
      status: "Selected",
    }).select("student");

    const placedStudents = new Set(
      selectedApplications.map((application) => application.student.toString()),
    ).size;

    const appliedCount = await Application.countDocuments({
      status: "Applied",
    });

    const oaSentCount = await Application.countDocuments({
      status: "OA Sent",
    });

    const shortlistedCount = await Application.countDocuments({
      status: "Shortlisted",
    });

    const interviewCount = await Application.countDocuments({
      status: "Interview",
    });

    const selectedCount = await Application.countDocuments({
      status: "Selected",
    });

    const rejectedCount = await Application.countDocuments({
      status: "Rejected",
    });

    const companyStats = await Company.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "company",
          as: "applications",
        },
      },
      {
        $project: {
          companyName: 1,

          totalApplications: {
            $size: "$applications",
          },

          applied: {
            $size: {
              $filter: {
                input: "$applications",
                as: "application",
                cond: {
                  $eq: ["$$application.status", "Applied"],
                },
              },
            },
          },

          oaSent: {
            $size: {
              $filter: {
                input: "$applications",
                as: "application",
                cond: {
                  $eq: ["$$application.status", "OA Sent"],
                },
              },
            },
          },

          shortlisted: {
            $size: {
              $filter: {
                input: "$applications",
                as: "application",
                cond: {
                  $eq: ["$$application.status", "Shortlisted"],
                },
              },
            },
          },

          interview: {
            $size: {
              $filter: {
                input: "$applications",
                as: "application",
                cond: {
                  $eq: ["$$application.status", "Interview"],
                },
              },
            },
          },

          selected: {
            $size: {
              $filter: {
                input: "$applications",
                as: "application",
                cond: {
                  $eq: ["$$application.status", "Selected"],
                },
              },
            },
          },

          rejected: {
            $size: {
              $filter: {
                input: "$applications",
                as: "application",
                cond: {
                  $eq: ["$$application.status", "Rejected"],
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          companyName: 1,
        },
      },
    ]);

    return res.status(200).json({
      overview: {
        totalStudents,
        totalCompanies,
        totalApplications,
        placedStudents,
      },
      applications: {
        applied: appliedCount,
        oaSent: oaSentCount,
        shortlisted: shortlistedCount,
        interview: interviewCount,
        selected: selectedCount,
        rejected: rejectedCount,
      },
      companyStats,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
