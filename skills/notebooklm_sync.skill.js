/**
 * NotebookLM Synchronizer Skill for Antigravity
 * Protocol: Model Context Protocol (MCP)
 * 
 * This skill allows the AI to manage the shadow-copy sync process 
 * and monitor NotebookLM library status.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    name: "notebooklm_sync",
    description: "Securely sync pseudonymized clinical data to NotebookLM libraries.",
    
    tools: [
        {
            name: "sync_patient_to_library",
            description: "Triggers the sanitization and cloud-sync of a patient record.",
            parameters: {
                patientId: "The internal ID of the patient to sync."
            },
            handler: async ({ patientId }) => {
                try {
                    // Call the internal TeleMed API (Authenticated)
                    const response = await axios.get(`http://localhost:5000/api/patient/${patientId}/ai-preview`, {
                        // In a real MCP environment, the skill would use a machine-to-machine JWT
                        headers: { 'Authorization': 'Bearer Skill-Auth-Token-2026' } 
                    });
                    
                    if (response.data.success) {
                        return {
                            status: "success",
                            pseudonym: response.data.pseudonym,
                            cloudPath: response.data.syncPath,
                            message: `Patient records successfully pseudonymized and pushed to NotebookLM Sync folder.`
                        };
                    }
                } catch (error) {
                    return { status: "error", message: `Sync failed: ${error.message}` };
                }
            }
        },
        {
            name: "get_library_status",
            description: "Checks the sync status of current NotebookLM libraries.",
            handler: async () => {
                const syncDir = path.join(__dirname, '../cloud_sync');
                if (!fs.existsSync(syncDir)) return { status: "empty", fileCount: 0 };
                
                const files = fs.readdirSync(syncDir);
                return {
                    status: "active",
                    fileCount: files.length,
                    syncDir: syncDir,
                    lastSync: fs.statSync(syncDir).mtime
                };
            }
        }
    ]
};
