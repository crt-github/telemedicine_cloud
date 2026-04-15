import express, { Request, Response } from 'express';
// @ts-ignore
const { sanitizeRecordForAI } = require('../../../services/security/sanitizer');

const router = express.Router();

// Mock Patient Data (In production, this comes from a HIPAA-compliant Database)
const mockPatients: any = {
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
router.get('/:id/ai-preview', (req: Request, res: Response) => {
    const id: string = req.params.id as string;
    const patient = (mockPatients as any)[id];

    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    try {
        // Here we trigger the mapping!
        // The original 'patient' remains on the server/DB.
        // We only send the 'shadow copy' to the AI flow.
        const sanitized = sanitizeRecordForAI(patient);
        
        // PHYSICAL SYNC: Write the shadow copy to the cloud_sync folder
        const fs = require('fs');
        const path = require('path');
        const syncDir = path.join(__dirname, '../../../cloud_sync');
        
        if (!fs.existsSync(syncDir)) {
            fs.mkdirSync(syncDir, { recursive: true });
        }
        
        const fileName = `shadow_patient_${id}.json`;
        const filePath = path.join(syncDir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2));
        
        res.json({
            success: true,
            originalId: id,
            pseudonym: sanitized.pseudonym,
            syncPath: `cloud_sync/${fileName}`,
            shadowCopy: sanitized,
            note: "Active Sync Successful: This data is now available to NotebookLM via the connected Cloud folder."
        });
    } catch (error) {
        console.error("Sanitization error:", error);
        res.status(500).json({ message: 'Error processing patient data for AI' });
    }
});

export default router;
