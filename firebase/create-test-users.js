import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./firebase/serviceAccountKey.json', 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function createTestUsers() {
  console.log('🚀 Creating test users...\n');

  const testUsers = [
    {
      email: 'manager@nanocomputing.com',
      password: 'demo123',
      displayName: 'Manager Admin',
      role: 'manager',
      department: 'Management'
    },
    {
      email: 'john@nanocomputing.com',
      password: 'demo123',
      displayName: 'John Doe',
      role: 'employee',
      department: 'Development'
    }
  ];

  for (const userData of testUsers) {
    try {
      // Check if user already exists
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`✅ User ${userData.email} already exists`);
      } catch (error) {
        // User doesn't exist, create it
        userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true
        });
        console.log(`✅ Created auth user: ${userData.email}`);
      }

      // Create or update Firestore profile
      const userDoc = {
        id: userRecord.uid,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: userData.displayName,
          department: userData.department,
          position: userData.role === 'manager' ? 'Manager' : 'Employee',
          hourlyRate: userData.role === 'manager' ? 0 : 1500,
          hireDate: new Date().toISOString(),
          phone: '',
          address: '',
          skills: [],
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          },
          avatar: '',
          bio: '',
          status: 'active'
        },
        leaveBalance: {
          year: new Date().getFullYear(),
          vacation: { total: 22, used: 0, available: 22 },
          sick: { total: 10, used: 0, available: 10 },
          personal: { total: 5, used: 0, available: 5 }
        }
      };

      await db.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });
      console.log(`✅ Created/Updated Firestore profile for: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${userData.role}\n`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }

  console.log('\n✨ Test users ready! You can now login with:');
  console.log('   Manager: manager@nanocomputing.com / demo123');
  console.log('   Employee: john@nanocomputing.com / demo123');
  
  process.exit(0);
}

createTestUsers().catch(console.error);
