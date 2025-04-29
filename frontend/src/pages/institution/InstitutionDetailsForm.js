import React, { useState } from 'react';
import { saveInstitutionDetails } from '../../services/api'; // Make sure this function exists in api.js
import '../FormStyles.css'; // Reuse the shared form styles

function InstitutionDetailsForm() {
    const [formData, setFormData] = useState({
        institution_name: '',
        type: 'school', // Default type
        registration_number: '',
        address: '',
        district: '',
        state: '',
        pincode: '',
        contact_person_name: '',
        contact_person_designation: '',
        contact_email: '',
        contact_phone: '',
        affiliation_details: '',
        established_year: '' // Should be a 4-digit year
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

        // Basic Frontend Validation (Add more specific checks as needed)
        if (!formData.institution_name || !formData.type || !formData.address || !formData.contact_email || !formData.contact_phone) {
             setError('Please fill in all required fields (marked with *)');
             setLoading(false);
             return;
        }
         if (formData.established_year && (formData.established_year.length !== 4 || isNaN(parseInt(formData.established_year)))) {
             setError('Established year must be a 4-digit number.');
             setLoading(false);
             return;
         }
         // Add more validation for email, phone, pincode formats if desired


        try {
            // Ensure established_year is sent as a number if not empty
            const dataToSend = {
                ...formData,
                established_year: formData.established_year ? parseInt(formData.established_year, 10) : null
            };
            const response = await saveInstitutionDetails(dataToSend);
            setMessage(response.data.message);
             // Optionally clear form or redirect
             // setFormData({...initialState}); // Reset form if needed
        } catch (err) {
             console.error("Error saving institution details:", err.response?.data || err);
             setError(err.response?.data?.message || 'Failed to save institution details.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-container" style={{maxWidth: '700px'}}> {/* Wider container for more fields */}
            <h2>Institution Details</h2>
            <p>Please provide the details for your institution.</p>
             <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                {/* Split into sections or use grid for better layout if many fields */}

                <div className="form-group">
                    <label htmlFor="institution_name">Institution Name *:</label>
                    <input type="text" id="institution_name" name="institution_name" value={formData.institution_name} onChange={handleChange} required />
                </div>

                 <div className="form-group">
                    <label htmlFor="type">Institution Type *:</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="university">University</option>
                        <option value="training_center">Training Center</option>
                        <option value="other">Other</option>
                     </select>
                </div>

                 <div className="form-group">
                    <label htmlFor="registration_number">Registration Number:</label>
                    <input type="text" id="registration_number" name="registration_number" value={formData.registration_number} onChange={handleChange} />
                </div>

                 <div className="form-group">
                    <label htmlFor="address">Full Address *:</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>

                {/* Address Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                     <div className="form-group">
                        <label htmlFor="district">District:</label>
                        <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pincode">Pincode:</label>
                        <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} pattern="\d{6}" title="Enter a 6-digit pincode" />
                    </div>
                </div>


                {/* Contact Person Details */}
                 <h3 style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>Contact Person</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label htmlFor="contact_person_name">Name:</label>
                        <input type="text" id="contact_person_name" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact_person_designation">Designation:</label>
                        <input type="text" id="contact_person_designation" name="contact_person_designation" value={formData.contact_person_designation} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact_email">Email *:</label>
                        <input type="email" id="contact_email" name="contact_email" value={formData.contact_email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact_phone">Phone *:</label>
                        <input type="tel" id="contact_phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />
                    </div>
                 </div>


                {/* Other Details */}
                <h3 style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>Other Details</h3>
                 <div className="form-group">
                    <label htmlFor="affiliation_details">Affiliation Details:</label>
                    <textarea id="affiliation_details" name="affiliation_details" value={formData.affiliation_details} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="established_year">Established Year (YYYY):</label>
                    <input
                        type="number"
                        id="established_year"
                        name="established_year"
                        value={formData.established_year}
                        onChange={handleChange}
                        placeholder="e.g., 1995"
                        min="1800" // Example range
                        max={new Date().getFullYear()} // Current year
                    />
                </div>


                <button type="submit" disabled={loading} style={{marginTop: '20px'}}>
                    {loading ? 'Saving...' : 'Save Institution Details'}
                </button>
            </form>
        </div>
    );
}

export default InstitutionDetailsForm;