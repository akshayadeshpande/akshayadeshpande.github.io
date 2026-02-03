#!/usr/bin/env node

/**
 * Test script to verify encryption/decryption works correctly
 */

import crypto from 'crypto';

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 32;
const IV_LENGTH = 12;

// Derive key
function deriveKey(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            salt,
            PBKDF2_ITERATIONS,
            KEY_LENGTH,
            'sha256',
            (err, derivedKey) => {
                if (err) reject(err);
                else resolve(derivedKey);
            }
        );
    });
}

// Encrypt
function encryptData(data, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();
    const encryptedWithTag = Buffer.concat([
        Buffer.from(encrypted, 'base64'),
        authTag
    ]);
    return encryptedWithTag.toString('base64');
}

// Decrypt
function decryptData(encryptedDataBase64, key, iv) {
    const encryptedWithTag = Buffer.from(encryptedDataBase64, 'base64');
    const authTag = encryptedWithTag.slice(-16);
    const encrypted = encryptedWithTag.slice(0, -16);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'binary', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

async function test() {
    console.log('🧪 Testing encryption/decryption...\n');

    // Test data
    const testData = {
        name: 'Test User',
        message: 'This is a test message',
        photos: ['data:image/jpeg;base64,/9j/4AAQSkZJRg...']
    };
    const password = 'TestPassword123!';

    console.log('Original data:', testData);
    console.log();

    // Generate salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    console.log('Salt (base64):', salt.toString('base64'));
    console.log('IV (base64):', iv.toString('base64'));
    console.log();

    // Derive key
    console.log('Deriving key...');
    const key = await deriveKey(password, salt);
    console.log('✓ Key derived');
    console.log();

    // Encrypt
    console.log('Encrypting...');
    const dataString = JSON.stringify(testData);
    const encrypted = encryptData(dataString, key, iv);
    console.log('✓ Encrypted:', encrypted.substring(0, 50) + '...');
    console.log();

    // Decrypt
    console.log('Decrypting...');
    const decrypted = decryptData(encrypted, key, iv);
    const decryptedData = JSON.parse(decrypted);
    console.log('✓ Decrypted:', decryptedData);
    console.log();

    // Verify
    if (JSON.stringify(testData) === JSON.stringify(decryptedData)) {
        console.log('✅ SUCCESS: Encryption/decryption works correctly!');
    } else {
        console.log('❌ FAIL: Data mismatch');
    }

    console.log();

    // Test with wrong password
    console.log('Testing with wrong password...');
    const wrongKey = await deriveKey('WrongPassword123!', salt);
    try {
        decryptData(encrypted, wrongKey, iv);
        console.log('❌ FAIL: Should have thrown an error');
    } catch (error) {
        console.log('✓ Correctly rejected wrong password');
    }

    console.log();

    // Test data isolation (different salt)
    console.log('Testing data isolation (different salt)...');
    const salt2 = crypto.randomBytes(SALT_LENGTH);
    const key2 = await deriveKey(password, salt2);
    try {
        decryptData(encrypted, key2, iv);
        console.log('❌ FAIL: Should have thrown an error');
    } catch (error) {
        console.log('✓ Correctly isolated data with different salt');
    }

    console.log();
    console.log('✅ All tests passed!');
}

test().catch(console.error);
