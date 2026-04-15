const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const mappingDB = require('./mapping_db');

/**
 * Generate a deterministic hash for a given PII string (e.g., SSN or Name+DOB)
 * Uses a local secret pepper (in production, fetch from Key Broker)
 */
const hashPII = (piiString) => {
    const pepper = process.env.LOCAL_PEPPER || 'local_demo_pepper_123';
    return crypto.createHash('sha256').update(piiString + pepper).digest('hex');
};

/**
 * Pseudonymize a medical record.
 * Replaces real identity with a safe 'Patient_XXXX' alias and strips identified PII.
 */
const sanitizeRecordForAI = (rawRecord) => {
    // Unique identifier based on stable PII (like SSN or PatientID)
    const piiHash = hashPII(String(rawRecord.patientId || rawRecord.ssn || rawRecord.name));
    
    let pseudonym = mappingDB.getPseudonym(piiHash);
    
    if (!pseudonym) {
        // Generate new pseudonym
        const shortId = crypto.randomBytes(2).toString('hex').toUpperCase(); // e.g., A7F9
        pseudonym = `Patient_${shortId}`;
        
        // Save mapping securely in the encrypted DB
        mappingDB.saveMapping(piiHash, pseudonym, {
            id: rawRecord.patientId,
            name: rawRecord.name,
            dob: rawRecord.dob,
            ssn: rawRecord.ssn
        });
    }

    // Create the shadow copy
    const sanitizedRecord = { ...rawRecord };
    
    // 1. Replace identity fields
    sanitizedRecord.pseudonym = pseudonym;
    delete sanitizedRecord.patientId;
    delete sanitizedRecord.name;
    delete sanitizedRecord.dob;
    delete sanitizedRecord.ssn;
    delete sanitizedRecord.address;
    delete sanitizedRecord.phone;
    delete sanitizedRecord.email;

    // 2. Deep redaction using Regex (simulated NER for names/locations inside clinical notes)
    if (sanitizedRecord.clinicalNotes) {
        let notes = sanitizedRecord.clinicalNotes;
        
        // Example: naive replacement of the patient's name if they appear in notes
        if (rawRecord.name) {
            const nameRegex = new RegExp(rawRecord.name, 'gi');
            notes = notes.replace(nameRegex, pseudonym);
        }
        
        // Example: redacting common SSN/Phone patterns
        notes = notes.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]'); // US SSN
        notes = notes.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED_PHONE]');
        
        sanitizedRecord.clinicalNotes = notes;
    }

    // 3. Mark as sanitized and track timestamp
    sanitizedRecord._securityMetadata = {
        sanitizedForAI: true,
        timestamp: new Date().toISOString(),
        version: "1.0",
        warning: "SHADOW COPY: Not for legal medical use without re-identification."
    };

    return sanitizedRecord;
};

/**
 * Re-identify an AI synthesis result
 * Maps the pseudonym back to the real patient name for the doctor's UI
 * 
 * @param {string} aiText The raw output from NotebookLM (e.g., "Patient_A7F9 has...")
 * @returns {string} The text with real names injected
 */
const reIdentifyResult = (aiText) => {
    const reverseMappings = mappingDB.getAllReverseMappings();
    let reIdentifiedText = aiText;
    
    // Find all Patient_XXXX patterns and replace them
    for (const [pseudonym, realInfo] of Object.entries(reverseMappings)) {
        if (reIdentifiedText.includes(pseudonym)) {
            const aliasRegex = new RegExp(pseudonym, 'g');
            // We append a small badge [AI] so the doctor knows this was originally a pseudonym
            reIdentifiedText = reIdentifiedText.replace(aliasRegex, `${realInfo.name}`);
        }
    }
    
    return reIdentifiedText;
};

module.exports = {
    sanitizeRecordForAI,
    reIdentifyResult
};
