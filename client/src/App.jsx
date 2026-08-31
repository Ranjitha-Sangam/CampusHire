import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecruiterRegister from "./pages/RecruiterRegister";
import StudentDashboard from "./pages/StudentDashboard";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import MyApplications from "./pages/MyApplications";
import AdminApplications from "./pages/AdminApplications";
import AdminCompanies from "./pages/AdminCompanies";
import AddCompany from "./pages/AddCompany";
import EditCompany from "./pages/EditCompany";
import Profile from "./pages/Profile";
import PlacementMentor from "./pages/PlacementMentor";
import Layout from "./components/Layout";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterProtectedRoute from "./components/RecruiterProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute";
import AIMentor from "./pages/AIMentor";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>
      {/* Public pages - NO SIDEBAR */}
      <Route path="/" element={<h1>CampusHire Home</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recruiter/register" element={<RecruiterRegister />} />
      <Route path="/recruiter/login" element={<RecruiterLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/recruiter/dashboard"
        element={
          <RecruiterProtectedRoute>
            <RecruiterDashboard />
          </RecruiterProtectedRoute>
        }
      />

      {/* Protected pages - WITH SIDEBAR */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {" "}
        {/* Student */}
        {/* Student */}
        <Route
          path="/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <StudentProtectedRoute>
              <Profile />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <StudentProtectedRoute>
              <Companies />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/companies/:id"
          element={
            <StudentProtectedRoute>
              <CompanyDetails />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <StudentProtectedRoute>
              <MyApplications />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <StudentProtectedRoute>
              <PlacementMentor />
            </StudentProtectedRoute>
          }
        />
        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <StudentDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <AdminProtectedRoute>
              <AdminApplications />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <AdminProtectedRoute>
              <AdminCompanies />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/add"
          element={
            <AdminProtectedRoute>
              <AddCompany />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/edit/:id"
          element={
            <AdminProtectedRoute>
              <EditCompany />
            </AdminProtectedRoute>
          }
        />
      </Route>
      <Route path="/ai-mentor" element={<AIMentor />} />
    </Routes>
  );
}

export default App;
