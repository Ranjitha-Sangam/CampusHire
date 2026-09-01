import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getStudentProfile } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) return;

        const response = await getStudentProfile(token);

        setRole(response.data.student.role);
      } catch (error) {
        console.log("Failed to get user role:", error);
      }
    };

    fetchRole();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    navigate("/login");
  };

  const handleNavigation = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-header">
        <h2>CampusHiree</h2>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <h2>CampusHiree</h2>
          <p>{role === "admin" ? "Admin Portal" : "Student Portal"}</p>
        </div>

        <nav className="sidebar-links">
          {role === "student" && (
            <>
              <NavLink to="/dashboard" onClick={handleNavigation}>
                Dashboard
              </NavLink>

              <NavLink to="/profile" onClick={handleNavigation}>
                My Profile
              </NavLink>

              <NavLink to="/companies" onClick={handleNavigation}>
                Companies
              </NavLink>

              <NavLink to="/my-applications" onClick={handleNavigation}>
                My Applications
              </NavLink>

              <NavLink to="/ai-mentor" onClick={handleNavigation}>
                AI Mentor
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/admin/dashboard" onClick={handleNavigation}>
                Dashboard
              </NavLink>

              <NavLink to="/admin/applications" onClick={handleNavigation}>
                Applications
              </NavLink>

              <NavLink to="/admin/companies" onClick={handleNavigation}>
                Companies
              </NavLink>
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Dark overlay on mobile */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
