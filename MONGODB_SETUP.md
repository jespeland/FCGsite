# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for your FCG admin system.

## **Step 1: MongoDB Atlas Setup**

### 1.1 Create Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Try Free" or "Get Started Free"
3. Sign up with Google, GitHub, or email

### 1.2 Create Cluster
1. Choose **AWS** as cloud provider
2. Select region closest to you
3. Choose **M0 Sandbox** (FREE tier)
4. Click "Create"
5. Wait 2-3 minutes for cluster creation

### 1.3 Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `fcg-admin`
4. Password: Create a strong password (save this!)
5. Role: "Read and write to any database"
6. Click "Add User"

### 1.4 Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go back to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

## **Step 2: Update Your Connection String**

### 2.1 Replace Placeholder
In the connection string you copied, replace:
- `<password>` with your actual password
- The result should look like:
```
mongodb+srv://fcg-admin:YourActualPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 2.2 Add to Vercel Environment Variables
1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Settings" tab
4. Click "Environment Variables"
5. Add new variable:
   - **Name:** `MONGODB_URI`
   - **Value:** Your connection string (with password)
   - **Environment:** Production, Preview, Development
6. Click "Save"

## **Step 3: Test Your Setup**

### 3.1 Deploy Changes
1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add MongoDB Atlas integration"
   git push
   ```

2. Wait for Vercel to redeploy

### 3.2 Test the API
1. Visit your test endpoint: `https://your-url.vercel.app/api/test`
2. You should see a JSON response with your deals

### 3.3 Test Admin Page
1. Go to your admin page: `https://your-url.vercel.app/admin.html`
2. Login with admin/password
3. Try adding a new deal
4. Check if it appears in the list

## **Step 4: Migrate Existing Data**

If you have existing deals in `deals.json`, you can migrate them:

### 4.1 Create Migration Script
Create a file called `migrate.js`:
```javascript
const { MongoClient } = require('mongodb');
const fs = require('fs');

const MONGODB_URI = 'your-connection-string-here';
const DATABASE_NAME = 'fcg-website';
const COLLECTION_NAME = 'deals';

async function migrateData() {
    try {
        // Read existing deals
        const dealsData = fs.readFileSync('deals.json', 'utf-8');
        const deals = JSON.parse(dealsData);
        
        // Connect to MongoDB
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Insert deals
        if (deals.length > 0) {
            await collection.insertMany(deals);
            console.log(`Migrated ${deals.length} deals successfully`);
        }
        
        await client.close();
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateData();
```

### 4.2 Run Migration
```bash
node migrate.js
```

## **Important Notes**

### Security
- Never commit your MongoDB password to Git
- Always use environment variables for sensitive data
- The connection string in the code is just a placeholder

### Database Structure
- Database name: `fcg-website`
- Collection name: `deals`
- Each deal document has: id, title, value, industry, date, duration, description, image

### Troubleshooting
- If you get connection errors, check your network access settings
- If authentication fails, verify your username and password
- Check Vercel function logs for detailed error messages

## **You're Done!**

Your admin system now uses MongoDB Atlas for persistent data storage. Deals will be saved permanently and accessible from anywhere! 