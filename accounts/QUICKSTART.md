# 🚀 Quick Start Guide

Get your Valentine's proposal up and running in 5 minutes!

## Prerequisites

- Node.js installed
- Photos of your special moments (optional)
- A heartfelt message
- GitHub repository for deployment

## Step-by-Step Guide

### 1️⃣ Install Dependencies

```bash
cd valentine/build-tool
npm install
```

### 2️⃣ Prepare Your Content

Create a folder with your photos:
```bash
mkdir ~/my-valentine-photos
# Copy your photos there
```

### 3️⃣ Run the Encryption Tool

```bash
node encrypt-user.js
```

You'll be prompted for:
- **Name**: Your Valentine's name (e.g., "Sarah")
- **Message**: Your heartfelt message (e.g., "Every moment with you is special...")
- **Photo directory**: Path to your photos (e.g., `~/my-valentine-photos`)
- **Password**: Create a strong password (e.g., `MyLove2024SecretKey!`)

### 4️⃣ Copy the Output

The tool will output something like:

```javascript
"kR7mP2xN9qL5vB8w": {
    salt: "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5",
    iv: "MTIzNDU2Nzg5MGFi",
    encryptedData: "U29tZSBsb25nIGVuY3J5cHRlZCBzdHJpbmcuLi4="
},
```

Copy this entire block!

### 5️⃣ Add to Data File

Open `valentine/js/data.js` and paste inside `ENCRYPTED_USERS`:

```javascript
export const ENCRYPTED_USERS = {
    "kR7mP2xN9qL5vB8w": {
        salt: "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5",
        iv: "MTIzNDU2Nzg5MGFi",
        encryptedData: "U29tZSBsb25nIGVuY3J5cHRlZCBzdHJpbmcuLi4="
    }
};
```

### 6️⃣ Test Locally (Optional but Recommended)

```bash
# From the valentine directory
python3 -m http.server 8000
# or
npx serve .
```

Open: `http://localhost:8000/#kR7mP2xN9qL5vB8w`

Enter your password and test everything works!

### 7️⃣ Deploy to GitHub Pages

```bash
cd akshayadeshpande.github.io
git add .
git commit -m "Add Valentine's Day proposal"
git push
```

Wait 1-2 minutes for GitHub Pages to deploy.

### 8️⃣ Share with Your Valentine

**URL** (send via text/WhatsApp):
```
https://akshayadeshpande.github.io/valentine/#kR7mP2xN9qL5vB8w
```

**Password** (send via email/call):
```
MyLove2024SecretKey!
```

⚠️ **IMPORTANT**: Send these through DIFFERENT channels!

---

## Example Complete Flow

```bash
# 1. Install
cd valentine/build-tool
npm install

# 2. Run tool
node encrypt-user.js

# Prompts:
# Name: Sarah
# Message: Every moment with you makes my heart skip a beat...
# Photos: /Users/me/sarah-photos
# Password: OurSpecialMoment2024!

# 3. Copy output to valentine/js/data.js

# 4. Test locally
cd ..
python3 -m http.server 8000
# Visit http://localhost:8000/#[your-user-id]

# 5. Deploy
git add .
git commit -m "Add Valentine's proposal for Sarah"
git push

# 6. Share!
# Text: "Hey, I sent you something special: https://akshayadeshpande.github.io/valentine/#abc123xyz"
# Email: "Password: OurSpecialMoment2024!"
```

---

## Tips for Success

### 📸 Photos
- Use 5-7 high-quality photos
- Include special moments together
- Mix candids and posed shots
- Keep total size under 10MB

### 💌 Message
- Be genuine and heartfelt
- Mention specific memories
- Keep it concise (2-4 sentences)
- End with something romantic

### 🔒 Password
- Make it memorable but strong
- 12+ characters
- Mix of uppercase, lowercase, numbers
- Could reference an inside joke

### ⏰ Timing
- Send when they have time to enjoy it
- Not while they're busy or at work
- Consider building anticipation first
- Maybe Valentine's eve or morning of

---

## Troubleshooting

### Build Tool Issues

**"Cannot find module 'sharp'"**
```bash
cd valentine/build-tool
npm install
```

**"No image files found"**
- Check the directory path is correct
- Ensure photos are .jpg, .png, .gif, or .webp

### Website Issues

**"Incorrect password"**
- Password is case-sensitive
- Make sure there are no extra spaces
- You have 3 attempts before lockout

**Photos not loading**
- Check file sizes (max 10MB total)
- Wait a few seconds for large photos
- Check browser console for errors

### Deployment Issues

**Changes not showing**
- Wait 1-2 minutes for GitHub Pages
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check git push succeeded

---

## Multiple People?

Run the tool multiple times! Each person gets:
- Unique URL
- Unique password
- Completely separate data

```javascript
export const ENCRYPTED_USERS = {
    "person1UserId": { salt: "...", iv: "...", encryptedData: "..." },
    "person2UserId": { salt: "...", iv: "...", encryptedData: "..." },
    "person3UserId": { salt: "...", iv: "...", encryptedData: "..." }
};
```

---

## Need Help?

- 📖 [Full Documentation](README.md)
- 📚 [Usage Guide](docs/USAGE.md)
- 🛠️ [Build Tool README](build-tool/README.md)

---

## Ready? Let's Go! 💕

```bash
cd valentine/build-tool
node encrypt-user.js
```

**Good luck with your proposal! 🎉💝**
