// services/ai/diagnostic.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3007;

// Mock AI Model Inference
const runInference = (symptoms) => {
    // Determine potential diagnosis based on symptoms
    if (symptoms.includes('headache') && symptoms.includes('fever')) {
        return {
            prediction: 'Migraine or Flu',
            confidence: 0.85,
            requiresHumanValidation: true
        };
    }
    return { prediction: 'Unknown', confidence: 0.1, requiresHumanValidation: true };
};

app.post('/ai/diagnose', (req, res) => {
    const { patientId, symptoms } = req.body;

    // 1. Run AI Inference (GPU Accelerated in prod)
    const result = runInference(symptoms);

    // 2. EU AI Act Compliance
    // "Human in the Loop" - Result is NOT final diagnosis, just a suggestion
    const complianceWrapper = {
        ...result,
        disclaimer: "AI-generated suggestion. MUST be verified by a licensed doctor.",
        auditLogId: "audit-ai-" + Date.now()
    };

    res.json(complianceWrapper);
});

app.listen(PORT, () => {
    console.log(`AI Diagnostic Service running on port ${PORT}`);
});
