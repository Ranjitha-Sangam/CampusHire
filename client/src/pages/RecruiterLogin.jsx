import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRecruiter } from "../services/api";
import "./RecruiterLogin.css";

function RecruiterLogin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginRecruiter(formData);

      sessionStorage.setItem("recruiterToken", response.data.token);
      sessionStorage.setItem("role", "recruiter");

      setMessage("Login successful!");
      setMessageType("success");

      // navigate("/recruiter/dashboard");
    } catch (error) {
      console.log("Login failed:", error.response?.data);

      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="recruiter-login-page">
      <div className="recruiter-login-card">
        <div className="recruiter-login-header">
          <h1>CampusHire</h1>
          <p>Login to manage your company's hiring process</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="recruiter-login-form-group">
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

          <div className="recruiter-login-form-group">
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

          <div className="login-button-container">
            <button type="submit" className="recruiter-login-btn">
              Login
            </button>
          </div>
        </form>
        {/* for popup successful and error msg */}
        {message && (
          <div className="custom-popup">
            <div className={`popup-content ${messageType}`}>
              <div className="popup-icon">
                {messageType === "success" ? "✓" : "✕"}
              </div>
              <h3>{messageType === "success" ? "Success!" : "Login Failed"}</h3>
              <p>{message}</p>
              <button
                onClick={() => {
                  setMessage("");
                  if (messageType === "success") {
                    navigate("/recruiter/dashboard");
                  }
                }}
              >
                {messageType === "success" ? "Go to Dashboard" : "Login Again"}
              </button>{" "}
            </div>
          </div>
        )}
        <div className="recruiter-login-links">
          <p>
            Don't have a recruiter account?{" "}
            <span onClick={() => navigate("/recruiter/register")}>
              Register
            </span>
          </p>

          <p>
            Are you a student / Placement Officer (PO)?{" "}
            <span onClick={() => navigate("/login")}>Student / PO Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterLogin;
