const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Backup all collections to JSON files
 */
async function backupCollections() {
  console.log('🔄 Starting backup of all collections...\n');
  
  const collections = [
    'departments',
    'employeeLeaveBalances',
    'employeeProfiles',
    'employees',
    'goals',
    'leaveBalances',
    'leaveRequests',
    'leaveSettings',
    'managerLeaveRequests',
    'notifications',
    'payrollEntries',
    'profileChangeLogs',
    'reports',
    'settings',
    'timeEntries',
    'users',
    'workTickets'
  ];
  
  const backupDir = path.join(__dirname, 'backups', new Date().toISOString().split('T')[0]);
  
  try {
    // Create backup directory
    await fs.mkdir(backupDir, { recursive: true });
    console.log(`📁 Created backup directory: ${backupDir}\n`);
    
    const backupSummary = {
      timestamp: new Date().toISOString(),
      collections: {},
      totalDocuments: 0
    };
    
    for (const collectionName of collections) {
      try {
        console.log(`📥 Backing up collection: ${collectionName}`);
        
        const snapshot = await db.collection(collectionName).get();
        const documents = [];
        
        snapshot.forEach(doc => {
          documents.push({
            id: doc.id,
            data: doc.data()
          });
        });
        
        if (documents.length > 0) {
          // Save to JSON file
          const filePath = path.join(backupDir, `${collectionName}.json`);
          await fs.writeFile(filePath, JSON.stringify(documents, null, 2));
          
          backupSummary.collections[collectionName] = documents.length;
          backupSummary.totalDocuments += documents.length;
          
          console.log(`   ✅ Backed up ${documents.length} documents\n`);
        } else {
          console.log(`   ⚠️ No documents found\n`);
          backupSummary.collections[collectionName] = 0;
        }
      } catch (error) {
        console.error(`   ❌ Error backing up ${collectionName}:`, error.message, '\n');
      }
    }
    
    // Save backup summary
    const summaryPath = path.join(backupDir, 'backup-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(backupSummary, null, 2));
    
    console.log('=' * 50);
    console.log('✅ BACKUP COMPLETED SUCCESSFULLY!');
    console.log(`📊 Total documents backed up: ${backupSummary.totalDocuments}`);
    console.log(`📁 Backup location: ${backupDir}`);
    console.log('=' * 50);
    
    return backupDir;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

// Run backup
backupCollections()
  .then(() => {
    console.log('\n✅ Backup process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
