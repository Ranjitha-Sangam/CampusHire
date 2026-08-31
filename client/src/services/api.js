import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Do NOT redirect when login itself fails
    if (status === 401) {
      const isStudentLogin = requestUrl.includes("/students/login");
      const isRecruiterLogin = requestUrl.includes("/recruiters/login");

      // Only redirect if it is NOT a login request
      if (!isStudentLogin && !isRecruiterLogin) {
        // Recruiter protected APIs
        if (
          requestUrl.includes("/recruiter") ||
          requestUrl.includes("/recruiters")
        ) {
          sessionStorage.removeItem("recruiterToken");
          sessionStorage.removeItem("role");

          window.location.href = "/recruiter/login";
        } else {
          // Student protected APIs
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");

          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export const loginStudent = (email, password) => {
  return API.post("/students/login", {
    email,
    password,
  });
};

export const getStudentProfile = (token) => {
  return API.get("/students/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlacementMentor = (companyId, token) => {
  return API.post(
    `/ai/placement-mentor/${companyId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const applyForJob = (companyId, token) => {
  return API.post(
    `/applications/apply/${companyId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//all application of current logged in student
export const getMyApplications = (token) => {
  return API.get("/applications/my-applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//for admin-admin can see all application
export const getAllApplications = (token) => {
  return API.get("/applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCompany = (companyData, token) => {
  return API.post("/companies", companyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAdminDashboard = (token) => {
  return API.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllCompanies = () => {
  return API.get("/companies");
};

export const updateApplicationStatus = (applicationId, status, token) => {
  return API.put(
    `/applications/${applicationId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const updateCompany = (companyId, companyData, token) => {
  return API.put(`/companies/${companyId}`, companyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCompany = (companyId, token) => {
  return API.delete(`/companies/${companyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerStudent = (name, usn, email, branch, cgpa, password) => {
  return API.post("/students/register", {
    name,
    usn,
    email,
    branch,
    cgpa,
    password,
  });
};

export const updateStudentProfile = (data, token) => {
  return API.put("/students/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadResume = (formData, token) => {
  return API.put("/students/upload-resume", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const registerRecruiter = (formData) => {
  return API.post("/recruiters/register", formData);
};

export const loginRecruiter = (data) => {
  return API.post("/recruiters/login", data);
};

export const getRecruiterApplications = (token) => {
  return API.get("/applications/recruiter", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendOALink = (data, token) => {
  return API.post("/applications/recruiter/send-oa", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateRecruiterApplicationStatus = (
  applicationId,
  status,
  token,
) => {
  return API.put(
    `/applications/recruiter/${applicationId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getRecommendedCompanies = (token) => {
  return API.get("/companies/recommended", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMessageToAIMentor = (message, token) => {
  return API.post(
    "/ai/mentor",
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const forgotPassword = (email) => {
  return API.post("/students/forgot-password", { email });
};

export const resetPassword = (token, password) => {
  return API.post(`/students/reset-password/${token}`, { password });
};

// Get all pending recruiters
export const getPendingRecruiters = (token) => {
  return API.get("/recruiters/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Approve or reject recruiter
export const updateRecruiterStatus = (recruiterId, status, token) => {
  return API.put(
    `/recruiters/${recruiterId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default API;
