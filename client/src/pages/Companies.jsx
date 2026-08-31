import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCompanies } from "../services/api";
import "./Companies.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
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
    return <h2 className="companies-loading">Loading companies...</h2>;
  }

  return (
    <div className="companies-page">
      <div className="companies-header">
        <h1>Companies</h1>
        <p>Explore available job opportunities.</p>
      </div>

      {companies.length === 0 ? (
        <div className="no-companies">
          <h2>No Companies Available</h2>
          <p>Please check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="companies-grid">
          {companies.map((company) => (
            <div className="company-card" key={company._id}>
              <div className="company-card-header">
                <h2>{company.companyName}</h2>
                <p>{company.role}</p>
              </div>

              <div className="company-details">
                <div>
                  <span>Package</span>
                  <strong>{company.package} LPA</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{company.location}</strong>
                </div>
              </div>

              <div className="eligible-branches">
                <span>Eligible Branches</span>

                <p>{company.eligibleBranches?.join(", ")}</p>
              </div>

              <Link
                to={`/companies/${company._id}`}
                className="view-details-btn"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Companies;
