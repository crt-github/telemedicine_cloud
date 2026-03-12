// services/bridge/anonymizer.js
const crypto = require('crypto');

// Master Salt (Stored in Swiss Safe Zone ONLY)
const SALT = process.env.PII_SALT || 'swiss-secret-salt-strictly-internal';

const anonymizePatient = (patient) => {
    // 1. Generate Deterministic UUID (Tokenization)
    // Allows re-identification ONLY by Swiss Service with the SALT
    const hash = crypto.createHmac('sha256', SALT)
        .update(patient.socialSecurityNumber || patient.id)
        .digest('hex');

    return {
        anonId: `anon-${hash.substring(0, 12)}`,
        age: calculateAge(patient.dob), // Pass Age, not DOB
        medicalHistory: patient.medicalHistory, // Assumed scrubbed of names
        location: patient.canton // Generalized location
        // REMOVED: Name, Address, Phone, Email
    };
};

const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

module.exports = { anonymizePatient };
