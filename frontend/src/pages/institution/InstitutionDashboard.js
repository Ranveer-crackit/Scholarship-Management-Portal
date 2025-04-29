import React, { useState, useEffect } from 'react';
import { fetchPendingApplications, verifyInstApplication } from '../../services/api';

function InstitutionDashboard() {
    const [pendingApps, setPendingApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMessage, setActionMessage] = useState('');

    const loadPendingApplications = () => {
        setLoading(true);
        setActionMessage('');
        fetchPendingApplications()
            .then(response => {
                setPendingApps(response.data);
            })
            .catch(err => {
                console.error("Error fetching pending applications:", err);
                setError('Failed to load pending applications.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadPendingApplications();
    }, []); // Load on mount

    const handleVerify = async (appId) => {
        setActionMessage(`Verifying application ${appId}...`);
        try {
            const response = await verifyInstApplication(appId);
            setActionMessage(response.data.message);
            // Refresh the list after action
            loadPendingApplications();
        } catch (err) {
            console.error("Error verifying application:", err.response?.data || err);
            setActionMessage(err.response?.data?.message || 'Verification failed.');
            setError('Verification failed.'); // Keep previous error or set new one
        }
    };

    // Add handleReject function similarly if you implement reject endpoint

    return (
        <div>
            <h2>Institution Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {actionMessage && <p style={{ color: 'blue' }}>{actionMessage}</p>}

            <section>
                <h3>Pending Student Applications for Verification</h3>
                {loading ? <p>Loading applications...</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>App ID</th>
                                <th>Student Name</th>
                                <th>Scholarship</th>
                                <th>Submitted Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingApps.length > 0 ? pendingApps.map(app => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td>{app.student_name}</td>
                                    <td>{app.scholarship_name}</td>
                                    <td>{new Date(app.submission_date).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleVerify(app.id)}>Verify</button>
                                        {/* Add Reject button if implemented */}
                                        {/* <button onClick={() => handleReject(app.id)}>Reject</button> */}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">No pending applications found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </section>
             {/* Add Link/Button to fill institution details */}
             {/* <Link to="/institution/details">Complete Institution Profile</Link> */}
        </div>
    );
}

export default InstitutionDashboard;