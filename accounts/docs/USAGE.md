# Valentine's Day Proposal Website - Usage Guide

A secure, romantic way to ask someone to be your Valentine with encrypted personal messages and photos.

## Features

- **Secure encryption**: All data is encrypted with AES-256-GCM
- **Personal photos**: Share a beautiful photo slideshow
- **Custom messages**: Add your own heartfelt message
- **Interactive experience**: Fun "No" button that moves away
- **Mobile-friendly**: Works perfectly on all devices
- **No server required**: Pure client-side, hosted on GitHub Pages

## For Recipients

### How to Access Your Valentine's Message

1. **You'll receive two things separately:**
   - A URL link (example: `https://akshayadeshpande.github.io/valentine/#abc123xyz`)
   - A password (sent through a different channel for security)

2. **Open the link** in your web browser (works on desktop or mobile)

3. **Enter your password** when prompted

4. **Enjoy the experience:**
   - View the photo slideshow (if included)
   - Read the personal message
   - Answer the important question!

5. **About that "No" button:**
   - The "No" button is intentionally evasive - it will move away when you try to click it
   - This is part of the fun! 😊
   - You can only click "Yes" 💕

### Troubleshooting

**"Incorrect password"**
- Double-check the password (it's case-sensitive)
- Make sure there are no extra spaces
- You have 3 attempts before lockout

**"Invalid user ID"**
- Verify you copied the complete URL
- The URL should end with `#` followed by characters

**Photos not loading**
- Wait a moment - large photos may take time to load
- Check your internet connection
- Try refreshing the page

**Browser compatibility**
- Use modern browsers: Chrome, Firefox, Safari, or Edge
- Mobile browsers work great too!

## For Senders

### Creating a Valentine's Proposal

#### Step 1: Prepare Your Content

1. **Choose a name** - The recipient's name
2. **Write your message** - A heartfelt personal message (optional)
3. **Select photos** - Put all photos in one folder (optional)
   - Supported: JPG, PNG, GIF, WebP
   - Max total size: 10MB
   - Recommended: 3-10 photos

#### Step 2: Run the Encryption Tool

```bash
cd valentine/build-tool
npm install  # First time only
node encrypt-user.js
```

Follow the prompts:
- Enter recipient's name
- Enter your personal message
- Provide path to photo folder
- Create a strong password (min 12 chars)

#### Step 3: Add the Encrypted Data

1. Copy the JavaScript object output from the tool
2. Open `valentine/js/data.js`
3. Paste it into the `ENCRYPTED_USERS` object
4. Save the file

Example:
```javascript
export const ENCRYPTED_USERS = {
    "kR7mP2xN9qL5vB8w": {
        salt: "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5",
        iv: "MTIzNDU2Nzg5MGFi",
        encryptedData: "U29tZSBsb25nIGVuY3J5cHRlZCBzdHJpbmcgaGVyZS4uLg=="
    }
};
```

#### Step 4: Deploy

```bash
# From your akshayadeshpande.github.io directory
git add valentine/js/data.js
git commit -m "Add new Valentine's user"
git push
```

GitHub Pages will automatically deploy (usually takes 1-2 minutes).

#### Step 5: Share

1. **Send the URL** via one channel (text message, WhatsApp, etc.)
   - Example: `https://akshayadeshpande.github.io/valentine/#kR7mP2xN9qL5vB8w`

2. **Send the password** via a DIFFERENT channel (email, phone call, etc.)
   - This adds an extra layer of security

3. **Wait for their response!** 💕

### Tips for Best Results

**Password Security:**
- Use a memorable but strong password
- Share URL and password separately
- Consider giving a hint if they might forget

**Photos:**
- Use high-quality photos of special moments
- Order matters - first photo appears first
- Landscape photos usually work best
- 5-7 photos is ideal (not too short, not too long)

**Message:**
- Be genuine and heartfelt
- Keep it concise but meaningful
- Mention specific memories or qualities you love

**Timing:**
- Send it when they have time to enjoy the experience
- Don't send it while they're at work or busy
- Consider adding anticipation: "Check your messages, I sent you something special"

## Security & Privacy

### How It Works

1. **Client-side encryption**: Everything happens in the browser
2. **Unique keys**: Each user has a unique salt + password = unique encryption key
3. **Data isolation**: User A's password cannot decrypt User B's data
4. **No server**: No data sent to any server
5. **Tamper-proof**: AES-GCM detects any data modification

### What's Encrypted

- Recipient's name
- Personal message
- All photos (base64 encoded then encrypted)

### What's Not Encrypted

- User ID (it's just a random identifier)
- Salt and IV (these are necessary for decryption but useless without the password)

### Can Someone Hack It?

- **With the password**: Yes, that's the point! They can decrypt their own data.
- **Without the password**: Practically impossible with modern computing.
  - Would take millions of years to brute force with current technology
  - AES-256 is used by governments and militaries
  - PBKDF2 with 100,000 iterations makes brute forcing impractical

### Best Practices

1. **Never commit passwords** to git
2. **Share URL and password separately**
3. **Use strong passwords** (min 12 chars, mixed case, numbers, symbols)
4. **Don't reuse passwords** across different recipients
5. **Keep passwords private** - don't post them publicly

## Technical Details

### Browser Requirements

- Modern browser with Web Crypto API support:
  - Chrome 60+
  - Firefox 60+
  - Safari 11.1+
  - Edge 79+
  - iOS Safari 11.3+
  - Chrome Android 60+

### Encryption Specifications

- **Algorithm**: AES-GCM (Galois/Counter Mode)
- **Key size**: 256 bits
- **Key derivation**: PBKDF2 with SHA-256
- **Iterations**: 100,000
- **Salt length**: 32 bytes (unique per user)
- **IV length**: 12 bytes (unique per user)

### File Sizes

- Maximum total photo size: 10MB
- Automatically compressed to JPEG quality 85%
- Automatically resized if width > 1920px
- Base64 encoding adds ~33% overhead

### Performance

- **Decryption time**: 1-3 seconds (PBKDF2 is intentionally slow)
- **Photo loading**: Depends on size and connection
- **Browser requirements**: Minimal (no heavy JavaScript frameworks)

## FAQ

### Can I send to multiple people?

Yes! Run the encryption tool for each person. Each gets:
- A unique user ID
- A unique URL
- A unique password
- Complete data isolation

### Can someone see my photos without the password?

No. The photos are encrypted as base64 data URLs within the encrypted blob. Without the password, they're just random gibberish.

### What if they forget the password?

They'll have 3 attempts before lockout. If locked out, you'll need to:
1. Share the password again (via call or in person)
2. They can reload the page to reset attempts

### Can I update the message or photos after sharing?

Yes, but you'll need to:
1. Run the encryption tool again with the same user ID
2. Update the data in `data.js`
3. Push the changes
4. The password will need to be communicated again

Or simply create a new user ID with new content.

### Does this work offline?

No, the recipient needs internet to:
- Load the website
- Load the encrypted data
- Load the JavaScript crypto libraries

However, once loaded, it works without backend servers.

### Can I self-host this?

Yes! The entire site is static HTML/CSS/JS. You can:
- Host on any static hosting (Netlify, Vercel, etc.)
- Change the URL in the build tool output
- Keep the same security properties

### Is this really secure?

Yes, for this use case:
- ✅ Prevents casual snooping
- ✅ Prevents data leaks if repo is public
- ✅ Ensures data isolation between users
- ✅ Protects against data modification

However:
- ⚠️ The recipient needs the password (by design)
- ⚠️ If someone has the password, they can decrypt (by design)
- ⚠️ This isn't for state secrets - it's for romantic proposals!

## Support

### Issues?

- Check the browser console for errors
- Verify Web Crypto API is supported
- Try a different browser
- Clear cache and reload

### Questions?

- Read this guide thoroughly
- Check the build-tool README
- Review the code (it's commented!)

## Have Fun! 💕

This tool is made with love for creating memorable Valentine's Day moments. Use it to surprise someone special! 🎉
