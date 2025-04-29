const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  applyScholarship,
  getMyApplications,
  fillStudentDetails,
  getAllScholarships
} = require('../controllers/studentController');

router.use(verifyToken, roleMiddleware(['student']));

router.post('/apply', applyScholarship);
router.get('/applications', getMyApplications);
router.post('/fill_details',fillStudentDetails);
router.get('/scholarships', getAllScholarships);


module.exports = router;
