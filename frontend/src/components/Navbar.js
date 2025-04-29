import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Navbar.css'; // Create this file for styling

function Navbar() {
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'student':
        return '/student/dashboard';
      case 'institution':
        return '/institution/dashboard';
      case 'government':
        return '/government/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Scholarship Portal</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to={getDashboardLink()}>Dashboard</Link></li>
             {userRole === 'student' && <li><Link to="/student/details">My Details</Link></li>}
             {userRole === 'institution' && <li><Link to="/institution/details">Institution Details</Link></li>}
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;