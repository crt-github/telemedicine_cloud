// client/vault/encryption.js
// THE VAULT: Client-Side Encryption (Zero Knowledge for Cloud Provider)

const ALGORITHM = 'AES-GCM';

// 1. Generate a random Data Encryption Key (DEK) for the session
export const generateKey = async () => {
    return await window.crypto.subtle.generateKey(
        { name: ALGORITHM, length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
};

// 2. Encrypt Data (Before Upload)
export const encryptRecord = async (data, key) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: ALGORITHM, iv: iv },
        key,
        encodedData
    );

    return {
        iv: Array.from(iv),
        ciphertext: Array.from(new Uint8Array(cipherBuffer))
    };
};

// 3. Decrypt Data (After Download)
export const decryptRecord = async (encryptedObj, key) => {
    const iv = new Uint8Array(encryptedObj.iv);
    const ciphertext = new Uint8Array(encryptedObj.ciphertext);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: ALGORITHM, iv: iv },
        key,
        ciphertext
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuffer));
};
