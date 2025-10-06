import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./firebase/serviceAccountKey.json', 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupExtraCollections() {
  console.log('🧹 Cleaning up extra collections to maintain 8 core collections...\n');

  // Collections to delete (not part of the 8 core collections)
  const collectionsToDelete = [
    'achievements',
    'courses',
    'documents',
    'expenses',
    'learningProgress',
    'messages',
    'performanceMetrics',
    'teamMembers',
    'departments', // This is now part of settings
    'employees', // This is now part of users
    'reports'
  ];

  for (const collectionName of collectionsToDelete) {
    try {
      const collection = db.collection(collectionName);
      const snapshot = await collection.get();
      
      if (snapshot.empty) {
        console.log(`⏭️  Collection ${collectionName} is already empty`);
        continue;
      }

      // Delete all documents in the collection
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Deleted ${snapshot.size} documents from ${collectionName}`);
    } catch (error) {
      console.log(`⚠️  Collection ${collectionName} might not exist or error: ${error.message}`);
    }
  }

  console.log('\n✨ Cleanup complete! You now have only the 8 core collections:');
  console.log('   1. users (consolidated)');
  console.log('   2. leaveRequests (consolidated)');
  console.log('   3. settings (consolidated)');
  console.log('   4. workTickets');
  console.log('   5. timeEntries');
  console.log('   6. payrollEntries');
  console.log('   7. notifications');
  console.log('   8. goals');
  
  process.exit(0);
}

cleanupExtraCollections().catch(console.error);
