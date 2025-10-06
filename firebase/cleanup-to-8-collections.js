import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Firebase configuration from environment variables
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupTo8Collections() {
  console.log('🧹 Cleaning up to maintain ONLY 8 core collections...\n');

  // Collections to DELETE (not part of the 8 core)
  const collectionsToDelete = [
    'achievements',
    'courses', 
    'documents',
    'expenses',
    'learningProgress',
    'messages',
    'performanceMetrics',
    'teamMembers',
    'departments', // Now part of settings
    'employees', // Now part of users
    'reports',
    'dates' // Extra collection shown in screenshot
  ];

  // The 8 collections we KEEP:
  console.log('✅ Keeping these 8 core collections:');
  console.log('   1. users (consolidated with profiles & leave balances)');
  console.log('   2. leaveRequests (consolidated)');
  console.log('   3. settings (consolidated with departments)');
  console.log('   4. workTickets');
  console.log('   5. timeEntries');
  console.log('   6. payrollEntries');
  console.log('   7. notifications');
  console.log('   8. goals\n');

  console.log('🗑️ Deleting extra collections...\n');

  for (const collectionName of collectionsToDelete) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`⏭️  Collection '${collectionName}' is empty or doesn't exist`);
        continue;
      }

      // Delete all documents in the collection
      let count = 0;
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
        count++;
      }
      
      console.log(`✅ Deleted ${count} documents from '${collectionName}'`);
    } catch (error) {
      console.log(`⚠️  Could not access '${collectionName}': ${error.message}`);
    }
  }

  console.log('\n✨ Cleanup complete! You now have ONLY the 8 core collections.');
  console.log('\n📝 Note: Empty collections will disappear from Firebase Console automatically.');
  
  process.exit(0);
}

cleanupTo8Collections().catch(console.error);
