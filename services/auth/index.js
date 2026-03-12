// services/auth/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'swiss-secret-key';

// Mock MFA Verification (Compliance Requirement)
const verifyMFA = (userId, token) => {
    // In production, this would verify TOTP or Biometric token
    return true;
};

app.post('/login', (req, res) => {
    const { username, password, mfaToken } = req.body;

    // 1. Validate Credentials (Mock)
    if (username === 'doctor' && password === 'securepass') {
        // 2. Enforce MFA for sensitive access
        if (!verifyMFA(username, mfaToken)) {
            return res.status(403).json({ error: 'MFA Failed' });
        }

        // 3. Issue Token with Claims
        const token = jwt.sign({
            role: 'doctor',
            location: 'CH', // Critical for compliance checks
            aud: 'telemed-internal'
        }, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token });
    }
    res.status(401).json({ error: 'Invalid Credentials' });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
