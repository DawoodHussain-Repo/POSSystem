# Troubleshooting Guide

## Issue: Tailwind CSS Styles Not Working

### Solution Applied
We switched from Tailwind CSS v4 (beta) to stable v3.4.1 for better compatibility with Next.js 15.

### What Was Changed

1. **Uninstalled Tailwind v4**:
   ```bash
   npm uninstall tailwindcss @tailwindcss/postcss
   ```

2. **Installed Tailwind v3**:
   ```bash
   npm install -D tailwindcss@3.4.1 postcss@8.4.49 autoprefixer@10.4.16
   ```

3. **Updated `globals.css`**:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Created `tailwind.config.js`**:
   ```js
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

5. **Updated `postcss.config.mjs`**:
   ```js
   const config = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   export default config;
   ```

6. **Cleared Next.js cache**:
   ```bash
   rm -rf .next
   ```

7. **Restarted dev server**:
   ```bash
   npm run dev
   ```

---

## Common Issues

### 1. Styles Still Not Loading

**Solution**:
- Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Stop dev server and restart:
  ```bash
  # Stop with Ctrl+C
  npm run dev
  ```

### 2. Hydration Errors

**Cause**: Server-rendered HTML doesn't match client-side React
**Solution**: Already fixed by using stable Tailwind v3

### 3. Build Errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### 4. Port Already in Use

**Error**: `Port 3000 is already in use`
**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

---

## Verification Steps

1. **Check if Tailwind is installed**:
   ```bash
   npm list tailwindcss
   ```
   Should show: `tailwindcss@3.4.1`

2. **Check if files exist**:
   - ✅ `tailwind.config.js`
   - ✅ `postcss.config.mjs`
   - ✅ `app/globals.css` with `@tailwind` directives

3. **Check browser console**:
   - No CSS errors
   - Styles are being applied

4. **Test a component**:
   - Add `className="bg-red-500 p-4"` to any element
   - Should see red background with padding

---

## Fresh Start (Nuclear Option)

If nothing works, start fresh:

```bash
# 1. Delete everything
rm -rf node_modules package-lock.json .next

# 2. Reinstall
npm install

# 3. Clear browser cache completely

# 4. Restart dev server
npm run dev

# 5. Hard refresh browser (Ctrl+Shift+R)
```

---

## Current Configuration

### Package Versions
- Next.js: 15.5.6
- React: 19.0.0
- Tailwind CSS: 3.4.1
- PostCSS: 8.4.49
- Autoprefixer: 10.4.16

### File Structure
```
pos-frontend/
├── app/
│   ├── globals.css          # Tailwind directives
│   ├── layout.tsx           # Imports globals.css
│   └── page.tsx             # Uses Tailwind classes
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.mjs       # PostCSS configuration
└── package.json             # Dependencies
```

---

## Need More Help?

1. Check Next.js logs in terminal
2. Check browser console for errors
3. Verify all files are saved
4. Ensure dev server is running
5. Try incognito/private browsing mode

---

**Last Updated**: November 26, 2025
