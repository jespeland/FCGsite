# Vercel Deployment Guide

This guide will walk you through deploying your FCG admin system to Vercel so others can access it remotely.

## **Step 1: Prepare Your Project**

Your project is already prepared for Vercel deployment with:
- `vercel.json` configuration file
- `api/deals.js` serverless function
- Updated API URLs in admin.html and closings.html

## **Step 2: Create a GitHub Repository**

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it something like `fcg-website`
   - Make it public or private (your choice)
   - Don't initialize with README (you already have files)

2. **Upload your project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/fcg-website.git
   git push -u origin main
   ```

## **Step 3: Deploy to Vercel**

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account

2. **Import your project:**
   - Click "New Project"
   - Select your `fcg-website` repository
   - Vercel will automatically detect it's a Node.js project

3. **Configure deployment:**
   - **Framework Preset:** Node.js
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** Leave empty (not needed for static sites)
   - **Output Directory:** Leave empty (not needed for static sites)
   - **Install Command:** `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)

## **Step 4: Access Your Deployed Site**

After deployment, Vercel will give you a URL like:
- `https://fcg-website-abc123.vercel.app`

You can also set up a custom domain later if you want.

## **Step 5: Test Your Deployment**

1. **Test the main site:**
   - Visit your Vercel URL
   - Check that all pages load correctly

2. **Test the admin system:**
   - Go to `https://your-url.vercel.app/admin.html`
   - Login with username: `admin`, password: `password`
   - Try adding a new closing
   - Check that it appears on the closings page

## **Step 6: Share Access**

Now anyone can access your admin system by visiting:
- **Main site:** `https://your-url.vercel.app`
- **Admin page:** `https://your-url.vercel.app/admin.html`

## **Important Notes:**

### **File Uploads:**
- Image uploads work but files are stored temporarily
- For permanent file storage, consider using AWS S3 or similar

### **Data Persistence:**
- The `deals.json` file is stored in Vercel's file system
- Data persists between deployments
- For better data management, consider using a database

### **Security:**
- The admin credentials are hardcoded (admin/password)
- For production use, implement proper authentication

## **Updating Your Site:**

1. **Make changes to your local files**
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. **Vercel automatically redeploys** when you push to GitHub

## **Troubleshooting:**

### **If deployment fails:**
- Check the Vercel logs for errors
- Make sure all files are committed to GitHub
- Verify `package.json` has all required dependencies

### **If admin doesn't work:**
- Check browser console for errors
- Verify the API endpoints are working
- Make sure `deals.json` exists in your repository

### **If images don't upload:**
- This is expected - Vercel uses temporary storage
- Consider implementing cloud storage for production

## **You're Done!**

Your FCG admin system is now live and accessible from anywhere in the world! 