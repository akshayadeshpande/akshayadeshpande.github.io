# Valentine's Day Proposal - Build Tool

This tool encrypts user data and generates unique, shareable links for the Valentine's Day proposal website.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
cd valentine/build-tool
npm install
```

## Usage

```bash
node encrypt-user.js
```

or

```bash
npm run encrypt
```

## Step-by-Step Process

1. **Run the script**
   ```bash
   node encrypt-user.js
   ```

2. **Provide the following information when prompted:**
   - **Recipient's name**: The name of the person you're asking
   - **Personal message**: Optional custom message (or press Enter to skip)
   - **Photo directory**: Path to a folder containing photos (or press Enter to skip)
   - **Password**: Create a strong password (min 12 characters, including uppercase, lowercase, and numbers/special characters)

3. **The script will:**
   - Process and compress all images in the specified directory
   - Encrypt all data (name, message, photos) with AES-256-GCM
   - Generate a unique user ID
   - Output the encrypted data and shareable link

4. **Copy the output:**
   - Copy the JavaScript object from the output
   - Paste it into `valentine/js/data.js` in the `ENCRYPTED_USERS` object

5. **Share the link:**
   - URL: `https://akshayadeshpande.github.io/valentine/#[userId]`
   - **IMPORTANT**: Share the URL and password through SEPARATE channels for security
     - Example: Send URL via text message, send password via email

## Photo Guidelines

- **Supported formats**: JPG, JPEG, PNG, GIF, WebP
- **Automatic optimization**: Images are automatically compressed and resized
  - Maximum width: 1920px
  - Quality: 85% JPEG compression
- **Size limit**: Total size of all photos must be under 10MB
- **Recommended**: 3-10 photos for best experience

## Example

```bash
$ node encrypt-user.js

============================================================
💝 Valentine's Day Proposal - User Encryption Tool
============================================================

Recipient's name: Sarah
Personal message (optional): I've loved every moment we've spent together...
Path to photo directory: ./photos
Create a secure password (min 12 chars): MySecurePass123!

✓ Password is strong

📸 Processing photos...
Found 5 image(s)

  Processing: photo1.jpg (4032x3024)
  Compressed to: 245.67 KB
  Processing: photo2.jpg (3840x2160)
  Compressed to: 198.34 KB
  ...

✓ Processed 5 photo(s)
  Total size: 1.12 MB

🔐 Encrypting data...
✓ Data encrypted successfully

============================================================
📋 ENCRYPTED USER DATA
============================================================

Add this to valentine/js/data.js:

"kR7mP2xN9qL5vB8w": {
    salt: "...",
    iv: "...",
    encryptedData: "..."
},

============================================================
🔗 SHAREABLE LINK
============================================================

URL: https://akshayadeshpande.github.io/valentine/#kR7mP2xN9qL5vB8w

⚠️  IMPORTANT: Share URL and password through SEPARATE channels!
```

## Security Features

- **AES-256-GCM encryption**: Military-grade encryption
- **PBKDF2 key derivation**: 100,000 iterations with SHA-256
- **Unique salts**: Each user has a unique salt, ensuring data isolation
- **Authentication tags**: Tamper detection built-in
- **No password storage**: Passwords are never stored, only used for key derivation

## Troubleshooting

### "No image files found"
- Ensure the directory path is correct
- Check that the directory contains supported image formats (JPG, PNG, etc.)

### "Total size exceeds 10MB limit"
- Use fewer photos
- Pre-compress images before processing
- Use lower resolution images

### "Password is weak"
- Ensure password is at least 12 characters
- Include uppercase letters, lowercase letters, and numbers or special characters

### Module errors
- Run `npm install` in the build-tool directory
- Ensure Node.js version is 16 or higher

## Adding Multiple Users

You can run the script multiple times to add multiple users. Each user gets:
- A unique user ID
- A unique encryption salt
- A unique initialization vector
- Complete data isolation (passwords don't work across users)

Example `data.js` with multiple users:

```javascript
export const ENCRYPTED_USERS = {
    "kR7mP2xN9qL5vB8w": {
        salt: "...",
        iv: "...",
        encryptedData: "..."
    },
    "mT9pQ3yO1sM6wD5x": {
        salt: "...",
        iv: "...",
        encryptedData: "..."
    },
    "nU2rR8zA4vN7eC3b": {
        salt: "...",
        iv: "...",
        encryptedData: "..."
    }
};
```

## Deployment

After adding new users:

1. Commit changes to git:
   ```bash
   git add valentine/js/data.js
   git commit -m "Add new Valentine's user"
   git push
   ```

2. GitHub Pages will automatically deploy the changes

3. Share the URL and password (through separate channels!) with the recipient
