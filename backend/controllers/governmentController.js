const db = require('../models/db');


exports.getInstitutionVerifiedApps = (req, res) => {
  const sql = `
    SELECT a.*, u.name AS student_name, s.name AS scholarship_name
    FROM applications a
    JOIN users u ON a.student_id = u.id
    JOIN scholarships s ON a.scholarship_id = s.id
    WHERE a.status = 'institution_verified'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });
    res.json(results);
  });
};

exports.approveApplication = (req, res) => {
  const appId = req.params.id;

  const sql = `UPDATE applications SET status = 'approved' WHERE id = ?`;

  db.query(sql, [appId], (err) => {
    if (err) return res.status(500).json({ message: "Error approving application" });
    res.json({ message: "Application approved by government" });
  });
};
exports.createScholarship = async (req, res) => {
  try {
    const { name, eligibility_criteria, amount, application_deadline } = req.body;

    if (!name || !eligibility_criteria || !amount || !application_deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = `
      INSERT INTO scholarships (name, eligibility_criteria, amount, application_deadline, status) 
      VALUES (?, ?, ?, ?, 'open')
    `;
    const params = [name, eligibility_criteria, amount, application_deadline];

    const result = await db.query(sql, params);

    res.status(201).json({
      message: 'Scholarship created successfully',
      scholarship: {
        id: result.insertId,
        name,
        eligibility_criteria,
        amount,
        application_deadline,
        status: 'open'
      }
    });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Example Backend Controller Snippet (in governmentController.js)
exports.getApprovedApplications = (req, res) => {
  // REMOVED the "//" comments from inside the SQL string
  const sql = `
    SELECT
      a.id, a.status, a.submission_date,
      u.name AS student_name,
      s.name AS scholarship_name,
      s.amount AS scholarship_amount
    FROM applications a
    JOIN users u ON a.student_id = u.id
    JOIN scholarships s ON a.scholarship_id = s.id
    WHERE a.status = 'approved'
  `;

  db.query(sql, (err, results) => {
    if (err) {
        // Keep the console log for future debugging if needed
        console.error("Error fetching approved applications:", err);
         return res.status(500).json({ message: "Error fetching approved applications" });
    }
    res.json(results);
  });
};