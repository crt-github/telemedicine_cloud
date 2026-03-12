// services/patient/index.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

// Middleware to check Swiss Compliance
const requireSwissLocation = (req, res, next) => {
    // Mock JWT extraction
    const userLocation = req.headers['x-user-location'];
    if (userLocation !== 'CH') {
        return res.status(403).json({ error: 'Access Denied: Non-Swiss Location' });
    }
    next();
};

app.get('/patients/:id/records', requireSwissLocation, (req, res) => {
    // In production, query encrypted DB and decrypt on-the-fly
    res.json({
        patientId: req.params.id,
        records: [
            { id: 'rec-1', type: 'diagnosis', content: '[ENCRYPTED_BLOB]' }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Patient Service running on port ${PORT}`);
});
