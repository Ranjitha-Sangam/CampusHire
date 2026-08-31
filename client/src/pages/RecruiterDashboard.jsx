import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecruiterApplications,
  sendOALink,
  updateRecruiterApplicationStatus,
} from "../services/api";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oaLink, setOaLink] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem("recruiterToken");
    sessionStorage.removeItem("role");

    navigate("/recruiter/login");
  };

  const handleSendOALink = async () => {
    if (!oaLink) {
      setMessageType("error");
      setMessage("Please enter the OA link");
      return;
    }

    try {
      const token = sessionStorage.getItem("recruiterToken");
      const response = await sendOALink(
        {
          oaLink: oaLink,
        },
        token,
      );
      setMessageType("success");
      setMessage(response.data.message);

      // Clear OA link after sending
      setOaLink("");
    } catch (error) {
      console.log("Failed to send OA link:", error.response?.data);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to send OA link");
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = sessionStorage.getItem("recruiterToken");

      await updateRecruiterApplicationStatus(applicationId, newStatus, token);

      // Update status immediately in UI
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );

      setMessage("Application status updated successfully");
    } catch (error) {
      console.log("Failed to update application status:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Failed to update application status",
      );
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = sessionStorage.getItem("recruiterToken");
        const response = await getRecruiterApplications(token);
        console.log("Recruiter applications:", response.data);
        setApplications(response.data.applications);
      } catch (error) {
        console.log(
          "Failed to fetch recruiter applications:",
          error.response?.data,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <h2>Loading applications...</h2>;
  }

  return (
    <div className="recruiter-dashboard">
      <div className="recruiter-header">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>Manage applicants and send online assessment links.</p>
        </div>
        <button className="recruiter-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* OA LINK SECTION */}
      <div className="oa-section">
        <div>
          <h2>Send Online Assessment</h2>
          <p>
            The assessment link will be sent to all students with
            <strong> Applied </strong> status.
          </p>
        </div>

        <div className="oa-form">
          <input
            type="url"
            placeholder="Paste OA link here..."
            value={oaLink}
            onChange={(e) => setOaLink(e.target.value)}
          />

          <button onClick={handleSendOALink}>Send OA Link</button>
        </div>
      </div>

      {message && (
        <div className="custom-popup">
          <div className={`popup-content ${messageType}`}>
            <div className="popup-icon">
              {messageType === "success" ? "✓" : "✕"}
            </div>

            <h3>{messageType === "success" ? "Success!" : "Failed!"}</h3>

            <p>{message}</p>

            <button onClick={() => setMessage("")}>
              {messageType === "success" ? "OK" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* APPLICATIONS */}
      <div className="applications-section">
        <div className="applications-heading">
          <div>
            <h2>Applicants</h2>
            <p>{applications.length} students applied for your company</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <p>No applications found.</p>
          </div>
        ) : (
          <div className="applications-table">
            {/* TABLE HEADER */}
            <div className="table-header">
              <span>Student</span>
              <span>Contact</span>
              <span>Academic Details</span>
              <span>Position</span>
              <span>Status</span>
            </div>

            {/* APPLICATION ROWS */}
            {applications.map((application) => (
              <div className="application-row" key={application._id}>
                {/* STUDENT */}
                <div className="student-column">
                  <div className="student-avatar">
                    {application.student.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{application.student.name}</h3>
                    <p>{application.student.usn}</p>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="contact-column">
                  <p>{application.student.email}</p>
                </div>

                {/* ACADEMIC */}
                <div className="academic-column">
                  <p>
                    <strong>{application.student.branch}</strong>
                  </p>
                  <span>CGPA: {application.student.cgpa}</span>
                </div>

                {/* JOB */}
                <div className="job-column">
                  <h4>{application.company.role}</h4>
                  <p>{application.company.package} LPA</p>
                </div>

                {/* STATUS */}
                <div>
                  <select
                    className={`application-status ${application.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                    value={application.status}
                    onChange={(e) =>
                      handleStatusChange(application._id, e.target.value)
                    }
                  >
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
