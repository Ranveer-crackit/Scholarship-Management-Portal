import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import { loginUser } from '../services/api'; // Import the specific API function
import './FormStyles.css'; // Create this for styling forms

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default or let user choose
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/'; // Path to redirect to after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use the imported function
      const response = await loginUser({ email, password, role });
      if (response.data.token && response.data.role) {
         login(response.data.token, response.data.role);
         // Redirect based on role after successful login
         const dashboardPath = getDashboardPath(response.data.role);
         navigate(dashboardPath, { replace: true }); // Navigate to role-specific dashboard
      } else {
         setError('Login failed. Invalid response from server.');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check credentials and role.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function (can be moved to a utility file)
    const getDashboardPath = (role) => {
        switch (role) {
        case 'student': return '/student/dashboard';
        case 'institution': return '/institution/dashboard';
        case 'government': return '/government/dashboard';
        default: return '/';
        }
    };


  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
         <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="student">Student</option>
                <option value="institution">Institution</option>
                <option value="government">Government</option>
            </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;