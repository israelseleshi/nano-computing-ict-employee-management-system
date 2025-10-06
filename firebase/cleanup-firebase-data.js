import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

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

async function cleanupFirebase() {
  console.log('🧹 Starting Firebase cleanup...\n');

  // 1. Delete extra collections (keep only the 8 core)
  const collectionsToDelete = [
    'courses',
    'documents', 
    'expenses',
    'learningProgress',
    'messages',
    'performanceMetrics',
    'teamMembers',
    'departments',
    'employees',
    'reports',
    'dates',
    'leaveSettings',
    'employeeLeaveBalances'
  ];

  console.log('📦 Deleting extra collections...');
  for (const collectionName of collectionsToDelete) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (!snapshot.empty) {
        for (const docSnap of snapshot.docs) {
          await deleteDoc(doc(db, collectionName, docSnap.id));
        }
        console.log(`✅ Deleted ${snapshot.size} documents from '${collectionName}'`);
      } else {
        console.log(`⏭️  Collection '${collectionName}' is empty`);
      }
    } catch (error) {
      console.log(`⚠️  Could not access '${collectionName}': ${error.message}`);
    }
  }

  // 2. Clean up leaveRequests - remove mock data (keep only John Doe's requests)
  console.log('\n📋 Cleaning up leaveRequests collection...');
  try {
    const leaveRequestsRef = collection(db, 'leaveRequests');
    const snapshot = await getDocs(leaveRequestsRef);
    
    let deletedCount = 0;
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      // Delete if it's not John Doe's request (check by email or name)
      if (data.employeeName && !data.employeeName.toLowerCase().includes('john')) {
        await deleteDoc(doc(db, 'leaveRequests', docSnap.id));
        deletedCount++;
        console.log(`  Deleted leave request from: ${data.employeeName}`);
      }
    }
    console.log(`✅ Deleted ${deletedCount} mock leave requests`);
  } catch (error) {
    console.log(`⚠️  Error cleaning leaveRequests: ${error.message}`);
    console.log(`   This is expected - leaveRequests collection is preserved for the app.`);
  }

  console.log('\n✨ Cleanup complete! You now have only the 8 core collections with clean data.');
  console.log('\n📝 The 8 core collections are:');
  console.log('   1. users');
  console.log('   2. leaveRequests');
  console.log('   3. settings');
  console.log('   4. workTickets');
  console.log('   5. timeEntries');
  console.log('   6. payrollEntries');
  console.log('   7. notifications');
  console.log('   8. goals');
  
  process.exit(0);
}

cleanupFirebase().catch(console.error);
