import React, { useState } from 'react';
import { saveStudentDetails } from '../../services/api';
import '../FormStyles.css'; // Reuse form styles

function StudentDetailsForm() {
    const [formData, setFormData] = useState({
        date_of_birth: '',
        gender: 'male',
        address: '',
        phone: '',
        guardian_name: '',
        guardian_contact: '',
        course_name: '',
        year_of_study: '',
        institution_id: '' // Student needs to know the user ID of their institution
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        // Basic validation
        if (!formData.date_of_birth || !formData.address || !formData.phone || !formData.institution_id) {
             setError('Please fill in all required fields.');
             setLoading(false);
             return;
        }


        try {
            const response = await saveStudentDetails(formData);
            setMessage(response.data.message);
             // Optionally clear form or redirect
        } catch (err) {
             console.error("Error saving details:", err.response?.data || err);
             setError(err.response?.data?.message || 'Failed to save details.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-container">
            <h2>My Details</h2>
            <p>Please complete your profile information.</p>
             <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                {/* Add form fields for each item in your students table */}
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label>Gender:</label>
                     <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                     </select>
                </div>
                <div className="form-group">
                    <label>Address:</label>
                     <textarea name="address" value={formData.address} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label>Phone:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label>Guardian Name:</label>
                    <input type="text" name="guardian_name" value={formData.guardian_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Guardian Contact:</label>
                    <input type="tel" name="guardian_contact" value={formData.guardian_contact} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label>Course Name:</label>
                    <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label>Year of Study:</label>
                    <input type="number" name="year_of_study" value={formData.year_of_study} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Institution User ID:</label>
                    <input type="number" name="institution_id" placeholder="Ask your institution admin" value={formData.institution_id} onChange={handleChange} required />
                     <small>This is the User ID (from the 'users' table) of your registered institution.</small>
                </div>


                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Details'}
                </button>
            </form>
        </div>
    );
}

export default StudentDetailsForm;