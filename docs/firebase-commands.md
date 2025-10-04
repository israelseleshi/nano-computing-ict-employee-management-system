# 🔥 Firebase CLI Setup and Database Creation Commands

## Complete Terminal Commands to Set Up Firebase Database

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser and ask you to sign in with your Google account that has access to the "nanocomputingict-867d1" project.

### Step 3: Navigate to Your Project Directory

```bash
cd "c:\Users\babi\Documents\websites\nano-computing-ict-employee-management-system"
```

### Step 4: Initialize Firebase in Your Project

```bash
firebase init firestore
```

When prompted, select:
- **Use an existing project**: `nanocomputingict-867d1`
- **Firestore Rules file**: Press Enter (use default `firestore.rules`)
- **Firestore indexes file**: Press Enter (use default `firestore.indexes.json`)

### Step 5: Deploy Security Rules and Indexes

```bash
firebase deploy --only firestore
```

This deploys both the security rules and database indexes.

### Step 6: Enable Authentication in Firebase Console

Open your browser and go to:
```
https://console.firebase.google.com/project/nanocomputingict-867d1/authentication/providers
```

1. Click **"Get started"** if this is your first time
2. Go to **"Sign-in method"** tab
3. Click **"Email/Password"**
4. **Enable** the first option (Email/Password)
5. Click **"Save"**

### Step 7: Create Firestore Database

Go to:
```
https://console.firebase.google.com/project/nanocomputingict-867d1/firestore
```

1. Click **"Create database"**
2. Select **"Start in test mode"**
3. Choose your location (select closest to Ethiopia, like `europe-west1`)
4. Click **"Done"**

### Step 8: Deploy Temporary Open Rules for Initialization

First, deploy temporary rules that allow initialization without authentication:

```bash
# Copy the temporary rules
copy firestore-temp.rules firestore.rules

# Deploy temporary rules
firebase deploy --only firestore:rules
```

### Step 9: Initialize Sample Data

**Option A: Browser-based Initialization (Recommended)**

1. Open the initialization page:
```bash
# Open in your default browser
start init-database.html
```

2. Click "Initialize Database" button
3. Wait for completion

**Option B: Command Line (if you prefer)**
```bash
node firebase-init-data.js
```

### Step 10: Deploy Secure Rules

After initialization, restore secure rules:

```bash
# Restore the secure rules (they're saved in the file)
firebase deploy --only firestore
```

## 🎯 What Each Command Does

### `firebase login`
- Authenticates your CLI with your Google account
- Gives access to your Firebase projects

### `firebase init firestore`
- Creates `firestore.rules` and `firestore.indexes.json` files
- Links your local project to the Firebase project

### `firebase deploy --only firestore`
- Uploads security rules to protect your data
- Creates database indexes for fast queries

### `node firebase-init-data.js`
- Creates all required collections
- Adds sample data for testing
- Sets up demo users and work tickets

## 📋 Collections That Will Be Created

1. **users** - Employee and manager profiles
2. **workTickets** - Time tracking and task records
3. **goals** - Personal goal setting and tracking
4. **notifications** - Real-time alerts and messages

## 🔐 After Setup Complete

Your database will have demo accounts:
- **Manager**: manager@nanocomputing.com
- **Employee**: john@nanocomputing.com

You'll need to create these users in Firebase Authentication before they can log in.

## ✅ Verification Commands

Check if everything is working:

```bash
# Check Firebase project status
firebase projects:list

# Check Firestore rules deployment
firebase firestore:rules:get

# View your project in browser
firebase open
```

## 🚨 Important Notes

1. **Run commands in order** - each step depends on the previous one
2. **Use the exact project ID**: `nanocomputingict-867d1`
3. **Enable Authentication** before testing login
4. **Create Firestore Database** before running the init script

## 🎉 Success Indicators

You'll know setup is complete when:
- ✅ Firebase CLI is authenticated
- ✅ Firestore rules are deployed
- ✅ Database collections are created
- ✅ Sample data is populated
- ✅ Authentication is enabled

**Ready to activate Firebase in your app!**
