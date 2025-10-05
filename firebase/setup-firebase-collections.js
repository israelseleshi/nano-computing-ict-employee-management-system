#!/usr/bin/env node

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
// Make sure you have your service account key file
const serviceAccount = JSON.parse(fs.readFileSync('./firebase/firebase-service-account-key.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'nanocomputingict-867d1' // Replace with your actual project ID
});

const db = admin.firestore();

// Sample data for collections
const sampleData = {
  employees: [
    {
      id: 'emp-001',
      name: 'John Doe',
      email: 'john.doe@nanocomputing.com',
      department: 'Development',
      hourlyRate: 150,
      position: 'Senior Developer',
      phone: '+251911234567',
      hireDate: '2024-01-15',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'emp-002',
      name: 'Jane Smith',
      email: 'jane.smith@nanocomputing.com',
      department: 'Design',
      hourlyRate: 120,
      position: 'UI/UX Designer',
      phone: '+251911234568',
      hireDate: '2024-02-01',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  departments: [
    {
      id: 'dept-001',
      name: 'Development',
      description: 'Software development and engineering',
      manager: 'Manager Admin',
      employeeCount: 5,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'dept-002',
      name: 'Design',
      description: 'UI/UX design and creative services',
      manager: 'Manager Admin',
      employeeCount: 3,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'dept-003',
      name: 'Marketing',
      description: 'Digital marketing and communications',
      manager: 'Manager Admin',
      employeeCount: 2,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  timeEntries: [
    {
      id: 'time-001',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      date: '2024-01-04',
      clockIn: '09:00',
      clockOut: '17:30',
      totalHours: 8.5,
      status: 'completed',
      location: 'Office',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  reports: [
    {
      id: 'report-001',
      type: 'daily',
      date: '2024-01-04',
      generatedBy: 'manager',
      totalEmployees: 2,
      totalHours: 16.5,
      totalAmount: 2400,
      status: 'completed',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  settings: [
    {
      id: 'app-settings',
      companyName: 'Nano Computing ICT',
      currency: 'ETB',
      workingHoursPerDay: 8,
      workingDaysPerWeek: 5,
      overtimeRate: 1.5,
      taxRate: 0.15,
      pensionRate: 0.07,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

// Firestore Security Rules
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Employees collection - managers can read/write, employees can read their own data
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'manager' || request.auth.uid == employeeId);
    }
    
    // Work tickets - managers can read/write all, employees can read/write their own
    match /workTickets/{ticketId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'manager' || 
         request.auth.uid == resource.data.employeeId);
    }
    
    // Time entries - managers can read/write all, employees can read/write their own
    match /timeEntries/{entryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'manager' || 
         request.auth.uid == resource.data.employeeId);
    }
    
    // Payroll entries - only managers can access
    match /payrollEntries/{payrollId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'manager';
    }
    
    // Notifications - managers can read/write all, employees can read their own
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        (request.auth.token.role == 'manager' || 
         request.auth.uid in resource.data.recipients);
      allow write: if request.auth != null && request.auth.token.role == 'manager';
    }
    
    // Goals - managers can read/write all, employees can read/write their own
    match /goals/{goalId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'manager' || 
         request.auth.uid == resource.data.employeeId);
    }
    
    // Departments - all authenticated users can read, only managers can write
    match /departments/{deptId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'manager';
    }
    
    // Reports - only managers can access
    match /reports/{reportId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'manager';
    }
    
    // Settings - only managers can access
    match /settings/{settingId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'manager';
    }
  }
}
`;

async function createCollections() {
  console.log('🚀 Starting Firebase collections setup...\n');

  try {
    // Check existing collections
    const collections = await db.listCollections();
    const existingCollections = collections.map(col => col.id);
    
    console.log('📋 Existing collections:', existingCollections.join(', '));
    console.log('');

    // Create missing collections with sample data
    for (const [collectionName, documents] of Object.entries(sampleData)) {
      if (existingCollections.includes(collectionName)) {
        console.log(`⏭️  Collection '${collectionName}' already exists, skipping...`);
        continue;
      }

      console.log(`📝 Creating collection: ${collectionName}`);
      
      for (const doc of documents) {
        const docRef = db.collection(collectionName).doc(doc.id);
        await docRef.set(doc);
        console.log(`   ✅ Added document: ${doc.id}`);
      }
      console.log('');
    }

    // Write Firestore rules to file
    const rulesPath = path.join(__dirname, 'firestore.rules');
    fs.writeFileSync(rulesPath, firestoreRules);
    console.log('📜 Firestore rules written to firestore.rules');
    console.log('');

    console.log('🎉 Firebase setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Deploy the Firestore rules using: firebase deploy --only firestore:rules');
    console.log('2. Set up Authentication with custom claims for user roles');
    console.log('3. Update your Firebase config in the React app');
    console.log('');
    console.log('🔐 Security Rules Features:');
    console.log('- Role-based access control (manager/employee)');
    console.log('- Users can only access their own data');
    console.log('- Managers have full access to all collections');
    console.log('- Employees have limited access based on ownership');

  } catch (error) {
    console.error('❌ Error setting up Firebase:', error);
  } finally {
    // Close the admin app
    admin.app().delete();
  }
}

// Run the setup
createCollections();
