import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/student/StudentDashboard';
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import StudentDetailsForm from './pages/student/StudentDetailsForm'; // Example additional page
import InstitutionDetailsForm from './pages/institution/InstitutionDetailsForm'; // Example additional page

import './App.css'; // Optional: Basic App styles

function App() {
  const { userRole } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <main className="container"> {/* Basic container styling */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Redirect logged-in users from login/signup */}
           <Route path="/login" element={userRole ? <Navigate to={getDashboardPath(userRole)} /> : <Login />} />
           <Route path="/signup" element={userRole ? <Navigate to={getDashboardPath(userRole)} /> : <Signup />} />


          {/* Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
           <Route
            path="/student/details" // Example route
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDetailsForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/institution/dashboard"
            element={
              <ProtectedRoute allowedRoles={['institution']}>
                <InstitutionDashboard />
              </ProtectedRoute>
            }
          />
           <Route
            path="/institution/details" // Example route
            element={
              <ProtectedRoute allowedRoles={['institution']}>
                <InstitutionDetailsForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/government/dashboard"
            element={
              <ProtectedRoute allowedRoles={['government']}>
                <GovernmentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback for unknown routes or redirect based on role if logged in */}
           <Route path="*" element={userRole ? <Navigate to={getDashboardPath(userRole)} /> : <Navigate to="/login" />} />

        </Routes>
      </main>
    </div>
  );
}

// Helper function to determine dashboard path based on role
const getDashboardPath = (role) => {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'institution':
      return '/institution/dashboard';
    case 'government':
      return '/government/dashboard';
    default:
      return '/login'; // Fallback
  }
};


export default App;