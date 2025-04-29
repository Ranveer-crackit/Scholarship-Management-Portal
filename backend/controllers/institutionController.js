const db = require('../models/db');

// GET: All pending applications for the logged-in institution
exports.getPendingApplications = (req, res) => {
  const institution_id = req.user.id;

  const sql = `
    SELECT a.*, u.name AS student_name, s.name AS scholarship_name
    FROM applications a
    JOIN users u ON a.student_id = u.id
    JOIN scholarships s ON a.scholarship_id = s.id
    WHERE a.institution_id = ? AND a.status = 'pending'
  `;

  db.query(sql, [institution_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching applications" });
    }
    res.json(results);
  });
};

// PUT: Verify application by ID (institution side)
exports.verifyApplication = (req, res) => {
  const applicationId = req.params.id;

  const sql = `UPDATE applications SET status = 'institution_verified' WHERE id = ?`;

  db.query(sql, [applicationId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error verifying application" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application verified by institution" });
  });
};
exports.fillInstitutionDetails = (req, res) => {
  const user_id = req.user.id; // Logged-in institution user

  const {
    institution_name,
    type,
    registration_number,
    address,
    district,
    state,
    pincode,
    contact_person_name,
    contact_person_designation,
    contact_email,
    contact_phone,
    affiliation_details,
    established_year
  } = req.body;

  const sql = `
    INSERT INTO institutions (
      user_id,
      institution_name,
      type,
      registration_number,
      address,
      district,
      state,
      pincode,
      contact_person_name,
      contact_person_designation,
      contact_email,
      contact_phone,
      affiliation_details,
      established_year
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_id,
    institution_name,
    type,
    registration_number,
    address,
    district,
    state,
    pincode,
    contact_person_name,
    contact_person_designation,
    contact_email,
    contact_phone,
    affiliation_details,
    established_year
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving institution details" });
    }

    res.status(200).json({ message: "Institution details saved successfully" });
  });
};
