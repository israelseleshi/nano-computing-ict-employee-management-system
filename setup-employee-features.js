#!/usr/bin/env node

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync('./nanocomputingict-867d1-firebase-adminsdk-fbsvc-0b2f80ea57.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'nanocomputingict-867d1'
});

const db = admin.firestore();

// Sample data for new employee features
const employeeFeaturesData = {
  // Enhanced employee profiles
  employeeProfiles: [
    {
      id: 'profile-001',
      employeeId: 'emp-001',
      personalInfo: {
        name: 'John Doe',
        email: 'john.doe@nanocomputing.com',
        phone: '+251911234567',
        address: 'Bole, Addis Ababa, Ethiopia',
        dateOfBirth: '1990-05-15',
        nationality: 'Ethiopian'
      },
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+251911234568',
        relationship: 'Spouse',
        address: 'Bole, Addis Ababa, Ethiopia'
      },
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          issueDate: '2023-06-15',
          expiryDate: '2026-06-15',
          credentialId: 'AWS-DEV-2023-001'
        }
      ],
      preferences: {
        notifications: true,
        language: 'en',
        theme: 'light',
        timezone: 'Africa/Addis_Ababa'
      },
      avatar: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'profile-002',
      employeeId: 'emp-002',
      personalInfo: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@nanocomputing.com',
        phone: '+251911234569',
        address: 'Kazanchis, Addis Ababa, Ethiopia',
        dateOfBirth: '1992-08-22',
        nationality: 'Ethiopian'
      },
      emergencyContact: {
        name: 'Mike Wilson',
        phone: '+251911234570',
        relationship: 'Brother',
        address: 'Kazanchis, Addis Ababa, Ethiopia'
      },
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'User Research', 'Prototyping'],
      certifications: [
        {
          name: 'Google UX Design Certificate',
          issuer: 'Google',
          issueDate: '2023-03-10',
          expiryDate: null,
          credentialId: 'GOOGLE-UX-2023-002'
        }
      ],
      preferences: {
        notifications: true,
        language: 'en',
        theme: 'light',
        timezone: 'Africa/Addis_Ababa'
      },
      avatar: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Leave requests and balances
  leaveRequests: [
    {
      id: 'leave-001',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      type: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 6,
      reason: 'Family vacation to Bahir Dar',
      status: 'approved',
      managerComment: 'Approved. Enjoy your vacation!',
      submittedAt: '2024-01-20T10:00:00Z',
      approvedAt: '2024-01-21T14:30:00Z',
      managerId: 'manager-001',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'leave-002',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      type: 'sick',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      days: 3,
      reason: 'Flu symptoms and recovery',
      status: 'approved',
      managerComment: 'Get well soon. Take care of your health.',
      submittedAt: '2024-01-09T08:00:00Z',
      approvedAt: '2024-01-09T09:15:00Z',
      managerId: 'manager-001',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'leave-003',
      employeeId: 'emp-002',
      employeeName: 'Sarah Wilson',
      type: 'personal',
      startDate: '2024-03-01',
      endDate: '2024-03-01',
      days: 1,
      reason: 'Personal appointment',
      status: 'pending',
      submittedAt: '2024-02-25T16:00:00Z',
      managerId: 'manager-001',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Leave balances for employees
  leaveBalances: [
    {
      id: 'balance-001',
      employeeId: 'emp-001',
      year: 2024,
      vacation: {
        total: 22,
        used: 6,
        available: 16,
        pending: 0
      },
      sick: {
        total: 10,
        used: 3,
        available: 7,
        pending: 0
      },
      personal: {
        total: 5,
        used: 0,
        available: 5,
        pending: 0
      },
      emergency: {
        total: 3,
        used: 0,
        available: 3,
        pending: 0
      },
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'balance-002',
      employeeId: 'emp-002',
      year: 2024,
      vacation: {
        total: 22,
        used: 0,
        available: 22,
        pending: 0
      },
      sick: {
        total: 10,
        used: 0,
        available: 10,
        pending: 0
      },
      personal: {
        total: 5,
        used: 0,
        available: 4,
        pending: 1
      },
      emergency: {
        total: 3,
        used: 0,
        available: 3,
        pending: 0
      },
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Profile change logs for audit trail
  profileChangeLogs: [
    {
      id: 'log-001',
      employeeId: 'emp-001',
      changedBy: 'emp-001',
      changeType: 'profile_update',
      field: 'skills',
      oldValue: ['JavaScript', 'React', 'Node.js'],
      newValue: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      reason: 'Added new skills acquired through training'
    },
    {
      id: 'log-002',
      employeeId: 'emp-002',
      changedBy: 'emp-002',
      changeType: 'emergency_contact_update',
      field: 'emergencyContact.phone',
      oldValue: '+251911234571',
      newValue: '+251911234570',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      reason: 'Updated emergency contact phone number'
    }
  ]
};

// Enhanced Firestore Security Rules for new features
const enhancedRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isManager() {
      return isAuthenticated() && request.auth.token.role == 'manager';
    }
    
    function isEmployee() {
      return isAuthenticated() && request.auth.token.role == 'employee';
    }
    
    function isOwner(employeeId) {
      return isAuthenticated() && request.auth.uid == employeeId;
    }
    
    function isManagerOrOwner(employeeId) {
      return isManager() || isOwner(employeeId);
    }

    // Existing collections (keeping previous rules)
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow write: if isManager() || isOwner(employeeId);
    }
    
    match /departments/{deptId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    match /workTickets/{ticketId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    match /timeEntries/{entryId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    match /payrollEntries/{payrollId} {
      allow read, write: if isManager();
    }
    
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid in resource.data.recipients);
      allow write: if isManager();
    }
    
    match /goals/{goalId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    match /reports/{reportId} {
      allow read, write: if isManager();
    }
    
    match /settings/{settingId} {
      allow read, write: if isManager();
    }

    // NEW RULES FOR EMPLOYEE FEATURES
    
    // Employee profiles - employees can read/write their own, managers can read all
    match /employeeProfiles/{profileId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
      allow write: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
    }
    
    // Leave requests - employees can create their own, managers can approve/reject
    match /leaveRequests/{leaveId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
      allow create: if isEmployee() && request.auth.uid == request.resource.data.employeeId;
      allow update: if isManager() || 
        (isOwner(resource.data.employeeId) && resource.data.status == 'pending');
    }
    
    // Leave balances - employees can read their own, managers can read/write all
    match /leaveBalances/{balanceId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
      allow write: if isManager();
    }
    
    // Profile change logs - audit trail, employees can read their own, managers can read all
    match /profileChangeLogs/{logId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.changedBy;
    }
  }
}
`;

// Firestore indexes for new collections
const newIndexes = {
  indexes: [
    // Employee profiles indexes
    {
      collectionGroup: 'employeeProfiles',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'updatedAt', order: 'DESCENDING' }
      ]
    },
    
    // Leave requests indexes
    {
      collectionGroup: 'leaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'leaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'type', order: 'ASCENDING' },
        { fieldPath: 'startDate', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'leaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'managerId', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    
    // Leave balances indexes
    {
      collectionGroup: 'leaveBalances',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'year', order: 'DESCENDING' }
      ]
    },
    
    // Profile change logs indexes
    {
      collectionGroup: 'profileChangeLogs',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'profileChangeLogs',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'changeType', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' }
      ]
    }
  ]
};

async function setupEmployeeFeatures() {
  console.log('🚀 Setting up Employee Profile & Leave Management Features...\n');

  try {
    // Check existing collections
    const collections = await db.listCollections();
    const existingCollections = collections.map(col => col.id);
    
    console.log('📋 Existing collections:', existingCollections.join(', '));
    console.log('');

    // Create new collections for employee features
    for (const [collectionName, documents] of Object.entries(employeeFeaturesData)) {
      console.log(`📝 Setting up collection: ${collectionName}`);
      
      for (const doc of documents) {
        const docRef = db.collection(collectionName).doc(doc.id);
        
        // Check if document exists
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
          console.log(`   ⏭️  Document ${doc.id} already exists, skipping...`);
        } else {
          await docRef.set(doc);
          console.log(`   ✅ Added document: ${doc.id}`);
        }
      }
      console.log('');
    }

    // Write enhanced Firestore rules
    const rulesPath = path.join(__dirname, 'firestore-employee-features.rules');
    fs.writeFileSync(rulesPath, enhancedRules);
    console.log('📜 Enhanced Firestore rules written to firestore-employee-features.rules');

    // Write new indexes configuration
    const indexesPath = path.join(__dirname, 'firestore-employee-features.indexes.json');
    fs.writeFileSync(indexesPath, JSON.stringify(newIndexes, null, 2));
    console.log('📊 New indexes configuration written to firestore-employee-features.indexes.json');

    console.log('');
    console.log('🎉 Employee Features setup completed successfully!');
    console.log('');
    console.log('📋 New Collections Created:');
    Object.keys(employeeFeaturesData).forEach(collection => {
      console.log(`   ✅ ${collection} (${employeeFeaturesData[collection].length} documents)`);
    });
    
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Deploy enhanced rules: firebase deploy --only firestore:rules');
    console.log('2. Deploy new indexes: firebase deploy --only firestore:indexes');
    console.log('3. Update your React components to use the new collections');
    console.log('4. Test the Profile Management and Leave Management features');
    
    console.log('');
    console.log('🔐 New Security Features:');
    console.log('- Employee profile data protection');
    console.log('- Leave request approval workflow');
    console.log('- Profile change audit logging');
    console.log('- Manager approval permissions');

    console.log('');
    console.log('📊 New Performance Features:');
    console.log('- Optimized queries for employee profiles');
    console.log('- Efficient leave request filtering');
    console.log('- Fast leave balance lookups');
    console.log('- Audit trail indexing');

  } catch (error) {
    console.error('❌ Error setting up employee features:', error);
  } finally {
    admin.app().delete();
  }
}

// Run the employee features setup
setupEmployeeFeatures();
