import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getStudentProfile } from "../services/api";

function StudentProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const checkStudent = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getStudentProfile(token);

        if (response.data.student.role === "student") {
          setIsStudent(true);
        }
      } catch (error) {
        console.log("Failed to verify student:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStudent();
  }, []);

  if (loading) {
    return <h2>Checking access...</h2>;
  }

  if (!isStudent) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default StudentProtectedRoute;