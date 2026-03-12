// services/bridge/dicom-scrubber.js

// Mock DICOM Tag Constants
const TAGS = {
    PatientName: '0010,0010',
    PatientID: '0010,0020',
    PatientBirthDate: '0010,0030',
    StudyDate: '0008,0020' // Keep this
};

const scrubDicomHeader = (dicomHeader) => {
    const scrubbed = { ...dicomHeader };

    // 1. Remove Direct PII
    delete scrubbed[TAGS.PatientName];
    delete scrubbed[TAGS.PatientID];
    delete scrubbed[TAGS.PatientBirthDate];

    // 2. Add Anonymization Tags
    scrubbed['0012,0062'] = 'YES'; // Patient Identity Removed
    scrubbed['0012,0063'] = 'Project-TeleMed-Swiss-Bridge';

    return scrubbed;
};

module.exports = { scrubDicomHeader };
