import { useEffect, useState } from "react";
import { getAllApplications, updateApplicationStatus } from "../services/api";
import "./AdminApplications.css";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = sessionStorage.getItem("token");

      await updateApplicationStatus(applicationId, newStatus, token);

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );
    } catch (error) {
      console.log("Failed to update application status:", error.response?.data);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await getAllApplications(token);
        setApplications(response.data.applications);
      } catch (error) {
        console.log("Failed to fetch applications:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <h2 className="applications-loading">Loading applications...</h2>;
  }

  return (
    <div className="admin-applications">
      <div className="applications-header">
        <h1>All Applications</h1>

        <p>Review student applications and update their status.</p>
      </div>

      {applications.length === 0 ? (
        <p className="no-applications">No applications found.</p>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <div className="application-card" key={application._id}>
              {/* Student */}
              <div className="student-info">
                <h2>{application.student.name}</h2>

                <p>{application.student.email}</p>
              </div>

              {/* Student academic information */}
              <div className="student-details">
                <div>
                  <span>Branch</span>
                  <strong>{application.student.branch}</strong>
                </div>

                <div>
                  <span>CGPA</span>
                  <strong>{application.student.cgpa}</strong>
                </div>
              </div>

              {/* Company */}
              <div className="company-info">
                <h3>{application.company.companyName}</h3>

                <p>{application.company.role}</p>

                <span>{application.company.package} LPA</span>
              </div>

              {/* Status */}
              <div className="application-status">
                <label>Application Status</label>

                <select
                  className={`status-${application.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  value={application.status}
                  onChange={(e) =>
                    handleStatusChange(application._id, e.target.value)
                  }
                >
                  <option value="Applied">Applied</option>
                  <option value="OA Sent">OA Sent</option>
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
  );
}

export default AdminApplications;
