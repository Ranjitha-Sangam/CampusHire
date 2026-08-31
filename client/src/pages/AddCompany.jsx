import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../services/api";
import "./AddCompany.css";

function AddCompany() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    jobDescription: "",
    package: "",
    location: "",
    eligibleBranches: "",
    minimumCGPA: "",
    skillsRequired: "",
    applicationDeadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      const companyData = {
        ...formData,
        package: Number(formData.package),
        minimumCGPA: Number(formData.minimumCGPA),

        eligibleBranches: formData.eligibleBranches
          .split(",")
          .map((branch) => branch.trim()),

        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim()),
      };

      const response = await createCompany(companyData, token);

      console.log("Company created:", response.data);
      navigate("/admin/companies");
    } catch (error) {
      console.log("Failed to create company:", error.response?.data);
    }
  };

  return (
    <div className="add-company-page">
      <div className="add-company-container">
        <h1>Add Company</h1>
        <p>Add a new company to the campus placement portal.</p>

        <form onSubmit={handleSubmit}>
          <input
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <input
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
          />

          <textarea
            name="jobDescription"
            placeholder="Job Description"
            value={formData.jobDescription}
            onChange={handleChange}
          />

          <input
            name="package"
            type="number"
            placeholder="Package (LPA)"
            value={formData.package}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <input
            name="eligibleBranches"
            placeholder="Eligible Branches (e.g. MCA, CSE)"
            value={formData.eligibleBranches}
            onChange={handleChange}
          />

          <input
            name="minimumCGPA"
            type="number"
            step="0.1"
            placeholder="Minimum CGPA"
            value={formData.minimumCGPA}
            onChange={handleChange}
          />

          <input
            name="skillsRequired"
            placeholder="Required Skills (e.g. Java, SQL, React)"
            value={formData.skillsRequired}
            onChange={handleChange}
          />

          <input
            name="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={handleChange}
          />
          <button type="submit">Add Company</button>
        </form>
      </div>
    </div>
  );
}

export default AddCompany;
