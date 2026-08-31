import { Link } from "react-router-dom";

function CompanyCard({ company }) {
  return (
    <div>
      <h2>{company.companyName}</h2>
      <p>Role: {company.role}</p>
      <p>Package: {company.package} LPA</p>
      <p>Eligible Branches: {company.eligibleBranches.join(", ")}</p>
      <Link to={`/companies/${company._id}`}>View Details</Link>
      <br /> <br />
    </div>
  );
}

export default CompanyCard;
