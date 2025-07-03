# MongoDB Atlas Debugging Checklist

## 🔍 **Step 1: Verify Database Access**

1. **Go to MongoDB Atlas Dashboard**
2. **Click "Database Access" in left sidebar**
3. **Look for your user - should see:**
   - Username: `fcg-admin`
   - Authentication Method: `Password`
   - Database User Privileges: `Read and write to any database`

4. **If user doesn't exist or is wrong:**
   - Click "Add New Database User"
   - Username: `fcg-admin`
   - Password: Create a new password (write it down!)
   - Role: "Read and write to any database"
   - Click "Add User"

## 🔍 **Step 2: Verify Network Access**

1. **Go to "Network Access" in left sidebar**
2. **You should see an entry like:**
   - IP Address: `0.0.0.0/0`
   - Description: `Allow access from anywhere`

3. **If not there:**
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

## 🔍 **Step 3: Get Fresh Connection String**

1. **Go to "Database" in left sidebar**
2. **Click "Connect" on your cluster**
3. **Choose "Connect your application"**
4. **Copy the connection string**
5. **Replace `<password>` with your actual password**

## 🔍 **Step 4: Test Connection String Format**

Your connection string should look like this:
```
mongodb+srv://fcg-admin:YourActualPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Common issues:**
- Make sure there are no spaces around the password
- Make sure you replaced `<password>` (not `<password>`)
- If password has special characters, they might need encoding

## 🔍 **Step 5: Test with Simple Password**

If still having issues, try this:
1. **Go to Database Access**
2. **Edit the fcg-admin user**
3. **Set password to something simple like: `FCGadmin123!`**
4. **Get new connection string**
5. **Update in Vercel**

## 🔍 **Step 6: Verify Vercel Environment Variable**

1. **Go to Vercel Dashboard**
2. **Your project → Settings → Environment Variables**
3. **Find MONGODB_URI**
4. **Click "Edit"**
5. **Make sure the value is exactly your connection string**
6. **Click "Save"**

## 🔍 **Step 7: Check Vercel Deployment**

1. **Go to Vercel Dashboard**
2. **Your project → Deployments**
3. **Click on latest deployment**
4. **Check "Functions" tab**
5. **Look for any errors in the logs**

## 🔍 **Step 8: Test with Local Connection**

If you want to test locally:
1. **Install MongoDB Compass (free GUI tool)**
2. **Use your connection string to connect**
3. **If it works in Compass, the issue is with Vercel**
4. **If it doesn't work in Compass, the issue is with MongoDB setup** 