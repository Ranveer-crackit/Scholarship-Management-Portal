const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');

router.post('/signup', signup); // only student & institution
router.post('/Login', signin); // all roles

module.exports = router;
