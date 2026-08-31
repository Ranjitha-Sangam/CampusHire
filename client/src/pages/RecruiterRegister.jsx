import { useEffect, useState } from "react";
import { getAllCompanies, registerRecruiter } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./RecruiterRegister.css";

function RecruiterRegister() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
  });

  // Fetch companies added by admin
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();

        setCompanies(response.data.companies);
      } catch (error) {
        console.log("Failed to fetch companies:", error.response?.data);
      }
    };

    fetchCompanies();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Register recruiter
  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setMessage(
        "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number.",
      );
      return;
    }

    try {
      await registerRecruiter(formData);
      setMessage("Registration successful! Please login.");
      setMessageType("success");
    } catch (error) {
      console.log("Registration failed:", error.response?.data);

      setMessage(error.response?.data?.message || "Registration failed");
      setMessageType("error");
    }
  };

  return (
    <div className="recruiter-register-page">
      <div className="recruiter-register-card">
        <div className="recruiter-register-header">
          <h1>CampusHire</h1>
          <p>Create your recruiter account and manage your hiring journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="recruiter-form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="recruiter-form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="recruiter-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="recruiter-form-group">
            <label>Company</label>

            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
            >
              <option value="">Select your company</option>

              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="recruiter-register-btn">
            Register
          </button>
        </form>

        {message && (
          <div className="custom-popup">
            <div className="custom-popup-content">
              <div className={`popup-icon ${messageType}`}>
                {messageType === "success" ? "✓" : "✕"}
              </div>

              <h2>
                {messageType === "success"
                  ? "Registration Successful!"
                  : "Registration Failed"}
              </h2>

              <p>{message}</p>

              <button
                onClick={() => {
                  setMessage("");

                  if (messageType === "success") {
                    navigate("/recruiter/login");
                  }
                }}
              >
                {messageType === "success" ? "Go to Login" : "Try Again"}
              </button>
            </div>
          </div>
        )}

        <div className="recruiter-links">
          <p>
            Already have a recruiter account?{" "}
            <span onClick={() => navigate("/recruiter/login")}>Login</span>
          </p>

          <p>
            Are you a student / Placement Officer (PO) ?{" "}
            <span onClick={() => navigate("/login")}>Student / PO Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterRegister;
