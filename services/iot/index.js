// services/iot/index.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3006;

// IoT Data Ingestion Endpoint
app.post('/iot/ingest', (req, res) => {
    const { _deviceId, _patientId, dataType, value } = req.body;

    // 1. Validate Device Signature (Security)
    if (!req.headers['x-device-signature']) {
        return res.status(401).json({ error: 'Untrusted Device' });
    }

    // 2. Normalize Data (e.g. from Audio to Text/Value)
    const normalizedValue = value; // Placeholder for audio processing

    // 3. Store in Encrypted DB (via Patient Service)
    console.log(`Received IoT Data: ${dataType} = ${normalizedValue}`);

    res.status(201).json({ status: 'Data Securely Ingested' });
});

app.listen(PORT, () => {
    console.log(`IoT Ingestion Service running on port ${PORT}`);
});
