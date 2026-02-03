# 💝 Valentine's Day Proposal Website

A secure, romantic web app for proposing to your Valentine with encrypted personal messages and photos.

## ✨ Features

- 🔒 **Client-side AES-256 encryption** - Military-grade security
- 📸 **Photo slideshow** - Share your favorite memories
- 💌 **Personal messages** - Write from the heart
- 🎯 **Fun interaction** - Evasive "No" button that can't be clicked
- 📱 **Mobile-friendly** - Perfect on any device
- 🚀 **No server needed** - Pure static site on GitHub Pages

## 🎬 Demo

Visit: `https://akshayadeshpande.github.io/valentine/#[userId]`

(You'll need a valid user ID and password)

## 🚀 Quick Start

### For Recipients

1. Open the URL you received
2. Enter your password
3. Enjoy the experience!

[📖 Full recipient guide](docs/USAGE.md#for-recipients)

### For Senders

1. **Install dependencies:**
   ```bash
   cd valentine/build-tool
   npm install
   ```

2. **Prepare your content:**
   - Photos in a folder
   - Personal message
   - Strong password

3. **Run encryption tool:**
   ```bash
   node encrypt-user.js
   ```

4. **Add encrypted data** to `valentine/js/data.js`

5. **Deploy:**
   ```bash
   git add valentine/js/data.js
   git commit -m "Add Valentine's user"
   git push
   ```

6. **Share URL + password** (through different channels!)

[📖 Full sender guide](docs/USAGE.md#for-senders)

## 📁 Project Structure

```
valentine/
├── index.html              # Main entry point
├── css/
│   └── styles.css         # Romantic theme styling
├── js/
│   ├── app.js            # Main application logic
│   ├── crypto.js         # Encryption/decryption utilities
│   ├── data.js           # Encrypted user data storage
│   └── ui.js             # UI components (PhotoSlider, etc.)
├── build-tool/
│   ├── encrypt-user.js   # Tool to add new users
│   ├── package.json      # Dependencies
│   └── README.md         # Build tool documentation
├── docs/
│   └── USAGE.md          # Complete usage guide
└── README.md             # This file
```

## 🔐 Security

### Encryption Specs

- **Algorithm**: AES-GCM 256-bit
- **Key Derivation**: PBKDF2-SHA256 (100,000 iterations)
- **Data Isolation**: Unique salt per user
- **Tamper Detection**: Built-in with AES-GCM

### Security Guarantees

✅ User A's password cannot decrypt User B's data
✅ Encrypted data is unreadable without password
✅ Tampering is detected automatically
✅ No data sent to servers
✅ No passwords stored anywhere

### How It Works

```
Password + Unique Salt → PBKDF2 → Encryption Key
           ↓
User Data → AES-GCM Encryption → Encrypted Blob
           ↓
Stored in data.js (public, but encrypted)
```

Each user has:
- Unique user ID (random)
- Unique salt (32 bytes)
- Unique IV (12 bytes)
- Encrypted data blob

[📖 Full security details](docs/USAGE.md#security--privacy)

## 🎨 Tech Stack

- **Vanilla JavaScript** (ES6 modules)
- **Web Crypto API** (SubtleCrypto)
- **CSS3** (animations, gradients, glassmorphism)
- **Google Fonts** (Playfair Display, Poppins)
- **Node.js** (build tool only)
- **Sharp** (image processing in build tool)

No frameworks, no dependencies in the web app - just pure, fast, secure code.

## 📱 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 11.1+
- Edge 79+
- Mobile browsers (iOS 11.3+, Android Chrome 60+)

Requires Web Crypto API support.

## 🎯 User Flow

```
1. Recipient opens URL with user ID
   ↓
2. Enters password
   ↓
3. Password + salt → derive key
   ↓
4. Decrypt data with key
   ↓
5. Photo slideshow experience
   ↓
6. Personal message
   ↓
7. "Will you be my Valentine?" question
   ↓
8. Interactive buttons ("Yes" or evasive "No")
   ↓
9. Success celebration!
```

## 📸 Photo Guidelines

- **Formats**: JPG, PNG, GIF, WebP
- **Max size**: 10MB total
- **Auto-optimization**: Compressed to 85% JPEG quality
- **Auto-resize**: Max width 1920px
- **Recommended**: 5-7 photos

## 🛠️ Development

### Local Testing

1. Start a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

2. Open: `http://localhost:8000/valentine/#testUserId`

### Adding Test Data

Run the encryption tool with test data:
```bash
cd build-tool
node encrypt-user.js
```

Then add the output to `js/data.js`.

### Modifying Styles

Edit `css/styles.css` for:
- Colors (CSS variables at top)
- Animations
- Responsive breakpoints
- Theme customization

## 🎨 Customization

### Change Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-pink: #FF6B9D;    /* Main accent color */
    --deep-rose: #C44569;       /* Secondary accent */
    --gold: #FFD700;            /* Highlight color */
    --light-pink: #FFE5EC;      /* Background tints */
}
```

### Change Fonts

Update Google Fonts link in `index.html` and CSS variables:

```css
--font-heading: 'Your Heading Font', serif;
--font-body: 'Your Body Font', sans-serif;
```

### Adjust Timing

In `js/ui.js`, modify:
- `autoAdvanceDelay: 4000` - Photo slideshow speed (milliseconds)
- Transition durations in CSS

## 📊 File Sizes

- **index.html**: ~6 KB
- **styles.css**: ~12 KB
- **JavaScript** (total): ~15 KB
- **Per user data**: Varies (depends on photos)
  - No photos: ~1 KB
  - With photos: 1-10 MB

## 🐛 Troubleshooting

### "Incorrect password"
- Check password case-sensitivity
- Ensure no extra spaces
- Verify it matches the password used during encryption

### Photos not loading
- Check total size < 10MB
- Verify image formats are supported
- Check browser console for errors

### "Web Crypto API not supported"
- Update browser to latest version
- Use Chrome, Firefox, Safari, or Edge
- Ensure HTTPS or localhost (required for crypto API)

### Blank screen
- Check browser console for errors
- Verify all JS files loaded
- Check data.js has valid encrypted data

## 📄 License

MIT License - Feel free to use, modify, and share!

## 💖 Contributing

This is a personal project, but suggestions are welcome!

- Report bugs via issues
- Suggest features
- Share your success stories!

## 🙏 Credits

Built with ❤️ for creating memorable Valentine's Day moments.

## 📚 Documentation

- [Complete Usage Guide](docs/USAGE.md)
- [Build Tool README](build-tool/README.md)

## ⚠️ Important Notes

1. **Share URL and password separately** for security
2. **Don't commit passwords** to git
3. **Use strong passwords** (min 12 characters)
4. **Test before sharing** to ensure everything works
5. **Have fun!** This is about creating memorable moments! 💕

---

Made with 💝 for Valentine's Day proposals
