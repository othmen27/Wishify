# Running Wishify Locally

## Quick Setup for Local Development

### Option 1: Simple Manual Switch (Recommended)

1. **To run locally:**
   - Open `client/src/config.js`
   - Change `isDevelopment: true` to `isDevelopment: true` (should already be true)
   - Start your backend: `cd server && npm start`
   - Start your frontend: `cd client && npm start`

2. **To deploy to AWS:**
   - Open `client/src/config.js`
   - Change `isDevelopment: true` to `isDevelopment: false`
   - Run: `deploy-frontend.bat`

### Option 2: Use the Switch Scripts

1. **For local development:**
   ```bash
   switch-to-local.bat
   ```

2. **For production deployment:**
   ```bash
   switch-to-production.bat
   ```

## What the config.js does:

- When `isDevelopment: true` → API calls go to `http://localhost:5000`
- When `isDevelopment: false` → API calls go to `http://18.209.102.221`

## Current Status:

✅ **Config system is set up**
✅ **auth.js is updated to use config**
❌ **Other files still need manual update**

## To update remaining files manually:

You need to replace hardcoded API calls in these files:
- `client/src/Login.jsx`
- `client/src/Signup.jsx`
- `client/src/Profile.jsx`
- `client/src/Wishlist.jsx`
- `client/src/Home.jsx`
- `client/src/Create.jsx`
- `client/src/components/Chat.jsx`
- `client/src/components/ChatWindow.jsx`
- `client/src/components/ChatList.jsx`
- And others...

**Replace this:**
```javascript
fetch('http://18.209.102.221/api/...')
```

**With this:**
```javascript
import config from '../config';
fetch(`${config.getApiUrl()}/api/...`)
```

## Quick Test:

1. Set `isDevelopment: true` in `config.js`
2. Start backend: `cd server && npm start`
3. Start frontend: `cd client && npm start`
4. Your app should now work locally!

## Need Help?

If you want me to update all the files automatically, just ask and I'll create a better script! 