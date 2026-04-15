const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'pseudonym_map.enc');
const KEY = process.env.MAPPING_DB_KEY || crypto.createHash('sha256').update('telemed_demo_secret_2026').digest();
const IV_LENGTH = 16;

/**
 * Encrypted Mapping Database Service
 * Provides AES-256-GCM encrypted storage for patient-to-pseudonym mappings.
 */
class MappingDB {
    constructor() {
        this.cache = { forward: {}, reverse: {} };
        this.load();
    }

    /**
     * Load and decrypt the database from disk
     */
    load() {
        if (!fs.existsSync(DB_PATH)) {
            this.save();
            return;
        }

        try {
            const data = fs.readFileSync(DB_PATH);
            const iv = data.slice(0, IV_LENGTH);
            const tag = data.slice(IV_LENGTH, IV_LENGTH + 16);
            const ciphertext = data.slice(IV_LENGTH + 16);

            const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
            decipher.setAuthTag(tag);
            
            const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
            this.cache = JSON.parse(decrypted.toString());
        } catch (error) {
            console.error('CRITICAL: Mapping DB Tampering or Corruption Detected!', error.message);
            // In production, trigger a security alert
            this.cache = { forward: {}, reverse: {} };
        }
    }

    /**
     * Encrypt and save the cache to disk
     */
    save() {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
        
        const plaintext = JSON.stringify(this.cache);
        const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        const bundle = Buffer.concat([iv, tag, ciphertext]);
        fs.writeFileSync(DB_PATH, bundle);
    }

    getPseudonym(piiHash) {
        return this.cache.forward[piiHash];
    }

    getRealIdentity(pseudonym) {
        return this.cache.reverse[pseudonym];
    }

    getAllReverseMappings() {
        return this.cache.reverse;
    }

    saveMapping(piiHash, pseudonym, realInfo) {
        this.cache.forward[piiHash] = pseudonym;
        this.cache.reverse[pseudonym] = realInfo;
        this.save();
    }
}

const instance = new MappingDB();

module.exports = {
    getPseudonym: (hash) => instance.getPseudonym(hash),
    getRealIdentity: (pseudo) => instance.getRealIdentity(pseudo),
    saveMapping: (hash, pseudo, info) => instance.saveMapping(hash, pseudo, info),
    test: () => {
        console.log('--- MAPPING DB SECURITY TEST ---');
        const testHash = 'test_hash_123';
        instance.saveMapping(testHash, 'Patient_TEST', { name: 'John Doe' });
        const result = instance.getPseudonym(testHash);
        console.log('Mapping verification:', result === 'Patient_TEST' ? 'PASSED' : 'FAILED');
        console.log('Identity verification:', instance.getRealIdentity('Patient_TEST').name === 'John Doe' ? 'PASSED' : 'FAILED');
        console.log('Physical file content:', fs.readFileSync(DB_PATH).toString('hex').slice(0, 32), '... (Encrypted)');
    }
};

// If run directly
if (require.main === module) {
    module.exports.test();
}
