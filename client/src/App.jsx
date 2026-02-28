import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx';
import Explore from './pages/Explore.jsx';
import Groups from './pages/Groups.jsx';
import GroupDetails from './pages/GroupDetails.jsx'; // Import GroupDetails
import AdminLogin from './pages/AdminLogin.jsx';
import FacultyLogin from './pages/FacultyLogin.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Events from './pages/Events.jsx';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';


function App() {
  return (

    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faculty-login" element={<FacultyLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:groupId" element={<GroupDetails />} />
              <Route path="/events" element={<Events />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider >
  );
}

export default App;
