import { useEffect, useState } from "react";
import { getMyApplications } from "../services/api";
import "./MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await getMyApplications(token);
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
    <div className="my-applications">
      <div className="my-applications-header">
        <h1>My Applications</h1>
        <br />
        <p>Track the status of your job applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h2>No Applications Yet</h2>

          <p>You haven't applied to any companies yet.</p>
        </div>
      ) : (
        <div className="my-applications-grid">
          {applications.map((application) => (
            <div className="my-application-card" key={application._id}>
              {/* Company Information */}

              <div className="application-company">
                <h2>{application.company.companyName}</h2>

                <p>{application.company.role}</p>
              </div>

              {/* Job Details */}

              <div className="application-details">
                <div>
                  <span>Package</span>

                  <strong>{application.company.package} LPA</strong>
                </div>

                <div>
                  <span>Location</span>

                  <strong>{application.company.location}</strong>
                </div>
              </div>

              {/* Application Status */}

              <div className="application-status">
                <span>Status</span>

                <strong
                  className={`status-${application.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {application.status}
                </strong>
              </div>

              {/* Applied Date */}

              <div className="applied-date">
                Applied on{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
