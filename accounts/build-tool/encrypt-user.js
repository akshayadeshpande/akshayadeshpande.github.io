#!/usr/bin/env node

/**
 * Valentine's Day Proposal - User Encryption Tool
 *
 * This script encrypts user data (name, message, photos) and generates
 * a unique user ID and shareable URL.
 *
 * Usage: node encrypt-user.js
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants matching client-side crypto
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32; // 256 bits
const SALT_LENGTH = 32;
const IV_LENGTH = 12;
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB limit

/**
 * Create readline interface for user input
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompt user for input
 */
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

/**
 * Validate password strength
 */
function validatePassword(password) {
    if (password.length < 12) {
        return { valid: false, error: 'Password must be at least 12 characters long' };
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpper && hasLower && (hasNumber || hasSpecial))) {
        return {
            valid: false,
            error: 'Password should contain uppercase, lowercase, and numbers or special characters'
        };
    }

    return { valid: true };
}

/**
 * Generate random user ID
 */
function generateUserId() {
    return crypto.randomBytes(12).toString('base64url').substring(0, 16);
}

/**
 * Derive encryption key from password
 */
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

/**
 * Encrypt data using AES-GCM
 */
function encryptData(data, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();

    // Append auth tag to encrypted data
    const encryptedWithTag = Buffer.concat([
        Buffer.from(encrypted, 'base64'),
        authTag
    ]);

    return encryptedWithTag.toString('base64');
}

/**
 * Process and optimize image
 */
async function processImage(imagePath) {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    console.log(`  Processing: ${path.basename(imagePath)} (${metadata.width}x${metadata.height})`);

    // Resize if too large (max 1920px width)
    let processedImage = image;
    if (metadata.width > 1920) {
        processedImage = processedImage.resize(1920, null, {
            withoutEnlargement: true
        });
    }

    // Convert to JPEG and compress
    const buffer = await processedImage
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

    // Convert to data URL
    const dataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    console.log(`  Compressed to: ${(buffer.length / 1024).toFixed(2)} KB`);

    return dataUrl;
}

/**
 * Scan directory for image files
 */
async function getImageFiles(directory) {
    const files = await fs.readdir(directory);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    });

    return imageFiles.map(file => path.join(directory, file));
}

/**
 * Main encryption process
 */
async function main() {
    console.log('='.repeat(60));
    console.log('💝 Valentine\'s Day Proposal - User Encryption Tool');
    console.log('='.repeat(60));
    console.log();

    try {
        // Get user inputs
        const name = await question('Recipient\'s name: ');
        if (!name.trim()) {
            console.error('❌ Name is required');
            rl.close();
            return;
        }

        console.log();
        const message = await question('Personal message (optional, press Enter to skip): ');

        console.log();
        const photoDir = await question('Path to photo directory (or press Enter to skip photos): ');

        console.log();
        let password = await question('Create a secure password (min 12 chars): ');

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            console.error(`❌ ${passwordValidation.error}`);
            rl.close();
            return;
        }

        console.log('✓ Password is strong');
        console.log();

        // Process photos
        let photos = [];
        let totalSize = 0;

        if (photoDir && photoDir.trim()) {
            console.log('📸 Processing photos...');

            try {
                const imageFiles = await getImageFiles(photoDir.trim());

                if (imageFiles.length === 0) {
                    console.log('⚠️  No image files found in directory');
                } else {
                    console.log(`Found ${imageFiles.length} image(s)\n`);

                    for (const imagePath of imageFiles) {
                        const dataUrl = await processImage(imagePath);
                        totalSize += dataUrl.length;

                        if (totalSize > MAX_TOTAL_SIZE) {
                            console.error('❌ Total size exceeds 10MB limit. Please use fewer or smaller photos.');
                            rl.close();
                            return;
                        }

                        photos.push(dataUrl);
                    }

                    console.log();
                    console.log(`✓ Processed ${photos.length} photo(s)`);
                    console.log(`  Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
                }
            } catch (error) {
                console.error(`❌ Error processing photos: ${error.message}`);
                rl.close();
                return;
            }
        }

        console.log();
        console.log('🔐 Encrypting data...');

        // Create data object
        const userData = {
            name: name.trim(),
            message: message.trim() || '',
            photos: photos
        };

        // Generate user ID, salt, and IV
        const userId = generateUserId();
        const salt = crypto.randomBytes(SALT_LENGTH);
        const iv = crypto.randomBytes(IV_LENGTH);

        // Derive encryption key
        const key = await deriveKey(password, salt);

        // Encrypt data
        const dataString = JSON.stringify(userData);
        const encryptedData = encryptData(dataString, key, iv);

        // Clear password from memory
        password = null;

        console.log('✓ Data encrypted successfully');
        console.log();
        console.log('='.repeat(60));
        console.log('📋 ENCRYPTED USER DATA');
        console.log('='.repeat(60));
        console.log();
        console.log('Add this to accounts/js/data.js in the ENCRYPTED_USERS object:');
        console.log();
        console.log('```javascript');
        console.log(`"${userId}": {`);
        console.log(`    salt: "${salt.toString('base64')}",`);
        console.log(`    iv: "${iv.toString('base64')}",`);
        console.log(`    encryptedData: "${encryptedData}"`);
        console.log('},');
        console.log('```');
        console.log();
        console.log('='.repeat(60));
        console.log('🔗 SHAREABLE LINK');
        console.log('='.repeat(60));
        console.log();
        console.log('URL: https://akshayadeshpande.github.io/accounts/#' + userId);
        console.log();
        console.log('⚠️  IMPORTANT: Share the URL and password through SEPARATE channels!');
        console.log('   Example: Send URL via text, password via email');
        console.log();
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

// Run the script
main();
