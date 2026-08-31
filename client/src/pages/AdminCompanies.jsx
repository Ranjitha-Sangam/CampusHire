import { useEffect, useState } from "react";
import { getAllCompanies, deleteCompany } from "../services/api";
import "./AdminCompanies.css";
import { Link } from "react-router-dom";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");

      await deleteCompany(selectedCompany._id, token);

      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== selectedCompany._id),
      );

      setShowDeletePopup(false);
      setSelectedCompany(null);
    } catch (error) {
      console.log("Failed to delete company:", error.response?.data);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        console.log("Companies API response:", response.data);

        setCompanies(response.data.companies);
      } catch (error) {
        console.log("Failed to fetch companies:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return <h2>Loading companies...</h2>;
  }

  return (
    <div className="admin-companies">
      <div className="admin-companies-header">
        <h1>Manage Companies</h1>
        <br />
        <p>
          View and manage companies participating in campus placements.
        </p>{" "}
        <br />
        <Link to="/admin/companies/add" className="add-company-button">
          Add Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <div className="admin-companies-grid">
          {companies.map((company) => (
            <div className="admin-company-card" key={company._id}>
              <h2>{company.companyName}</h2>

              <p>
                <strong>Role:</strong> {company.role}
              </p>

              <p>
                <strong>Package:</strong> {company.package} LPA
              </p>

              <p>
                <strong>Location:</strong> {company.location}
              </p>

              <p>
                <strong>Minimum CGPA:</strong> {company.minimumCGPA}
              </p>

              <p>
                <strong>Eligible Branches:</strong>{" "}
                {company.eligibleBranches.join(", ")}
              </p>
              <div className="company-actions">
                <Link
                  to={`/admin/companies/edit/${company._id}`}
                  className="edit-company-button"
                >
                  Edit
                </Link>

                <button
                  className="delete-company-button"
                  onClick={() => {
                    setSelectedCompany(company);
                    setShowDeletePopup(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeletePopup && selectedCompany && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <div className="delete-popup-icon">!</div>

            <h2>Delete Company?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedCompany.companyName}</strong>?
            </p>

            <div className="delete-popup-buttons">
              <button
                className="cancel-delete-btn"
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedCompany(null);
                }}
              >
                Cancel
              </button>

              <button className="confirm-delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCompanies;
