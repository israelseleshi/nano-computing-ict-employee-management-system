# Firebase Setup Commands

## Prerequisites
Make sure you have Firebase CLI installed and are logged in:
```bash
npm install -g firebase-tools
firebase login
```

## 1. Initialize Firebase Project (if not done)
```bash
firebase init
# Select:
# - Firestore: Configure security rules and indexes files
# - Choose existing project: nanocomputingict-867d1
# - Accept default firestore.rules
# - Accept default firestore.indexes.json
```

## 2. Install Dependencies
```bash
npm install firebase-admin
```

## 3. Run Complete Firebase Setup
```bash
# Using npm script
npm run setup-complete-firebase

# Or directly
node setup-complete-firebase.js
```

## 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## 5. Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

## 6. Verify Setup
```bash
# Check Firestore rules
firebase firestore:rules get

# List Firestore indexes
firebase firestore:indexes

# Test security rules (optional)
firebase emulators:start --only firestore
```

## 7. Set Up Authentication Custom Claims
Create a script to set user roles:

```javascript
// set-user-roles.js
import admin from 'firebase-admin';

// Set manager role
await admin.auth().setCustomUserClaims('manager-uid', { role: 'manager' });

// Set employee role  
await admin.auth().setCustomUserClaims('employee-uid', { role: 'employee' });
```

## 8. Monitor and Maintain
```bash
# View Firestore usage
firebase firestore:usage

# Monitor security rules
firebase firestore:rules list

# Update indexes when needed
firebase deploy --only firestore:indexes
```

## Collections Created

### Core Collections:
- **employees** - Employee profiles and details
- **departments** - Company departments
- **workTickets** - Work tickets and time tracking
- **timeEntries** - Clock in/out records
- **payrollEntries** - Payroll calculations
- **notifications** - System notifications
- **goals** - Employee goals and objectives
- **users** - User authentication data
- **reports** - Generated reports
- **settings** - Application settings

### New Employee Features:
- **leaveRequests** - Leave and vacation requests
- **performanceMetrics** - Employee performance data
- **messages** - Internal messaging system
- **courses** - Training courses catalog
- **learningProgress** - Course progress tracking
- **expenses** - Expense submissions and approvals
- **documents** - Document management system
- **teamMembers** - Team directory and status
- **achievements** - Employee achievements and badges

## Indexes Created

### Performance Optimized Queries:
- **workTickets**: employeeId + date (DESC)
- **workTickets**: status + createdAt (DESC)
- **timeEntries**: employeeId + date (DESC)
- **leaveRequests**: employeeId + status + submittedAt (DESC)
- **messages**: receiverId + timestamp (DESC)
- **messages**: senderId + timestamp (DESC)
- **expenses**: employeeId + status + submittedAt (DESC)
- **performanceMetrics**: employeeId + period (DESC)
- **learningProgress**: employeeId + progress (DESC)
- **notifications**: recipients (ARRAY_CONTAINS) + timestamp (DESC)

## Security Rules Features

### Role-Based Access:
- **Managers**: Full access to all collections
- **Employees**: Limited access to own data only
- **Data Ownership**: Users can only access their own records
- **Secure Messaging**: Private message access only
- **Document Sharing**: Controlled document access
- **Leave Approval**: Manager approval workflow

### Helper Functions:
- `isAuthenticated()` - Check if user is logged in
- `isManager()` - Check if user has manager role
- `isEmployee()` - Check if user has employee role
- `isOwner(employeeId)` - Check if user owns the data
- `isManagerOrOwner(employeeId)` - Combined permission check

## Troubleshooting

### Common Issues:

1. **Permission Denied**
   ```bash
   # Make sure you're logged in
   firebase login
   
   # Check project selection
   firebase use --add
   ```

2. **Index Creation Failed**
   ```bash
   # Indexes take time to build
   firebase firestore:indexes
   
   # Check index status in Firebase Console
   ```

3. **Rules Deployment Failed**
   ```bash
   # Validate rules syntax
   firebase firestore:rules validate
   
   # Check rules in Firebase Console
   ```

4. **Service Account Issues**
   ```bash
   # Ensure service account key is present
   ls firebase-service-account-key.json
   
   # Check permissions in Firebase Console
   ```

## Testing Commands

### Local Testing:
```bash
# Start Firestore emulator
firebase emulators:start --only firestore

# Test with your app pointing to emulator
# Add to your app config:
# connectFirestoreEmulator(db, 'localhost', 8080);
```

### Production Testing:
```bash
# Test authentication
firebase auth:test

# Test Firestore rules
firebase firestore:rules test
```

## Monitoring Commands

### Usage Monitoring:
```bash
# Check Firestore usage
firebase firestore:usage

# Monitor costs
firebase projects:billing

# View logs
firebase functions:log
```

### Performance Monitoring:
```bash
# Check index performance
firebase firestore:indexes

# Monitor query performance in Firebase Console
# Performance tab > Firestore
```

## Backup Commands

### Data Backup:
```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backup-folder

# Import Firestore data
gcloud firestore import gs://your-bucket/backup-folder
```

### Rules Backup:
```bash
# Save current rules
firebase firestore:rules get > firestore-backup.rules

# Restore rules
firebase deploy --only firestore:rules
```

## Update Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "setup-complete-firebase": "node setup-complete-firebase.js",
    "deploy-rules": "firebase deploy --only firestore:rules",
    "deploy-indexes": "firebase deploy --only firestore:indexes",
    "deploy-firestore": "firebase deploy --only firestore",
    "test-rules": "firebase firestore:rules validate",
    "emulator": "firebase emulators:start --only firestore"
  }
}
```

## Success Verification

After running all commands, verify:

1. ✅ All collections exist in Firebase Console
2. ✅ Security rules are deployed and active
3. ✅ Indexes are built and optimized
4. ✅ Authentication is configured with custom claims
5. ✅ Your React app can connect and perform operations
6. ✅ Role-based access control works correctly

Your Firebase backend is now fully configured for the Employee Management System! 🚀
