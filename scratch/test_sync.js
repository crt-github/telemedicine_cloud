const { sanitizeRecordForAI } = require('../services/security/sanitizer');
const fs = require('fs');
const path = require('path');

const mockPatient = {
    patientId: "P-10045",
    name: "Corinne Test",
    dob: "1985-06-12",
    ssn: "987-65-4321",
    clinicalNotes: "Dr. Aris says Corinne Test is fine."
};

console.log("Starting Sanitization Test...");
const sanitized = sanitizeRecordForAI(mockPatient);

console.log("Sanitized Result:", JSON.stringify(sanitized, null, 2));

const syncDir = path.join(__dirname, '../cloud_sync');
if (!fs.existsSync(syncDir)) {
    fs.mkdirSync(syncDir, { recursive: true });
}

const filePath = path.join(syncDir, 'shadow_test_manual.json');
fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2));

console.log("File Verification Success: cloud_sync/shadow_test_manual.json created.");
