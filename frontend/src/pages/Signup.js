import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api'; // Import the specific API function
import './FormStyles.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic frontend validation (add more as needed)
    if (!name || !email || !password || !role) {
        setError('All fields are required.');
        setLoading(false);
        return;
    }
     if (!['student', 'institution'].includes(role)) {
        setError('Signup role must be student or institution.');
        setLoading(false);
        return;
    }


    try {
      // Use the imported function
      const response = await signupUser({ name, email, password, role });
      setSuccess(response.data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect after a short delay
    } catch (err) {
       console.error("Signup error:", err.response?.data || err.message);
       setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
         setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            minLength="6" // Example validation
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Register as:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="student">Student</option>
            <option value="institution">Institution</option>
            {/* Government users likely created manually/differently */}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;