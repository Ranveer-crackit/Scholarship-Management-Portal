const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const governmentRoutes = require('./routes/governmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // for file access

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
