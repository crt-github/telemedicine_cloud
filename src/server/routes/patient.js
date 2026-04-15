"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const { sanitizeRecordForAI } = require('../../../services/security/sanitizer');
const router = express_1.default.Router();
// Mock Patient Data (In production, this comes from a HIPAA-compliant Database)
const mockPatients = {
    "1": {
        patientId: "P-10045",
        name: "Corinne Test",
        dob: "1985-06-12",
        ssn: "987-65-4321",
        bloodType: "A+",
        allergies: "N/A",
        clinicalNotes: "Patient Corinne Test reports persistent fatigue. Corinne Test has a history of mild asthma."
    }
};
/**
 * @desc    Get patient summary for AI (Pseudonymized)
 * @route   GET /api/patient/:id/ai-preview
 * @access  Private
 */
router.get('/:id/ai-preview', (req, res) => {
    const id = req.params.id;
    const patient = mockPatients[id];
    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    try {
        // Here we trigger the mapping!
        // The original 'patient' remains on the server/DB.
        // We only send the 'shadow copy' to the AI flow.
        const sanitized = sanitizeRecordForAI(patient);
        res.json({
            success: true,
            originalId: id,
            shadowCopy: sanitized,
            note: "This data is safe for NotebookLM ingestion."
        });
    }
    catch (error) {
        console.error("Sanitization error:", error);
        res.status(500).json({ message: 'Error processing patient data for AI' });
    }
});
exports.default = router;
