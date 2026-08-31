import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { updateCompany } from "../services/api";
import "./EditCompany.css";

function EditCompany() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/companies/${id}`,
        );

        const company = response.data.company;

        setFormData({
          companyName: company.companyName,
          role: company.role,
          jobDescription: company.jobDescription,
          package: company.package,
          location: company.location,
          eligibleBranches: company.eligibleBranches.join(", "),
          minimumCGPA: company.minimumCGPA,
          skillsRequired: company.skillsRequired.join(", "),
          applicationDeadline: company.applicationDeadline.split("T")[0],
        });
      } catch (error) {
        console.log("Failed to fetch company:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

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

      await updateCompany(id, companyData, token);
      navigate("/admin/companies");
    } catch (error) {
      console.log("Failed to update company:", error.response?.data);
    }
  };

  if (loading) {
    return <h2>Loading company...</h2>;
  }
  return (
    <div className="edit-company-page">
      <div className="edit-company-container">
        <h1>Edit Company</h1>

        <p>Update the company details for campus placements.</p>

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

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditCompany;
