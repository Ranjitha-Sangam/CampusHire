import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getStudentProfile } from "../services/api";

function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getStudentProfile(token);

        if (response.data.student.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.log("Failed to verify admin:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <h2>Checking access...</h2>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
