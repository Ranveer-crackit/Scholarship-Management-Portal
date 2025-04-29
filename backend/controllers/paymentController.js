const db = require('../models/db');

exports.makePayment = (req, res) => {
  const applicationId = req.params.application_id;
  const { amount } = req.body;

  const sql = `
    INSERT INTO payments (application_id, amount_distributed, date_of_transfer, transaction_status)
    VALUES (?, ?, NOW(), 'Success')
  `;

  db.query(sql, [applicationId, amount], (err) => {
    if (err) return res.status(500).json({ message: 'Error processing payment' });

    // Optional: update application status to paid
    const updateApp = `UPDATE applications SET status = 'paid' WHERE id = ?`;
    db.query(updateApp, [applicationId]);

    res.json({ message: 'Payment processed successfully' });
  });
};

exports.getAllPayments = (req, res) => {
  const sql = `
    SELECT p.*, a.student_id, u.name AS student_name, s.name AS scholarship_name
    FROM payments p
    JOIN applications a ON p.application_id = a.id
    JOIN users u ON a.student_id = u.id
    JOIN scholarships s ON a.scholarship_id = s.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error retrieving payments' });
    res.json(results);
  });
};

exports.getPaymentsByStudent = (req, res) => {
  const studentId = req.user.id;

  const sql = `
    SELECT p.*, s.name AS scholarship_name
    FROM payments p
    JOIN applications a ON p.application_id = a.id
    JOIN scholarships s ON a.scholarship_id = s.id
    WHERE a.student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error retrieving student payments' });
    res.json(results);
  });
};
