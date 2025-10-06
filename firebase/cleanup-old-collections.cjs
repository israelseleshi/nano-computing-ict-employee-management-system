const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function deleteCollection(collectionName) {
  const collectionRef = db.collection(collectionName);
  const batchSize = 100;
  
  try {
    const snapshot = await collectionRef.limit(batchSize).get();
    
    if (snapshot.empty) {
      console.log(`   ⚠️ Collection ${collectionName} is already empty`);
      return 0;
    }
    
    let totalDeleted = 0;
    
    while (true) {
      const snapshot = await collectionRef.limit(batchSize).get();
      
      if (snapshot.empty) {
        break;
      }
      
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      totalDeleted += snapshot.size;
      
      console.log(`   🗑️ Deleted ${totalDeleted} documents from ${collectionName}...`);
    }
    
    console.log(`   ✅ Successfully deleted ${totalDeleted} documents from ${collectionName}`);
    return totalDeleted;
  } catch (error) {
    console.error(`   ❌ Error deleting ${collectionName}:`, error.message);
    return 0;
  }
}

async function cleanupOldCollections() {
  console.log('=' * 60);
  console.log('🗑️ CLEANUP OLD COLLECTIONS AFTER MIGRATION');
  console.log('=' * 60);
  console.log('\n⚠️ WARNING: This will permanently delete the following collections:');
  
  const collectionsToDelete = [
    'employees',
    'employeeProfiles',
    'employeeLeaveBalances',
    'leaveBalances',
    'managerLeaveRequests',
    'leaveSettings',
    'departments',
    'profileChangeLogs',
    'reports'
  ];
  
  console.log('\nCollections to be deleted:');
  collectionsToDelete.forEach((col, index) => {
    console.log(`   ${index + 1}. ${col}`);
  });
  
  console.log('\n⚠️ MAKE SURE YOU HAVE:');
  console.log('   1. Backed up all data');
  console.log('   2. Successfully run the migration');
  console.log('   3. Verified the new collections are working');
  
  const answer = await askQuestion('\nDo you want to proceed with deletion? (type "DELETE" to confirm): ');
  
  if (answer !== 'DELETE') {
    console.log('\n❌ Cleanup cancelled. No collections were deleted.');
    rl.close();
    process.exit(0);
  }
  
  console.log('\n🔄 Starting cleanup...\n');
  
  let totalDeleted = 0;
  
  for (const collection of collectionsToDelete) {
    console.log(`\n📦 Processing ${collection}...`);
    const deleted = await deleteCollection(collection);
    totalDeleted += deleted;
  }
  
  console.log('\n' + '=' * 60);
  console.log('✅ CLEANUP COMPLETED!');
  console.log('=' * 60);
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   • Collections deleted: ${collectionsToDelete.length}`);
  console.log(`   • Total documents deleted: ${totalDeleted}`);
  console.log('\n✨ Your Firestore now has 8 optimized collections!');
  
  rl.close();
}

// Run cleanup
cleanupOldCollections()
  .then(() => {
    console.log('\n✅ Cleanup process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    rl.close();
    process.exit(1);
  });
