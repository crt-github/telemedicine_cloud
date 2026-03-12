// services/module-registry/index.js
// MANAGES PRACTITIONER SUBSCRIPTIONS TO SPECIALIST MODULES

const express = require('express');
const app = express();
app.use(express.json());

const PORT = 9001;

// Mock License Database
const LICENSES = {
    'dr-schneider': ['core', 'module-cardio'], // Cardiologist
    'dr-meier': ['core', 'module-derma'],      // Dermatologist
    'dr-huber': ['core']                       // GP
};

app.get('/entitlements/:doctorId', (req, res) => {
    const doctorId = req.params.doctorId;
    const entitlements = Object.prototype.hasOwnProperty.call(LICENSES, doctorId) 
        ? LICENSES[doctorId] 
        : ['core'];
    res.json({ modules: entitlements });
});

app.post('/verify-access', (req, res) => {
    const { doctorId, requiredModule } = req.body;
    const entitlements = Object.prototype.hasOwnProperty.call(LICENSES, doctorId)
        ? LICENSES[doctorId]
        : [];

    if (entitlements.includes(requiredModule)) {
        res.json({ access: true });
    } else {
        res.status(403).json({ access: false, error: 'Subscription Required for this Module' });
    }
});

app.listen(PORT, () => {
    console.log(`Module Registry running on port ${PORT}`);
});
