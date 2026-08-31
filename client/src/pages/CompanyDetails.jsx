import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  BriefcaseBusiness,
  IndianRupee,
  GraduationCap,
  Code2,
  FileText,
  ArrowLeft,
} from "lucide-react";

import API from "../services/api";
import "./CompanyDetails.css";
import { CalendarDays } from "lucide-react";

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorResult, setMentorResult] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applied, setApplied] = useState(false);
  const [mentorMessage, setMentorMessage] = useState("");

  useEffect(() => {
    const fetchCompanyAndApplicationStatus = async () => {
      try {
        // Fetch company details
        const companyResponse = await API.get(`/companies/${id}`);
        setCompany(companyResponse.data.company);

        // Get student's applications
        const token = sessionStorage.getItem("token");

        const applicationResponse = await API.get(
          "/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Check whether this company is already applied
        const alreadyApplied = applicationResponse.data.applications.some(
          (application) =>
            application.company?._id === id || application.company === id,
        );

        setApplied(alreadyApplied);
      } catch (error) {
        console.log(
          "Failed to fetch company/application status:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndApplicationStatus();
  }, [id]);

  //Apply button and logic
  const handleApply = async () => {
    try {
      setApplying(true);
      setApplicationMessage("");

      const token = sessionStorage.getItem("token");

      const response = await API.post(
        `/applications/apply/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setApplied(true);

      setApplicationMessage(
        response.data.message || "Application submitted successfully!",
      );
    } catch (error) {
      console.log("Application failed:", error.response?.data);

      const message =
        error.response?.data?.message || "Failed to submit application.";

      // If already applied, also change button
      if (
        error.response?.status === 409 ||
        message.toLowerCase().includes("already applied")
      ) {
        setApplied(true);
      }

      setApplicationMessage(message);
    } finally {
      setApplying(false);
    }
  };

  const handlePlacementMentor = async () => {
    try {
      setMentorLoading(true);

      const token = sessionStorage.getItem("token");

      const response = await API.post(
        `/ai/placement-mentor/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMentorResult(response.data);
    } catch (error) {
      console.log(
        "Placement Mentor failed:",
        error.response?.data || error.message,
      );

      setMentorMessage(
        error.response?.data?.message ||
          "Failed to analyze your placement profile.",
      );
    } finally {
      setMentorLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="company-details-loading">Loading company details...</h2>
    );
  }

  if (!company) {
    return (
      <div className="company-not-found">
        <h2>Company not found</h2>

        <button onClick={() => navigate("/companies")}>
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="company-details-page">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/companies")}>
        <ArrowLeft size={18} />
        Back to Companies
      </button>

      {/* Main Card */}
      <div className="company-details-card">
        {/* Header */}
        <div className="company-details-header">
          <div className="company-logo">{company.companyName?.charAt(0)}</div>

          <div>
            <h1>{company.companyName}</h1>

            <p>
              <BriefcaseBusiness size={18} />
              {company.role}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="company-info-grid">
          <div className="company-info-box">
            <IndianRupee className="info-icon" />

            <div>
              <span>Package</span>
              <strong>{company.package} LPA</strong>
            </div>
          </div>

          <div className="company-info-box">
            <MapPin className="info-icon" />

            <div>
              <span>Location</span>
              <strong>{company.location}</strong>
            </div>
          </div>

          <div className="company-info-box">
            <CalendarDays className="info-icon" />

            <div>
              <span>Application Deadline</span>
              <strong>
                {new Date(company.applicationDeadline).toLocaleDateString(
                  "en-IN",
                )}
              </strong>
            </div>
          </div>

          <div className="company-info-box">
            <GraduationCap className="info-icon" />

            <div>
              <span>Minimum CGPA</span>
              <strong>{company.minimumCGPA}</strong>
            </div>
          </div>
        </div>

        {/* Eligible Branches */}
        <div className="details-section">
          <h2>
            <GraduationCap size={21} />
            Eligible Branches
          </h2>

          <div className="branch-list">
            {company.eligibleBranches?.map((branch, index) => (
              <span key={index} className="branch-tag">
                {branch}
              </span>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div className="details-section">
          <h2>
            <Code2 size={21} />
            Required Skills
          </h2>

          <div className="skills-list">
            {company.skillsRequired?.length > 0 ? (
              company.skillsRequired.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <p className="not-provided">Skills not specified</p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="details-section job-description">
          <h2>
            <FileText size={21} />
            Job Description
          </h2>

          <p>{company.jobDescription || "Job description not provided."}</p>
        </div>

        {/* Apply Button */}

        <div className="apply-action">
          <button
            className={`apply-btn ${applied ? "applied" : ""}`}
            onClick={handleApply}
            disabled={applying || applied}
          >
            {applying ? "Applying..." : applied ? "✓ Applied" : "Apply Now"}
          </button>

          {/* {applicationMessage && (
            <p className="application-message">{applicationMessage}</p>
          )} */}

          {applicationMessage && (
            <p
              className={`application-message ${
                applicationMessage === "Application deadline has passed."
                  ? "deadline-error"
                  : ""
              }`}
            >
              {applicationMessage}
            </p>
          )}
        </div>

        {/* Placement Mentor */}

        <div className="placement-mentor-action">
          <button
            className="placement-mentor-btn"
            onClick={handlePlacementMentor}
            disabled={mentorLoading}
          >
            {mentorLoading
              ? "Analyzing your profile..."
              : "Check Placement Mentor"}
          </button>
        </div>

        {mentorResult && (
          <div className="mentor-result">
            <h2>AI Placement Analysis</h2>

            {/* Placement Probability */}

            <div className="placement-probability">
              <span>Placement Match</span>

              <strong>{mentorResult.placementProbability}%</strong>
            </div>

            {/* Should Apply */}

            <div
              className={`apply-status ${
                mentorResult.shouldApply ? "should-apply" : "not-recommended"
              }`}
            >
              {mentorResult.shouldApply
                ? "✓ You are eligible to apply"
                : "✕ You may not be eligible"}
            </div>

            {/* Strengths */}

            <div className="mentor-section">
              <h3>Your Strengths</h3>

              <ul>
                {mentorResult.strengths?.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            {/* Missing Skills */}

            <div className="mentor-section">
              <h3>Skills to Improve</h3>

              <div className="mentor-tags">
                {mentorResult.missingSkills?.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Recommendations */}

            <div className="mentor-section">
              <h3>Recommendations</h3>

              <ul>
                {mentorResult.recommendations?.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>

            {/* Learning Roadmap */}

            <div className="mentor-section">
              <h3>Learning Roadmap</h3>

              <ol>
                {mentorResult.learningRoadmap?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* AI Reason */}

            <div className="mentor-reason">
              <h3>AI Assessment</h3>

              <p>{mentorResult.reason}</p>
            </div>
          </div>
        )}
      </div>
      {mentorMessage && (
        <div className="popup-overlay">
          <div className="popup-box error-popup">
            <div className="popup-icon">✕</div>

            <h2>Something went wrong</h2>

            <p>{mentorMessage}</p>

            <button onClick={() => setMentorMessage("")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDetails;
