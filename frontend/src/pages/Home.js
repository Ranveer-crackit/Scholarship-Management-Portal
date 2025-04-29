import React from 'react';
import { useAuth } from '../authContext';

function Home() {
  const { isAuthenticated, userRole } = useAuth();
  return (
    <div>
      <h1>Welcome to the Scholarship Portal</h1>
      <p>Your one-stop solution for managing scholarship applications.</p>
      {isAuthenticated && <p>You are logged in as: {userRole}</p>}
    </div>
  );
}

export default Home;