/**
 * Encrypted user data storage
 * Each user has a unique ID, salt, IV, and encrypted data blob
 * Photos are stored separately in photos/[userId]/ directory
 *
 * Structure:
 * {
 *   "userId": {
 *     salt: "base64-encoded-salt",
 *     iv: "base64-encoded-iv",
 *     encryptedData: "base64-encrypted-blob",
 *     hasPhotos: true // indicates if photos folder exists
 *   }
 * }
 *
 * Decrypted data contains:
 * {
 *   name: "Recipient's name",
 *   message: "Personal message"
 * }
 *
 * Photos are loaded from: photos/[userId]/quotes.json
 */

export const ENCRYPTED_USERS = {
};

/**
 * Get user data by ID
 * @param {string} userId
 * @returns {Object|null} Encrypted user data or null if not found
 */
export function getUserById(userId) {
    return ENCRYPTED_USERS[userId] || null;
}

/**
 * Get all user IDs
 * @returns {Array<string>}
 */
export function getAllUserIds() {
    return Object.keys(ENCRYPTED_USERS);
}
