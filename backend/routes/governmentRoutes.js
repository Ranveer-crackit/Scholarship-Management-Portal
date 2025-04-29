const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getInstitutionVerifiedApps,
  approveApplication,
  createScholarship,
  getApprovedApplications
} = require('../controllers/governmentController');

router.use(verifyToken, roleMiddleware(['government']));

router.get('/verified-applications', getInstitutionVerifiedApps);
router.post('/approve/:id', approveApplication);
router.post('/applications', createScholarship);

// Example Backend Route Snippet (in governmentRoutes.js)
// Add this line within the government routes
router.get('/approved-for-payment', getApprovedApplications);

module.exports = router;
