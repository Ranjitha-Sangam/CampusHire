import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  FileText,
  GraduationCap,
  Send,
  Trophy,
  BriefcaseBusiness,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import {
  getStudentProfile,
  getAdminDashboard,
  getAllCompanies,
  getMyApplications,
  getRecommendedCompanies,
  getPendingRecruiters,
  updateRecruiterStatus,
} from "../services/api";

import Navbar from "../components/Navbar";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendedCompanies, setRecommendedCompanies] = useState([]);
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [recruiterMessage, setRecruiterMessage] = useState("");

  useEffect(() => {
    const fetchPendingRecruiters = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await getPendingRecruiters(token);

        setPendingRecruiters(response.data.recruiters);
      } catch (error) {
        console.log(
          "Failed to fetch pending recruiters:",
          error.response?.data,
        );
      }
    };

    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const profileResponse = await getStudentProfile(token);
        const profile = profileResponse.data.student;

        setStudent(profile);

        if (profile.role === "admin") {
          const dashboardResponse = await getAdminDashboard(token);

          setDashboard(dashboardResponse.data);
        } else {
          const [companiesResponse, applicationsResponse, recommendedResponse] =
            await Promise.all([
              getAllCompanies(),
              getMyApplications(token),
              getRecommendedCompanies(token),
            ]);

          setCompanies(companiesResponse.data.companies);
          setApplications(applicationsResponse.data.applications);
          setRecommendedCompanies(recommendedResponse.data.companies);
        }
      } catch (error) {
        console.log(
          "Failed to fetch dashboard:",
          error.response?.data || error.message,
        );
      }
    };

    fetchData();

    // Fetch pending recruiter requests
    fetchPendingRecruiters();
  }, []);

  if (!student) {
    return <h2>Loading...</h2>;
  }

  if (location.pathname === "/admin/dashboard" && student.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRecruiterStatus = async (recruiterId, status) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await updateRecruiterStatus(recruiterId, status, token);

      setRecruiterMessage(response.data.message);

      // Remove recruiter from pending list immediately
      setPendingRecruiters((prev) =>
        prev.filter((recruiter) => recruiter._id !== recruiterId),
      );
    } catch (error) {
      console.log("Failed to update recruiter status:", error.response?.data);

      setRecruiterMessage(
        error.response?.data?.message || "Failed to update recruiter status",
      );
    }
  };

  return (
    <div>
      {student.role === "admin" ? (
        <div className="admin-dashboard">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <h1>Welcome, {student.name}</h1>
            <p>Placement Officer Dashboard</p>
            <span>Manage students, companies and applications.</span>
          </div>

    
          {dashboard && (
            <>
              {/* Overview */}
              <h2 className="section-title">Overview</h2>

              <div className="stats-grid">
                {/* Total Students */}
                <div className="stat-card">
                  <Users className="stat-icon" />
                  <h3>{dashboard.overview.totalStudents}</h3>
                  <p>Total Students</p>
                </div>

                {/* Total Companies */}
                <div className="stat-card">
                  <Building2 className="stat-icon" />
                  <h3>{dashboard.overview.totalCompanies}</h3>
                  <p>Total Companies</p>
                </div>

                {/* Total Applications */}
                <div className="stat-card">
                  <FileText className="stat-icon" />
                  <h3>{dashboard.overview.totalApplications}</h3>
                  <p>Total Applications</p>
                </div>

                {/* Placed Students */}
                <div className="stat-card">
                  <GraduationCap className="stat-icon" />
                  <h3>{dashboard.overview.placedStudents}</h3>
                  <p>Placed Students</p>
                </div>
              </div>

              {/* Application Status */}
              <h2 className="section-title">Application Status</h2>

              <div className="status-grid">
                <div className="status-card">
                  <h3>{dashboard.applications.applied}</h3>
                  <p>Applied</p>
                </div>

                <div className="status-card">
                  <h3>{dashboard.applications.oaSent}</h3>
                  <p>OA Sent</p>
                </div>

                <div className="status-card">
                  <h3>{dashboard.applications.shortlisted}</h3>
                  <p>Shortlisted</p>
                </div>

                <div className="status-card">
                  <h3>{dashboard.applications.interview}</h3>
                  <p>Interview</p>
                </div>

                <div className="status-card">
                  <h3>{dashboard.applications.selected}</h3>
                  <p>Selected</p>
                </div>

                <div className="status-card">
                  <h3>{dashboard.applications.rejected}</h3>
                  <p>Rejected</p>
                </div>
              </div>
              {/* Company-wise Statistics */}
              <h2 className="section-title">Company-wise Statistics</h2>

              <div className="company-stats-container">
                {dashboard.companyStats?.length === 0 ? (
                  <p>No company application data available.</p>
                ) : (
                  <div className="company-stats-table">
                    <div className="company-stats-header">
                      <span>Company</span>
                      <span>Total Applied</span>
                      <span>Applied</span>
                      <span>OA Sent</span>
                      <span>Shortlisted</span>
                      <span>Interview</span>
                      <span>Selected</span>
                      <span>Rejected</span>
                    </div>

                    {dashboard.companyStats?.map((company) => (
                      <div className="company-stats-row" key={company._id}>
                        <strong>{company.companyName}</strong>
                        <span>{company.totalApplications}</span>
                        <span>{company.applied}</span>
                        <span>{company.oaSent}</span>
                        <span>{company.shortlisted}</span>
                        <span>{company.interview}</span>
                        <span>{company.selected}</span>
                        <span>{company.rejected}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <h2 className="student-section-title">
                Pending Recruiter Requests
              </h2>

              {pendingRecruiters.length === 0 ? (
                <div className="no-recommendations">
                  <h3>No pending recruiter requests</h3>
                  <p>All recruiter registration requests have been reviewed.</p>
                </div>
              ) : (
                <div className="pending-recruiters-grid">
                  {pendingRecruiters.map((recruiter) => (
                    <div className="pending-recruiter-card" key={recruiter._id}>
                      <h3>{recruiter.name}</h3>

                      <p>
                        <strong>Email:</strong> {recruiter.email}
                      </p>

                      <p>
                        <strong>Company:</strong>{" "}
                        {recruiter.company?.companyName || "N/A"}
                      </p>

                      <div className="recruiter-action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleRecruiterStatus(recruiter._id, "Approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleRecruiterStatus(recruiter._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Student Dashboard */
        <div className="student-dashboard">
          {/* Welcome Section */}

          <div className="student-welcome">
            <div>
              <h1>Welcome back, {student.name} </h1>
              <p>
                Track your placement journey and stay updated with new
                opportunities.
              </p>
            </div>

            <div className="student-summary">
              <span>{student.usn}</span>

              <span>{student.branch}</span>
              <span>CGPA: {student.cgpa}</span>
              <span>{student.placementStatus}</span>
            </div>
          </div>

          {/* Statistics */}

          <h2 className="student-section-title">Placement Overview</h2>

          <div className="student-stats-grid">
            <div className="student-stat-card">
              <Building2 />
              <h3>{companies.length}</h3>
              <p>Available Companies</p>
            </div>

            <div className="student-stat-card">
              <FileText />
              <h3>{applications.length}</h3>
              <p>My Applications</p>
            </div>

            <div className="student-stat-card">
              <Send />
              <h3>
                {
                  applications.filter(
                    (application) => application.status === "OA Sent",
                  ).length
                }
              </h3>

              <p>OA Sent</p>
            </div>

            <div className="student-stat-card">
              <Trophy />
              <h3>
                {
                  applications.filter(
                    (application) => application.status === "Selected",
                  ).length
                }
              </h3>

              <p>Selected</p>
            </div>
          </div>

          {/* Placement Progress */}

          <h2 className="student-section-title">Placement Journey</h2>

          <div className="placement-progress">
            <div className="progress-step">
              <div className="progress-icon">
                <FileText size={20} />
              </div>

              <span>Applied</span>

              <strong>
                {
                  applications.filter(
                    (application) => application.status === "Applied",
                  ).length
                }
              </strong>
            </div>

            <ArrowRight className="progress-arrow" />

            <div className="progress-step">
              <div className="progress-icon">
                <Send size={20} />
              </div>

              <span>OA Sent</span>

              <strong>
                {
                  applications.filter(
                    (application) => application.status === "OA Sent",
                  ).length
                }
              </strong>
            </div>

            <ArrowRight className="progress-arrow" />

            <div className="progress-step">
              <div className="progress-icon">
                <CheckCircle2 size={20} />
              </div>

              <span>Shortlisted</span>

              <strong>
                {
                  applications.filter(
                    (application) => application.status === "Shortlisted",
                  ).length
                }
              </strong>
            </div>

            <ArrowRight className="progress-arrow" />

            <div className="progress-step">
              <div className="progress-icon">
                <BriefcaseBusiness size={20} />
              </div>

              <span>Interview</span>

              <strong>
                {
                  applications.filter(
                    (application) => application.status === "Interview",
                  ).length
                }
              </strong>
            </div>

            <ArrowRight className="progress-arrow" />

            <div className="progress-step">
              <div className="progress-icon">
                <Trophy size={20} />
              </div>

              <span>Selected</span>

              <strong>
                {
                  applications.filter(
                    (application) => application.status === "Selected",
                  ).length
                }
              </strong>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="section-title quick-actions-title">Quick Actions</h2>

          <div className="quick-actions-grid">
            {/* Browse Companies */}
            <div
              className="quick-action-card"
              onClick={() => navigate("/companies")}
            >
              <Building2 className="quick-action-icon" />

              <div>
                <h3>Browse Companies</h3>
                <p>Explore available placement opportunities.</p>
              </div>

              <span className="quick-action-arrow">→</span>
            </div>

            {/* My Applications */}
            <div
              className="quick-action-card"
              onClick={() => navigate("/my-applications")}
            >
              <FileText className="quick-action-icon" />

              <div>
                <h3>My Applications</h3>
                <p>Track your application status.</p>
              </div>

              <span className="quick-action-arrow">→</span>
            </div>

            {/* My Profile */}
            <div
              className="quick-action-card"
              onClick={() => navigate("/profile")}
            >
              <GraduationCap className="quick-action-icon" />

              <div>
                <h3>My Profile</h3>
                <p>Update your academic information.</p>
              </div>

              <span className="quick-action-arrow">→</span>
            </div>
          </div>

          {/* Recommended Companies */}

          <section className="recommended-section">
            <div className="recommended-header">
              <div>
                <h2>Recommended for You</h2>
                <p>Companies matching your branch and CGPA.</p>
              </div>

              <button
                className="view-all-btn"
                onClick={() => navigate("/companies")}
              >
                View All →
              </button>
            </div>

            {recommendedCompanies.length === 0 ? (
              <div className="no-recommendations">
                <Building2 size={35} />

                <h3>No recommendations available</h3>

                <p>Check the Companies page for new placement opportunities.</p>
              </div>
            ) : (
              <div className="recommended-grid">
                {recommendedCompanies.slice(0, 3).map((company) => (
                  <div
                    className="recommended-card"
                    key={company._id}
                    onClick={() => navigate(`/companies/${company._id}`)}
                  >
                    <div className="recommended-company-icon">
                      <Building2 size={24} />
                    </div>

                    <div className="recommended-card-content">
                      <h3>{company.companyName}</h3>

                      <p className="recommended-role">{company.role}</p>

                      <div className="recommended-info">
                        <span>{company.package} LPA</span>

                        <span>
                          <MapPin size={15} />
                          {company.location}
                        </span>
                      </div>
                    </div>

                    <span className="recommended-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
