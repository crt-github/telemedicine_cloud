const express = require('express');
const dotenv = require('dotenv');
const setupSecurity = require('./middleware/security');
const authRoutes = require('./routes/auth');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Apply Security Middleware
setupSecurity(app);

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Security headers and rate limiting enabled.`);
});
