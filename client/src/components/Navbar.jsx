import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getStudentProfile } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

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

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CampusHiree</h2>
        <p>{role === "admin" ? "Admin Portal" : "Student Portal"}</p>
      </div>

      <nav className="sidebar-links">
        {role === "student" && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>

            <NavLink to="/profile">My Profile</NavLink>

            <NavLink to="/companies">Companies</NavLink>

            <NavLink to="/my-applications">My Applications</NavLink>

            <NavLink to="/ai-mentor">AI Mentor</NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>

            <NavLink to="/admin/applications">Applications</NavLink>

            <NavLink to="/admin/companies">Companies</NavLink>
          </>
        )}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Navbar;
