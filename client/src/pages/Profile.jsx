import { useEffect, useState } from "react";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
} from "../services/api";
import "./Profile.css";

function Profile() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    phone: "",
    cgpa: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  const [resume, setResume] = useState(null);
  const [uploadedResume, setUploadedResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadedResumeName, setUploadedResumeName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await getStudentProfile(token);
        const student = response.data.student;
        setFormData({
          name: student.name || "",
          usn: student.usn || "",
          phone: student.phone || "",
          cgpa: student.cgpa || "",
          skills: student.skills?.join(", ") || "",
          github: student.github || "",
          linkedin: student.linkedin || "",
        });

        setUploadedResume(student.resume || "");
        setUploadedResumeName(student.resumeName || "");
      } catch (error) {
        console.log("Failed to fetch profile:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      const { usn, ...profileData } = formData;

      const dataToUpdate = {
        ...profileData,
        cgpa: Number(formData.cgpa),

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await updateStudentProfile(dataToUpdate, token);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.log("Failed to update profile:", error.response?.data);
      setMessage(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      setMessage("Please select a resume first");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const resumeData = new FormData();

      resumeData.append("resume", resume);

      const response = await uploadResume(resumeData, token);

      // Save uploaded resume URL
      setUploadedResume(response.data.resume);
      // Save original filename from backend
      setUploadedResumeName(response.data.resumeName);

      setResume(null);

      setMessage("Resume uploaded successfully!");
    } catch (error) {
      console.log("Failed to upload resume:", error.response?.data);

      setMessage(error.response?.data?.message || "Failed to upload resume");
    }
  };

  if (loading) {
    return <h2 className="profile-loading">Loading profile...</h2>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal and placement information.</p>
      </div>

      <div className="profile-card">
        <h2>Personal Information</h2>

        <form onSubmit={handleProfileSubmit}>
          <div className="profile-form-grid">
            <div className="form-group">
              <label>Name</label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>USN</label>
              <input value={formData.usn} readOnly />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>CGPA</label>

              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Skills</label>

              <input
                name="skills"
                placeholder="Java, React, SQL"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>GitHub Profile</label>

              <input
                name="github"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>LinkedIn Profile</label>

              <input
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>
          </div>

          {message && (
            <div className="success-popup">
              <div className="success-popup-content">
                <div className="success-icon">✓</div>

                <h3>Success!</h3>

                <p>{message}</p>

                <button onClick={() => setMessage("")}>OK</button>
              </div>
            </div>
          )}

          <button type="submit" className="save-profile-button">
            Save Changes
          </button>
        </form>
      </div>

      <div className="resume-card">
        <h2>Resume</h2>

        <p className="resume-description">
          Upload your latest resume in PDF format.
        </p>

        {uploadedResume && (
          <div className="resume-status">
            <span>✓ Resume uploaded successfully</span>

            <p className="uploaded-file-name">{uploadedResumeName}</p>
          </div>
        )}
        <br />

        <div className="resume-upload-section">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <button
            type="button"
            onClick={handleResumeUpload}
            className="upload-resume-button"
          >
            Upload Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
