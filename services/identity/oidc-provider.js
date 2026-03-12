// services/identity/oidc-provider.js
// GLOBAL FEDERATED LOGIN (Auth0 / Cognito wrapper)
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const PORT = 7001;

// Global User Database (Minimial PII: Email + Salted Hash + Country)
const USERS = {
    'user@swiss.ch': { id: 'u-1', country: 'CH', passwordHash: '...' },
    'user@berlin.de': { id: 'u-2', country: 'DE', passwordHash: '...' }
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = USERS[email];

    // Mock Password Check
    if (!user) return res.status(401).json({ error: 'Invalid User' });

    // ISSUE GLOBAL TOKEN with "routing_claim"
    // This token tells the Frontend WHICH Cell to talk to
    const token = jwt.sign({
        sub: user.id,
        routing_region: user.country, // Critical for routing
        scope: 'telemed:access'
    }, 'global-secret', { expiresIn: '1h' });

    res.json({
        token,
        connectTo: `https://api.${user.country.toLowerCase()}.telemed.cloud`
    });
});

app.listen(PORT, () => {
    console.log(`Global OIDC Provider running on port ${PORT}`);
});
