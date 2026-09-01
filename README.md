# 🎓 CampusHire

CampusHire is a full-stack campus placement management platform designed to connect students, recruiters, and administrators in one centralized system.

It allows students to discover placement opportunities, apply for jobs, track applications, manage their profiles, and interact with an AI Placement Mentor.

Recruiters can register, manage placement activities, view student applications, and send Online Assessment links.

Administrators can manage companies, applications, and recruiter registrations through a dedicated admin portal.

---

## 🚀 Features

### 👨‍🎓 Student

- Student registration and login
- JWT-based authentication
- Student profile management
- Resume upload
- View available companies
- View company details
- Apply for placement opportunities
- Track applied jobs and application status
- Recommended companies based on student profile
- AI Placement Mentor
- Forgot password and reset password
- Responsive mobile-friendly interface

### 🧑‍💼 Recruiter

- Recruiter registration
- Recruiter login
- Admin approval system
- Recruiter dashboard
- View student applications
- Update application status
- Send Online Assessment (OA) links

### 👨‍💻 Admin

- Admin authentication
- Admin dashboard
- View placement applications
- Add companies
- Edit companies
- Delete companies
- View and manage recruiters
- Approve or reject recruiter registrations

---

## 🤖 AI Features

CampusHire includes an AI-powered Placement Mentor to help students with career and placement preparation.

Students can use the AI Mentor for guidance related to:

- Placement preparation
- DSA preparation
- Resume preparation
- Interview preparation
- Career guidance

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS
- Responsive Design

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Nodemailer

### AI

- Google Gemini API

### Cloud & Deployment

- MongoDB Atlas
- Cloudinary
- Render

---

## 📁 Project Structure

```text
CampusHire/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ranjitha-Sangam/CampusHire.git
cd CampusHire
```

### 2. Frontend Setup

Open a terminal and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

### 3. Backend Setup

Open another terminal and run:

```bash
cd server
npm install
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

Environment variables are required for the application to work correctly.

### Client

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### Server

Create a `.env` file inside the `server` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

ADMIN_NAME=your_admin_name
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never commit `.env` files, passwords, API keys, or other sensitive credentials to GitHub.

---

## 🌐 Live Demo

### Frontend

https://campushire-frontend-4da2.onrender.com

### Backend

https://campushire-backend-ldi1.onrender.com

---

## 🔄 Application Flow

### Student

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Browse Companies
   ↓
View Company Details
   ↓
Apply for Jobs
   ↓
Track Applications
   ↓
AI Placement Mentor
```

### Recruiter

```text
Register
   ↓
Admin Approval
   ↓
Login
   ↓
Recruiter Dashboard
   ↓
View Applications
   ↓
Send OA
   ↓
Update Application Status
```

### Admin

```text
Login
   ↓
Admin Dashboard
   ↓
Manage Companies
   ↓
Manage Applications
   ↓
Manage Recruiters
```

---

## 🔑 Authentication & Authorization

CampusHire uses JWT-based authentication and role-based authorization.

The application supports three user roles:

- Student
- Recruiter
- Admin

Protected routes ensure that users can access only the features permitted for their respective roles.

---

## 📱 Responsive Design

CampusHire is designed to work across desktop and mobile screen sizes.

The navigation sidebar automatically adapts to smaller screens with a mobile-friendly navigation menu.

---

## 🎯 Project Objective

The objective of CampusHire is to simplify the campus placement process by providing a centralized platform where students, recruiters, and administrators can efficiently manage placement activities.

---

## 👩‍💻 Author

**Ranjitha Sangam S S**

MCA Student
