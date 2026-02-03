/**
 * Cryptography utilities for secure data encryption/decryption
 * Uses Web Crypto API with AES-GCM and PBKDF2
 */

// Constants for cryptographic operations
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256;
const SALT_LENGTH = 32;
const IV_LENGTH = 12;

/**
 * Convert base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Convert ArrayBuffer to base64 string
 */
export function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Derive encryption key from password using PBKDF2
 * @param {string} password - User's password
 * @param {ArrayBuffer} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} Derived encryption key
 */
export async function deriveKey(password, salt) {
    try {
        // Convert password to ArrayBuffer
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        // Import password as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        // Derive AES-GCM key using PBKDF2
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            {
                name: 'AES-GCM',
                length: KEY_LENGTH
            },
            false,
            ['decrypt']
        );

        return key;
    } catch (error) {
        console.error('Key derivation failed:', error);
        throw new Error('Failed to derive encryption key');
    }
}

/**
 * Decrypt data using AES-GCM
 * @param {string} encryptedDataBase64 - Base64 encoded encrypted data
 * @param {string} ivBase64 - Base64 encoded initialization vector
 * @param {CryptoKey} key - Decryption key
 * @returns {Promise<Object>} Decrypted data object
 */
export async function decryptData(encryptedDataBase64, ivBase64, key) {
    try {
        // Convert base64 to ArrayBuffer
        const encryptedData = base64ToArrayBuffer(encryptedDataBase64);
        const iv = base64ToArrayBuffer(ivBase64);

        // Decrypt using AES-GCM
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedData
        );

        // Convert decrypted ArrayBuffer to string and parse JSON
        const decoder = new TextDecoder();
        const decryptedString = decoder.decode(decryptedBuffer);
        const decryptedData = JSON.parse(decryptedString);

        return decryptedData;
    } catch (error) {
        console.error('Decryption failed:', error);
        // Throw a user-friendly error (likely wrong password)
        throw new Error('WRONG_PASSWORD');
    }
}

/**
 * Check if Web Crypto API is supported
 */
export function isWebCryptoSupported() {
    return !!(window.crypto && window.crypto.subtle);
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password) {
    return password && password.length >= 12;
}
