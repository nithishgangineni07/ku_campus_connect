# Campus Connect

![Campus Connect](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)

**Campus Connect** is a full-stack, internal social networking platform designed specifically for educational institutions. It provides a dedicated, secure space for students, faculty, and administrators to interact, share updates, form groups, and organize events within their campus community.

---

## 🚀 Features

- **Role-Based Access Control:** Distinct roles and privileges for Admins, Faculty, and Students.
- **User Authentication:** Secure login and registration using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Post Feed & Interactions:** Users can create posts, share images, and interact with a dynamic campus feed.
- **Group Management:** Create and join interest-based or academic groups.
- **Event Scheduling:** Organize, manage, and discover campus events.
- **Email Notifications:** Integrated email notifications for account recovery and important updates (via Nodemailer).
- **Responsive Design:** A modern, mobile-friendly user interface built with Tailwind CSS.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React.js (Bootstrapped with Vite)
- **Styling:** Tailwind CSS, PostCSS
- **Routing:** React Router v7
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** jsonwebtoken, bcryptjs
- **File Uploads:** Multer
- **Mailing:** Nodemailer

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (v16.0.0 or higher)
- **[MongoDB](https://www.mongodb.com/)** (Local instance or MongoDB Atlas account)
- **[Git](https://git-scm.com/)**

---

## 🛠️ Installation & Setup (How to Clone)

Follow these steps to get a local copy of the project up and running.

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/nithishgangineni07/campus_connect.git
cd campus_connect
```
*(Note: If your local directory is named differently, e.g., `campus_git_clone`, navigate to that directory instead).*

### 2. Backend Setup
Navigate to the `server` directory and install the dependencies:
```bash
cd server
npm install
```

**Environment Variables:**
Create a `.env` file in the `server` root directory and configure the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_smtp_email_address
EMAIL_PASS=your_smtp_email_password
```

**Run the Server:**
```bash
npm run dev
```
The backend API should now be running on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window/tab, navigate to the `client` directory, and install the dependencies:
```bash
cd client
npm install
```

**Environment Variables:**
Create a `.env` file in the `client` root directory (if required) and add your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Run the Client:**
```bash
npm run dev
```
The frontend should now be running (usually on `http://localhost:5173`). Open this URL in your browser to view the application.

---

## 👨‍💻 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License.
