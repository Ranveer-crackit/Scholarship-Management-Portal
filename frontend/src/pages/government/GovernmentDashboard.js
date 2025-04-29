import React, { useState, useEffect } from 'react';
import {
    fetchGovVerifiedApps,
    approveGovApplication,
    createScholarship,
    fetchGovApprovedAppsForPayment, // <-- Import new API function
    makePaymentForApp              // <-- Import payment API function
} from '../../services/api';
import '../FormStyles.css'; // Reusing form styles if needed

function GovernmentDashboard() {
    // --- Existing State ---
    const [verifiedApps, setVerifiedApps] = useState([]);
    const [loadingVerified, setLoadingVerified] = useState(true); // Renamed for clarity
    const [actionMessageVerified, setActionMessageVerified] = useState(''); // Renamed

    const [scholarshipName, setScholarshipName] = useState('');
    const [eligibility, setEligibility] = useState('');
    const [amount, setAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // --- New State for Payments ---
    const [approvedApps, setApprovedApps] = useState([]);
    const [loadingApproved, setLoadingApproved] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState({}); // Tracks status per app: { appId: { loading, message, error } }
    const [generalError, setGeneralError] = useState(''); // General error for the component


    // --- Fetch Functions ---
    const loadVerifiedApplications = () => {
        setLoadingVerified(true);
        setActionMessageVerified('');
        fetchGovVerifiedApps()
            .then(response => setVerifiedApps(response.data))
            .catch(err => {
                console.error("Error fetching verified applications:", err);
                setGeneralError('Failed to load applications needing approval.');
            })
            .finally(() => setLoadingVerified(false));
    };

    const loadApprovedApplications = () => {
        setLoadingApproved(true);
        setPaymentStatus({}); // Clear previous payment statuses
        fetchGovApprovedAppsForPayment() // <-- Use the new function
            .then(response => {
                 // Ensure amount is correctly parsed if needed (depends on backend)
                 const appsWithAmount = response.data.map(app => ({
                     ...app,
                     // Ensure scholarship_amount is a number, default to 0 if missing/invalid
                     scholarship_amount: parseFloat(app.scholarship_amount) || 0
                 }));
                setApprovedApps(appsWithAmount);
            })
            .catch(err => {
                console.error("Error fetching approved applications for payment:", err);
                setGeneralError('Failed to load applications ready for payment.');
            })
            .finally(() => setLoadingApproved(false));
    };

    // --- Initial Data Load ---
    useEffect(() => {
        loadVerifiedApplications();
        loadApprovedApplications();
    }, []); // Load both lists on mount

    // --- Action Handlers ---
    const handleApprove = async (appId) => {
        setActionMessageVerified(`Approving application ${appId}...`);
        try {
            const response = await approveGovApplication(appId);
            setActionMessageVerified(response.data.message);
            // Refresh both lists after approval
            loadVerifiedApplications();
            loadApprovedApplications();
        } catch (err) {
            console.error("Error approving application:", err.response?.data || err);
            setActionMessageVerified(err.response?.data?.message || 'Approval failed.');
            setGeneralError('Approval failed.');
        }
    };

    const handleCreateScholarship = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        if (!scholarshipName || !eligibility || !amount || !deadline) {
            setFormError('All scholarship fields are required.');
            return;
        }
        try {
            const scholarshipData = {
                name: scholarshipName,
                eligibility_criteria: eligibility,
                amount: parseFloat(amount),
                application_deadline: deadline
            };
            const response = await createScholarship(scholarshipData);
            setFormSuccess(response.data.message);
            // Clear form
            setScholarshipName('');
            setEligibility('');
            setAmount('');
            setDeadline('');
            // Optionally refresh scholarship list if displayed elsewhere
        } catch (err) {
            console.error("Error creating scholarship:", err.response?.data || err);
            setFormError(err.response?.data?.message || 'Failed to create scholarship.');
        }
    };


    const handleMakePayment = async (appId, amountToPay) => {
        if (!amountToPay || amountToPay <= 0) {
             setPaymentStatus(prev => ({
                ...prev,
                [appId]: { loading: false, error: 'Invalid amount specified.', message: '' }
            }));
            return;
        }

        setPaymentStatus(prev => ({
            ...prev,
            [appId]: { loading: true, message: 'Processing payment...', error: '' }
        }));

        try {
            const paymentData = { amount: amountToPay };
            const response = await makePaymentForApp(appId, paymentData);
            setPaymentStatus(prev => ({
                ...prev,
                [appId]: { loading: false, message: response.data.message, error: '' }
            }));
            // Refresh the list of approved applications (the paid one should disappear or change status)
            // Or update status locally for immediate feedback before refresh
            setApprovedApps(prevApps => prevApps.filter(app => app.id !== appId)); // Simplest: remove from list
            // loadApprovedApplications(); // Alternative: Reload the whole list from backend

        } catch (err) {
            console.error("Error making payment:", err.response?.data || err);
             const errorMessage = err.response?.data?.message || 'Payment failed.';
             setPaymentStatus(prev => ({
                ...prev,
                [appId]: { loading: false, message: '', error: errorMessage }
            }));
            setGeneralError('Payment processing failed for an application.');
        }
    };


    // --- Render Logic ---
    return (
        <div>
            <h2>Government Dashboard</h2>
            {generalError && <p className="error-message">{generalError}</p>} {/* Display general errors */}

            <section>
                <h3>Create New Scholarship</h3>
                 <form onSubmit={handleCreateScholarship} className="form-container" style={{maxWidth: '500px', margin: '20px 0'}}>
                    {formError && <p className="error-message">{formError}</p>}
                    {formSuccess && <p className="success-message">{formSuccess}</p>}
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={scholarshipName} onChange={(e) => setScholarshipName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Eligibility Criteria:</label>
                        <textarea value={eligibility} onChange={(e) => setEligibility(e.target.value)} required />
                    </div>
                     <div className="form-group">
                        <label>Amount:</label>
                        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                     <div className="form-group">
                        <label>Application Deadline:</label>
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                    </div>
                    <button type="submit">Create Scholarship</button>
                </form>
            </section>

             <hr/>



            {/* --- Applications Pending Approval Section (Existing) --- */}
            <section>
                 <h3>Institution Verified Applications Pending Approval</h3>
                  {actionMessageVerified && <p style={{ color: 'blue', marginBottom: '10px' }}>{actionMessageVerified}</p>}
                 {loadingVerified ? <p>Loading applications...</p> : (
                    <table>
                         <thead>
                            <tr>
                                <th>App ID</th>
                                <th>Student Name</th>
                                <th>Scholarship</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                       <tbody>
                            {verifiedApps.length > 0 ? verifiedApps.map(app => (
                                <tr key={app.id}>
                                     <td>{app.id}</td>
                                    <td>{app.student_name}</td>
                                    <td>{app.scholarship_name}</td>
                                    <td>{app.status}</td>
                                    <td>
                                        {/* Only show Approve button if it's institution_verified */}
                                        {app.status === 'institution_verified' && (
                                            <button onClick={() => handleApprove(app.id)}>Approve</button>
                                        )}
                                        {/* Add Reject button if needed */}
                                    </td>
                                </tr>
                            )) : (
                                 <tr>
                                    <td colSpan="5">No applications currently pending government approval.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 )}
            </section>
            <hr />


            {/* --- NEW: Applications Approved for Payment Section --- */}
            <section>
                <h3>Applications Approved - Ready for Payment</h3>
                {loadingApproved ? <p>Loading applications ready for payment...</p> : (
                     <table>
                         <thead>
                            <tr>
                                <th>App ID</th>
                                <th>Student Name</th>
                                <th>Scholarship</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                         <tbody>
                             {approvedApps.length > 0 ? approvedApps.map(app => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td>{app.student_name}</td>
                                    <td>{app.scholarship_name}</td>
                                    <td>{app.scholarship_amount ? `$${app.scholarship_amount.toFixed(2)}` : 'N/A'}</td>
                                    <td>{app.status}</td>
                                    <td>
                                         {/* Payment Button and Status */}
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button
                                                onClick={() => handleMakePayment(app.id, app.scholarship_amount)}
                                                disabled={!app.scholarship_amount || app.scholarship_amount <= 0 || paymentStatus[app.id]?.loading}
                                            >
                                                {paymentStatus[app.id]?.loading ? 'Processing...' : 'Make Payment'}
                                            </button>
                                            {paymentStatus[app.id]?.message && (
                                                <span style={{ color: 'green' }}>{paymentStatus[app.id].message}</span>
                                            )}
                                            {paymentStatus[app.id]?.error && (
                                                <span style={{ color: 'red' }}>{paymentStatus[app.id].error}</span>
                                            )}
                                         </div>
                                    </td>
                                </tr>
                             )) : (
                                <tr>
                                    <td colSpan="6">No applications currently approved and awaiting payment.</td>
                                </tr>
                             )}
                         </tbody>
                     </table>
                )}
            </section>

        </div>
    );
}

export default GovernmentDashboard;