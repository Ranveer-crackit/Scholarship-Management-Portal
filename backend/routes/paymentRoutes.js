const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  makePayment,
  getAllPayments,
  getPaymentsByStudent
} = require('../controllers/paymentController');

// Government can make payments and see all
router.post('/make/:application_id', verifyToken, roleMiddleware(['government']), makePayment);


router.get('/all', verifyToken, roleMiddleware(['government']), getAllPayments);

// Student can view their own payments
router.get('/student', verifyToken, roleMiddleware(['student']), getPaymentsByStudent);

module.exports = router;
