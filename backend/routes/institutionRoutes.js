const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getPendingApplications,
  verifyApplication,
  updateInstitutionInfoForApplication, // optional if you implement pre-verification update
  fillInstitutionDetails
} = require('../controllers/institutionController');

// Middleware: Token + Role check for institution
router.use(verifyToken, roleMiddleware(['institution']));

router.post('/institution_details',fillInstitutionDetails);

// Get all pending applications for institution
router.get('/applications/pending', getPendingApplications);

// Optional: Update student/institution details before verification
// router.put('/applications/update/:id', updateInstitutionInfoForApplication);

// Verify an application by ID
router.put('/applications/verify/:id', verifyApplication);

//a reject should also be made since it has been given in frontend

module.exports = router;
