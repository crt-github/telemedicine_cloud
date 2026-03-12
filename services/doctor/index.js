// services/doctor/index.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3003;

// Mock database for doctors
const doctors = [
    { id: 'doc-1', name: 'Dr. Smith', specialization: 'Cardiology', languages: ['English', 'German'] }
];

app.get('/doctors', (req, res) => {
    // Public endpoint - no sensitive data
    res.json(doctors);
});

app.get('/doctors/:id', (req, res) => {
    const doc = doctors.find(d => d.id === req.params.id);
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doc);
});

// Update availability - Requires Auth
app.post('/doctors/:id/availability', (req, res) => {
    // TODO: Verify JWT token here
    res.json({ status: 'Availability updated' });
});

app.listen(PORT, () => {
    console.log(`Doctor Service running on port ${PORT}`);
});
