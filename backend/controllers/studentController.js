const db = require('../models/db');

exports.applyScholarship = (req, res) => {
  const { scholarship_id, institution_id } = req.body;
  const student_id = req.user.id;

  const sql = `
    INSERT INTO applications (student_id, scholarship_id, institution_id, status, submission_date)
    VALUES (?, ?, ?, 'pending', NOW())
  `;

  db.query(sql, [student_id, scholarship_id, institution_id], (err) => {
    console.error("Database error:", err);
    if (err) return res.status(500).json({ message: "Error applying" });
    res.json({ message: "Application submitted" });
  });
};

exports.getMyApplications = (req, res) => {
  const student_id = req.user.id;

  const sql = `
    SELECT a.*, s.name AS scholarship_name
    FROM applications a
    JOIN scholarships s ON a.scholarship_id = s.id
    WHERE a.student_id = ?
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });
    res.json(results);
  });
};
exports.fillStudentDetails = (req, res) => {
  const user_id = req.user.id; // Authenticated student user
  const {
    date_of_birth,
    gender,
    address,
    phone,
    guardian_name,
    guardian_contact,
    course_name,
    year_of_study,
    institution_id
  } = req.body;

  const sql = `
    INSERT INTO students (
      user_id, date_of_birth, gender, address, phone,
      guardian_name, guardian_contact, course_name,
      year_of_study, institution_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      date_of_birth,
      gender,
      address,
      phone,
      guardian_name,
      guardian_contact,
      course_name,
      year_of_study,
      institution_id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving student details" });
      }
      res.status(200).json({ message: "Student details saved successfully" });
    }
  );
};
exports.getAllScholarships = (req, res) => {
  const sql = `
    SELECT * FROM scholarships
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching scholarships" });
    }
    res.status(200).json(results);
  });
};

