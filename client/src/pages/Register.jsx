import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    email: "",
    branch: "",
    cgpa: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Remove error message when user starts typing again
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.usn.trim()) {
      setError("Please enter your USN.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.branch) {
      setError("Please select your branch.");
      return;
    }

    if (!formData.cgpa) {
      setError("Please enter your CGPA.");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number.",
      );
      return;
    }

    try {
      setLoading(true);

      await registerStudent(
        formData.name,
        formData.usn,
        formData.email,
        formData.branch,
        Number(formData.cgpa),
        formData.password,
      );
      setSuccessMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>CampusHire</h1>
          <p>Create your student account and start your placement journey</p>
        </div>

        {/* noValidate removes default browser popup */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>

              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>USN</label>

              <input
                name="usn"
                placeholder="Enter your USN"
                value={formData.usn}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Branch</label>

              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="Aiml">AI/ML</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Robotics">Robotics</option>
                <option value="ISE">ISE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CV">CV</option>
                <option value="MCA">MCA</option>
                <option value="Biotech">Biotech</option>
                <option value="MBA">MBA</option>
                <option value="MTECH">MTECH</option>
              </select>
            </div>

            <div className="form-group">
              <label>CGPA</label>

              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="Enter CGPA"
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Custom error message */}
          {error && <p className="error-message">{error}</p>}

          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
