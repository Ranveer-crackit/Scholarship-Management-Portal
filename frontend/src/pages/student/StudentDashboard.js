import React, { useState, useEffect } from 'react';
import { fetchStudentScholarships, fetchStudentApplications, applyForScholarship } from '../../services/api'; // Import specific API functions

function StudentDashboard() {
  const [scholarships, setScholarships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [error, setError] = useState('');
  // Add state for application form if needed (e.g., selected scholarship, institution ID)
   const [selectedScholarship, setSelectedScholarship] = useState('');
   const [institutionId, setInstitutionId] = useState(''); // Student needs to provide this


  useEffect(() => {
    // Fetch available scholarships
    fetchStudentScholarships()
      .then(response => {
        setScholarships(response.data);
      })
      .catch(err => {
        console.error("Error fetching scholarships:", err);
        setError('Failed to load scholarships.');
      })
      .finally(() => setLoadingScholarships(false));

    // Fetch student's own applications
    fetchStudentApplications()
      .then(response => {
        setMyApplications(response.data);
      })
      .catch(err => {
        console.error("Error fetching applications:", err);
        setError('Failed to load your applications.');
      })
      .finally(() => setLoadingApplications(false));
  }, []); // Empty dependency array means this runs once on mount

   const handleApply = async (scholarshipId) => {
        if (!institutionId) {
            alert('Please enter the Institution ID you are applying through.');
            return;
        }
        try {
            const applicationData = {
                scholarship_id: scholarshipId,
                institution_id: parseInt(institutionId, 10) // Ensure it's a number
            };
            const response = await applyForScholarship(applicationData);
            alert(response.data.message);
            // Refresh applications list after applying
             fetchStudentApplications()
                .then(res => setMyApplications(res.data))
                .catch(err => console.error("Error refreshing applications:", err));
        } catch (err) {
            console.error("Error applying:", err.response?.data || err);
            alert(err.response?.data?.message || 'Application failed.');
        }
    };


  return (
    <div>
      <h2>Student Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h3>Available Scholarships</h3>
        {loadingScholarships ? <p>Loading scholarships...</p> : (
          <ul>
            {scholarships.length > 0 ? scholarships.map(sch => (
              <li key={sch.id}>
                <strong>{sch.name}</strong> - Amount: {sch.amount} (Deadline: {new Date(sch.application_deadline).toLocaleDateString()})
                <br />
                 Eligibility: {sch.eligibility_criteria}
                 {/* Simple Apply Button - requires Institution ID input */}
                 <div>
                     <label>Institution ID for this Application: </label>
                     <input
                         type="number"
                         placeholder="Enter Institution User ID"
                         onChange={(e) => setInstitutionId(e.target.value)} // Ideally manage this better
                         required
                     />
                     <button onClick={() => handleApply(sch.id)} style={{marginLeft: '10px'}}>Apply</button>
                 </div>
              </li>
            )) : <p>No scholarships currently available.</p>}
          </ul>
        )}
      </section>

      <hr />

      <section>
        <h3>My Applications</h3>
        {loadingApplications ? <p>Loading your applications...</p> : (
          <ul>
            {myApplications.length > 0 ? myApplications.map(app => (
              <li key={app.id}>
                Scholarship: {app.scholarship_name} - Status: <strong>{app.status}</strong> (Submitted: {new Date(app.submission_date).toLocaleString()})
              </li>
            )) : <p>You haven't applied for any scholarships yet.</p>}
          </ul>
        )}
      </section>

       {/* Add Link/Button to fill student details */}
       {/* <Link to="/student/details">Complete Your Profile</Link> */}
    </div>
  );
}

export default StudentDashboard;