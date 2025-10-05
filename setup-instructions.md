# Firebase Setup Instructions

## Prerequisites

1. **Firebase CLI installed and logged in**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Service Account Key**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-service-account-key.json` in the project root
   - **IMPORTANT**: Add this file to `.gitignore` for security

## Setup Steps

### 1. Install Dependencies
```bash
npm install firebase-admin
```

### 2. Create Service Account Key File
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`nanocomputingict`)
3. Go to Project Settings (gear icon) → Service Accounts
4. Click "Generate new private key"
5. Save the file as `firebase-service-account-key.json` in your project root

### 3. Update Project ID
Edit `setup-firebase-collections.js` and replace `'nanocomputingict'` with your actual Firebase project ID if different.

### 4. Run the Setup Script
```bash
npm run setup-firebase
```

### 5. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## What the Script Creates

### Collections:
- **employees** - Employee profiles and details
- **departments** - Company departments
- **timeEntries** - Clock in/out records
- **reports** - Generated reports
- **settings** - Application settings

### Security Rules:
- **Role-based access control** (manager/employee)
- **Data ownership protection** (users can only access their own data)
- **Manager privileges** (full access to all collections)
- **Employee restrictions** (limited access based on ownership)

## Security Features

### Authentication Setup
After running the script, you'll need to set up custom claims for user roles:

```javascript
// Set manager role
admin.auth().setCustomUserClaims(uid, { role: 'manager' });

// Set employee role
admin.auth().setCustomUserClaims(uid, { role: 'employee' });
```

### Firestore Rules Summary:
- **Users**: Can only read/write their own data
- **Employees**: Managers can read/write all, employees can read/write their own
- **Work Tickets**: Managers can read/write all, employees can read/write their own
- **Time Entries**: Managers can read/write all, employees can read/write their own
- **Payroll**: Only managers can access
- **Notifications**: Managers can read/write all, employees can read their own
- **Goals**: Managers can read/write all, employees can read/write their own
- **Departments**: All can read, only managers can write
- **Reports**: Only managers can access
- **Settings**: Only managers can access

## Troubleshooting

### Common Issues:

1. **Permission Denied**
   - Make sure your service account key is correct
   - Verify Firebase project ID matches

2. **Module Not Found**
   - Run `npm install firebase-admin`
   - Ensure you're in the correct directory

3. **Rules Deployment Failed**
   - Make sure Firebase CLI is logged in: `firebase login`
   - Initialize Firebase in project: `firebase init firestore`

### Verify Setup:
1. Check Firebase Console → Firestore Database for new collections
2. Check Firebase Console → Firestore Database → Rules for updated rules
3. Test authentication and data access in your app

## Next Steps

1. **Set up Authentication**
   - Enable Email/Password authentication in Firebase Console
   - Set up custom claims for user roles

2. **Update React App**
   - Update Firebase config with your project details
   - Test data operations with proper authentication

3. **Deploy Application**
   - Build and deploy your React app
   - Test all functionality with real Firebase backend

## Security Best Practices

- Never commit `firebase-service-account-key.json` to version control
- Use environment variables for sensitive configuration
- Regularly review and update Firestore rules
- Monitor Firebase usage and security in the console
- Set up proper backup and recovery procedures
