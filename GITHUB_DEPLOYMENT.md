# GitHub Deployment Guide for VR Robotics Academy

## Step-by-Step Setup

### 1. **Initialize Git Repository Locally**
Open PowerShell in your project directory and run:
```bash
git init
git add .
git commit -m "Initial commit: VR Robotics Academy Website"
```

### 2. **Create a GitHub Repository**
- Go to [GitHub.com](https://github.com/new)
- Click "New Repository"
- Choose a name (e.g., `vr-robotics-academy`)
- Select "Public" (so anyone can view it)
- Click "Create repository"
- **DO NOT** initialize with README, .gitignore, or license

### 3. **Add Remote and Push Code**
Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPO_NAME` with your repo name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Example:
```bash
git remote add origin https://github.com/john123/vr-robotics-academy.git
git branch -M main
git push -u origin main
```

### 4. **Configure astro.config.mjs**
Open `astro.config.mjs` and update it based on your GitHub Pages setup:

**Option A: Using `username.github.io` repository**
- Create a repo named: `YOUR_USERNAME.github.io`
- Update astro.config.mjs:
```javascript
site: 'https://YOUR_USERNAME.github.io',
// Remove or comment out the 'base' line
```

**Option B: Using a project repository (e.g., `vr-robotics-academy`)**
- Use any repo name you want
- Update astro.config.mjs:
```javascript
site: 'https://YOUR_USERNAME.github.io',
base: '/vr-robotics-academy', // Change to your repo name
```

### 5. **Enable GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This will use our automated workflow

### 6. **Deploy Automatically**
Push your code - GitHub Actions will automatically:
- ✅ Build the website
- ✅ Deploy to GitHub Pages
- ✅ Show build status/errors

Check the "Actions" tab in your repo to see deployment progress.

### 7. **Your Website URL**
After deployment completes, your site will be available at:
- **If using `username.github.io`**: `https://YOUR_USERNAME.github.io`
- **If using project repo**: `https://YOUR_USERNAME.github.io/vr-robotics-academy`

---

## Updated Files

✅ **astro.config.mjs** - Added GitHub Pages configuration
✅ **.github/workflows/deploy.yml** - Automated deployment workflow

## Environment Variables

If you're using Supabase or other services, create a `.env.local` file:
```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_KEY=your_supabase_key
```

Store sensitive keys in GitHub Settings → Secrets → Actions.

---

## Troubleshooting

**Build fails?**
- Check the Actions tab for error logs
- Make sure all dependencies are in package.json
- Run `npm install` locally to verify

**Site not showing up?**
- Wait 1-2 minutes after first deployment
- Check GitHub Pages settings (Source should be "GitHub Actions")
- Check branch name is "main" (not "master")

**Want to update the site?**
Just push your changes:
```bash
git add .
git commit -m "Update: Your changes"
git push
```
Deployment happens automatically!

---

## Support
For more help, see:
- [Astro Deployment Docs](https://docs.astro.build/en/guides/deploy/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
