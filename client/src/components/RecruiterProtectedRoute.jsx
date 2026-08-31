import { Navigate } from "react-router-dom";

function RecruiterProtectedRoute({ children }) {
  const recruiterToken = sessionStorage.getItem("recruiterToken");

  if (!recruiterToken) {
    return <Navigate to="/recruiter/login" replace />;
  }

  return children;
}

export default RecruiterProtectedRoute;