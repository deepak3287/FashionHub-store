# Troubleshooting & Common Issues

## Build & Deployment Issues

### ❌ Error: "Failed to compile - Unterminated regexp literal"
**Status**: ✅ FIXED
- **Cause**: Stray "/" character in file
- **Solution**: Already fixed in login/page.tsx

### ❌ Error: "Module not found '@/lib/firebase'"
**Status**: ✅ NOT AN ISSUE
- **Cause**: Import alias misconfiguration
- **Solution**: Already using correct "@/" alias from tsconfig.json
- **Verify**: Check `tsconfig.json` has:
```json
{
  "baseUrl": ".",
  "paths": { "@/*": ["./*"] }
}
```

### ❌ MongoDB Connection Errors During Build
**Status**: ✅ EXPECTED
- **Message**: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
- **Cause**: MongoDB not running during build (expected in dev)
- **Solution**: Normal - doesn't affect auth system
- **Why it happens**: API routes try to connect during static generation
- **Does NOT prevent deployment**: ✅ Build succeeds anyway

### ❌ Error: "Cannot find module 'firebase'"
**Status**: ✅ SHOULD NOT HAPPEN
- **Solution**: 
```bash
npm install firebase
```

---

## Authentication Issues

### ❌ "Account button shows 404"
**Status**: ✅ FIXED
- **Cause**: `/login` route was missing
- **Solution**: Created `/app/(store)/login/page.tsx`
- **Verify**: 
```bash
ls -la app/(store)/login/page.tsx
# Should show file exists
```

### ❌ "Clicking account goes to wrong URL"
**Status**: ✅ FIXED
- **Cause**: Header was using server-side JWT check
- **Solution**: Converted Header to client component with Firebase auth check
- **Verify**: Header.tsx starts with `"use client"`

### ❌ "Login button doesn't work"
**Possible Causes**:
1. **Firebase credentials are placeholders**
   - Go to `/lib/firebase.ts`
   - Check if values say "YOUR_KEY" or "YOUR_DOMAIN"
   - **Solution**: Add real Firebase credentials

2. **Firebase project doesn't have Email/Password auth enabled**
   - Go to Firebase Console
   - Authentication → Sign-in method
   - Enable "Email/Password"

3. **Firebase project doesn't have Google auth enabled**
   - Go to Firebase Console
   - Authentication → Sign-in method
   - Enable "Google"
   - Add OAuth consent screen configuration

4. **Check browser console for errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages
   - This will tell you exactly what's wrong

### ❌ "Google login shows blank popup"
**Cause**: Google OAuth not configured
- **Solution**:
  1. Go to Firebase Console
  2. Authentication → Sign-in method → Google
  3. Click "Enable"
  4. Provide project support email
  5. Save

### ❌ "Password reset email not sending"
**Possible Causes**:
1. Firebase SMTP not configured
2. Email is not registered
3. Firebase email verification pending

**Solution**:
- Verify email exists in Firebase console
- Check spam folder
- Firebase may have rate limiting

### ❌ "Redirects not working after login"
**Cause**: useRouter not working correctly
- **Solution**: Ensure you're using:
```typescript
import { useRouter } from "next/navigation"; // ✅ Correct
// NOT:
// import { useRouter } from "next/router"; // ❌ Wrong (Pages Router)
```

### ❌ "Auth state not updating in Header"
**Cause**: Header auth listener not running
- **Solution**: Ensure Header.tsx is a client component:
```typescript
"use client"; // ✅ Must be at top of file
```

---

## Vercel Deployment Issues

### ❌ "Cannot read property 'apiKey' of undefined"
**Cause**: Firebase environment variables not set
- **Solution**:
  1. Go to Vercel project settings
  2. Environment Variables
  3. Add these variables:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_value
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
  NEXT_PUBLIC_FIREBASE_APP_ID=your_value
  ```
  4. Redeploy

### ❌ "Google OAuth returns error on deployed site"
**Cause**: Google OAuth redirect URI not configured
- **Solution**:
  1. Go to Firebase Console
  2. Authentication → Sign-in method → Google
  3. Under "Authorized JavaScript origins", add:
  ```
  https://your-domain.vercel.app
  http://localhost:3000 (for local testing)
  ```

### ❌ "Build succeeds locally but fails on Vercel"
**Common causes**:
1. Environment variables not set
2. Different Node version
3. Different MongoDB connection

**Solution**:
```bash
# Test with exact Vercel conditions
vercel build --prod

# Or check Vercel logs
vercel logs --follow
```

### ❌ "Static site generation fails"
**Cause**: Pages try to connect to database during build
- **Solution**: Already configured to skip dynamic routes during build
- **Note**: This is normal for API routes

---

## Routing Issues

### ❌ "User goes to /login but page is blank"
**Cause**: Loading state not rendered
- **Solution**: Check if you're rendering something while loading
```typescript
if (loading) {
  return <main className="premium-container py-16"><div>Loading...</div></main>;
}
```

### ❌ "Route group (store) causing issues"
**How (store) works**:
```
/app/(store)/login/page.tsx    → /login
/app/(store)/register/page.tsx → /register  
/app/(store)/account/page.tsx  → /account
/app/(store)/shop/page.tsx     → /shop
```

The `(store)` is NOT part of the URL - it's just for layout grouping
- ✅ This is correct in Next.js 14 App Router
- ✅ All routes accessible without the folder name

### ❌ "Admin login doesn't work"
**Note**: Admin login is separate at `/admin/login` (not in store group)
- Admin routes: `/app/admin/` (different layout)
- Store routes: `/app/(store)/` (with Header/Footer)

---

## Performance Issues

### ⚠️ "Page loads slowly"
**Possible causes**:
1. Firebase initialization delay
2. Auth state checking delay
3. Large component tree

**Solution**:
```typescript
// Add loading state while auth check happens
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (u) => {
    setUser(u);
    setLoading(false); // ✅ Set to false when done
  });
  return () => unsub();
}, []);

if (loading) return <div>Loading...</div>;
```

### ⚠️ "Multiple Firebase initializations"
**Cause**: Multiple imports of `auth` from different files
- **Solution**: Firebase initialization is safe to call multiple times
- It's idempotent (returns same instance)

---

## Styling Issues

### ❌ "Tailwind classes not applying"
**Cause**: Tailwind classes not being compiled
- **Solution**: Ensure `tailwind.config.ts` includes all template paths:
```typescript
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',     // ✅ Must include app folder
    './components/**/*.{js,ts,jsx,tsx}' // ✅ Must include components
  ],
} as Config
```

### ❌ "Custom CSS classes not working"
- **Cause**: CSS not imported
- **Solution**: Verify globals.css is imported in root layout

---

## Getting Help

### Where to Check Errors
1. **Browser Console**: F12 → Console tab
2. **Vercel Logs**: `vercel logs --follow`
3. **Local Terminal**: Watch npm run dev output
4. **Firebase Console**: Check logs under Diagnostics

### Useful Commands
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Test Firebase connection
node -e "import('./lib/firebase.ts')"

# Clear cache and rebuild
rm -rf .next && npm run build
```

---

## Quick Fixes Checklist

- [ ] Firebase credentials added to `/lib/firebase.ts`
- [ ] Firebase Email/Password auth enabled
- [ ] Firebase Google auth enabled  
- [ ] Header.tsx has `"use client"` at top
- [ ] Login page exists at `/app/(store)/login/page.tsx`
- [ ] Build succeeds: `npm run build`
- [ ] Local test works: `npm run dev`
- [ ] Environment variables set in Vercel
- [ ] Google OAuth URIs configured in Firebase
- [ ] No duplicate routes in app folder

---

## Still Not Working?

Check these files in order:

1. **Firebase initialization**:
   ```bash
   cat lib/firebase.ts | grep -A 5 "firebaseConfig ="
   ```

2. **Header client component**:
   ```bash
   head -1 components/Header.tsx | grep '"use client"'
   ```

3. **Login page exists**:
   ```bash
   test -f app/\(store\)/login/page.tsx && echo "✅ File exists"
   ```

4. **Build succeeds**:
   ```bash
   npm run build && echo "✅ Build OK"
   ```

5. **Check import paths**:
   ```bash
   grep -r "@/lib/firebase" app/ components/
   ```

---

**Everything should work now! Let me know if you hit any issues.** 🚀
