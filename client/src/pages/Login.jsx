import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginStudent, getStudentProfile } from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginStudent(email, password);
      const token = response.data.token;

      if (!token) {
        setError("Login failed. Please try again.");
        return;
      }

      sessionStorage.setItem("token", token);

      const profileResponse = await getStudentProfile(token);
      const role = profileResponse.data.student.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Login failed:", err);

      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* LEFT SIDE */}
        <div className="login-info">
          <h1 className="login-brand">CampusHiree</h1>
          <br />
          <h2>Your Placement Journey Starts Here</h2>

          <p className="login-description">
            Discover opportunities, track your applications, and prepare for
            your dream career — all in one place.
          </p>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>

              <div>
                <h3>Discover Opportunities</h3>
                <p>Explore placement opportunities that match your profile.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>

              <div>
                <h3>Track Applications</h3>
                <p>Keep track of your applications and their status easily.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>

              <div>
                <h3>Prepare for Success</h3>
                <p>Get guidance and resources to prepare for your career.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - LOGIN */}
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your placement journey</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="forgot-password-link">
              <span onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </span>
            </p>

            <p className="signup-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>Sign Up</span>
            </p>

            {/* RECRUITER LOGIN */}
            <p className="recruiter-link">
              Are you a recruiter?{" "}
              <span onClick={() => navigate("/recruiter/login")}>
                Recruiter Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
