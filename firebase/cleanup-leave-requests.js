import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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

async function cleanupLeaveRequests() {
  console.log('🧹 Starting leave requests cleanup...\n');

  try {
    // Get all leave requests
    const q = query(collection(db, 'leaveRequests'), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 Found ${querySnapshot.size} leave requests`);
    
    const requests = [];
    const duplicates = [];
    const seen = new Set();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const key = `${data.employeeId}-${data.type}-${data.startDate}-${data.endDate}`;
      
      if (seen.has(key)) {
        duplicates.push({ id: doc.id, data });
        console.log(`🔍 Found duplicate: ${data.employeeName} - ${data.type} (${data.startDate} to ${data.endDate})`);
      } else {
        seen.add(key);
        requests.push({ id: doc.id, data });
      }
    });
    
    console.log(`\n📈 Statistics:`);
    console.log(`   Unique requests: ${requests.length}`);
    console.log(`   Duplicate requests: ${duplicates.length}`);
    
    // Remove duplicates
    if (duplicates.length > 0) {
      console.log(`\n🗑️  Removing ${duplicates.length} duplicate leave requests...`);
      
      for (const duplicate of duplicates) {
        await deleteDoc(doc(db, 'leaveRequests', duplicate.id));
        console.log(`   ✅ Removed duplicate: ${duplicate.data.employeeName} - ${duplicate.data.type}`);
      }
      
      console.log(`\n✅ Successfully removed ${duplicates.length} duplicate leave requests`);
    } else {
      console.log(`\n✅ No duplicates found - database is clean!`);
    }
    
    // Show remaining requests summary
    console.log(`\n📋 Remaining leave requests summary:`);
    const statusCounts = {};
    const typeCounts = {};
    
    requests.forEach(({ data }) => {
      statusCounts[data.status] = (statusCounts[data.status] || 0) + 1;
      typeCounts[data.type] = (typeCounts[data.type] || 0) + 1;
    });
    
    console.log(`   By Status:`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });
    
    console.log(`   By Type:`);
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`     ${type}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run cleanup
cleanupLeaveRequests().then(() => {
  console.log('\n🎉 Leave requests cleanup completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Cleanup failed:', error);
  process.exit(1);
});
