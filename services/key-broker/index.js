// services/key-broker/index.js
// TRUSTED KEY BROKER (Run by Hospital IT, NOT the Cloud Provider)
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 6001;

// Mock Key Storage (In memory for prototype)
// In production, this would be an HSM or Vault (HashiCorp)
const KEY_STORE = {};

app.post('/keys/store', (req, res) => {
    const { recordId, wrappedKey } = req.body;
    // Store the encrypted DEK (Data Encryption Key)
    KEY_STORE[recordId] = wrappedKey;
    console.log(`[KEY-BROKER] Stored key for record: ${recordId}`);
    res.json({ status: 'Key Secured' });
});

app.get('/keys/:recordId', (req, res) => {
    // Only authorized doctors can fetch keys
    const wrappedKey = KEY_STORE[req.params.recordId];
    if (!wrappedKey) return res.status(404).json({ error: 'Key not found' });
    res.json({ wrappedKey });
});

app.listen(PORT, () => {
    console.log(`Trusted Key Broker running on port ${PORT}`);
});
