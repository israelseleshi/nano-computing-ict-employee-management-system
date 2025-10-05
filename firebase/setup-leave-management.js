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
const serviceAccount = JSON.parse(fs.readFileSync('./firebase/firebase-service-account-key.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'nanocomputingict-867d1'
});

const db = admin.firestore();

// Leave management sample data
const leaveManagementData = {
  // Manager leave requests for approval
  managerLeaveRequests: [
    {
      id: 'leave-mgr-001',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      employeeDepartment: 'Development',
      employeePosition: 'Senior Developer',
      employeeEmail: 'john.doe@nanocomputing.com',
      type: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 6,
      reason: 'Family vacation to Bahir Dar with extended family. Planning to visit historical sites and spend quality time together.',
      status: 'pending',
      priority: 'normal',
      submittedAt: '2024-01-20T10:00:00Z',
      managerId: 'manager-001',
      attachments: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'leave-mgr-002',
      employeeId: 'emp-002',
      employeeName: 'Sarah Wilson',
      employeeDepartment: 'Design',
      employeePosition: 'UI/UX Designer',
      employeeEmail: 'sarah.wilson@nanocomputing.com',
      type: 'sick',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      days: 3,
      reason: 'Flu symptoms and recovery. Doctor recommended rest for full recovery.',
      status: 'approved',
      priority: 'high',
      managerComment: 'Get well soon. Take care of your health. Approved for full recovery.',
      submittedAt: '2024-01-09T08:00:00Z',
      approvedAt: '2024-01-09T09:15:00Z',
      managerId: 'manager-001',
      attachments: ['medical-certificate-001.pdf'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'leave-mgr-003',
      employeeId: 'emp-003',
      employeeName: 'Michael Chen',
      employeeDepartment: 'Development',
      employeePosition: 'Full Stack Developer',
      employeeEmail: 'michael.chen@nanocomputing.com',
      type: 'personal',
      startDate: '2024-03-01',
      endDate: '2024-03-01',
      days: 1,
      reason: 'Personal appointment - visa application at embassy',
      status: 'pending',
      priority: 'normal',
      submittedAt: '2024-02-25T16:00:00Z',
      managerId: 'manager-001',
      attachments: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'leave-mgr-004',
      employeeId: 'emp-004',
      employeeName: 'Almaz Tadesse',
      employeeDepartment: 'Marketing',
      employeePosition: 'Digital Marketing Specialist',
      employeeEmail: 'almaz.tadesse@nanocomputing.com',
      type: 'emergency',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      days: 2,
      reason: 'Family emergency - urgent medical situation requiring immediate attention',
      status: 'approved',
      priority: 'urgent',
      managerComment: 'Approved immediately. Take care of your family. Let us know if you need additional time.',
      submittedAt: '2024-01-25T07:30:00Z',
      approvedAt: '2024-01-25T07:45:00Z',
      managerId: 'manager-001',
      attachments: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'leave-mgr-005',
      employeeId: 'emp-005',
      employeeName: 'Daniel Bekele',
      employeeDepartment: 'QA Testing',
      employeePosition: 'Senior QA Engineer',
      employeeEmail: 'daniel.bekele@nanocomputing.com',
      type: 'vacation',
      startDate: '2024-04-10',
      endDate: '2024-04-15',
      days: 6,
      reason: 'Annual vacation - visiting family in Gondar and exploring northern Ethiopia',
      status: 'rejected',
      priority: 'normal',
      managerComment: 'Unfortunately, this conflicts with our major product release. Please consider rescheduling to late April or early May.',
      submittedAt: '2024-03-15T14:20:00Z',
      rejectedAt: '2024-03-16T10:30:00Z',
      managerId: 'manager-001',
      attachments: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Leave balance tracking for employees
  employeeLeaveBalances: [
    {
      id: 'balance-001',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      year: 2024,
      vacation: {
        total: 22,
        used: 0,
        pending: 6,
        available: 16,
        carryOver: 2
      },
      sick: {
        total: 10,
        used: 0,
        pending: 0,
        available: 10,
        carryOver: 0
      },
      personal: {
        total: 5,
        used: 0,
        pending: 0,
        available: 5,
        carryOver: 0
      },
      emergency: {
        total: 3,
        used: 0,
        pending: 0,
        available: 3,
        carryOver: 0
      },
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'balance-002',
      employeeId: 'emp-002',
      employeeName: 'Sarah Wilson',
      year: 2024,
      vacation: {
        total: 22,
        used: 0,
        pending: 0,
        available: 22,
        carryOver: 0
      },
      sick: {
        total: 10,
        used: 3,
        pending: 0,
        available: 7,
        carryOver: 0
      },
      personal: {
        total: 5,
        used: 0,
        pending: 0,
        available: 5,
        carryOver: 0
      },
      emergency: {
        total: 3,
        used: 0,
        pending: 0,
        available: 3,
        carryOver: 0
      },
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Leave policies and settings
  leaveSettings: [
    {
      id: 'leave-policy-2024',
      year: 2024,
      policies: {
        vacation: {
          annualAllowance: 22,
          maxCarryOver: 5,
          maxConsecutiveDays: 15,
          advanceNoticeRequired: 14,
          blackoutPeriods: ['2024-12-20/2024-12-31', '2024-07-01/2024-07-15']
        },
        sick: {
          annualAllowance: 10,
          maxCarryOver: 0,
          maxConsecutiveDays: 30,
          advanceNoticeRequired: 0,
          medicalCertificateRequired: 3
        },
        personal: {
          annualAllowance: 5,
          maxCarryOver: 0,
          maxConsecutiveDays: 3,
          advanceNoticeRequired: 7
        },
        emergency: {
          annualAllowance: 3,
          maxCarryOver: 0,
          maxConsecutiveDays: 5,
          advanceNoticeRequired: 0
        }
      },
      approvalWorkflow: {
        autoApprovalLimit: 0,
        requireManagerApproval: true,
        requireHRApproval: false,
        escalationDays: 3
      },
      notifications: {
        employeeOnSubmission: true,
        managerOnSubmission: true,
        employeeOnDecision: true,
        reminderDays: [1, 3, 7]
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

// Enhanced Firestore Security Rules for Leave Management
const leaveManagementRules = `
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

    // Manager leave requests - for manager dashboard
    match /managerLeaveRequests/{requestId} {
      allow read: if isManager();
      allow create: if isEmployee() && request.auth.uid == request.resource.data.employeeId;
      allow update: if isManager() || 
        (isOwner(resource.data.employeeId) && resource.data.status == 'pending');
    }
    
    // Employee leave balances - managers can read all, employees can read own
    match /employeeLeaveBalances/{balanceId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
      allow write: if isManager();
    }
    
    // Leave settings - managers only
    match /leaveSettings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Leave approval history - audit trail
    match /leaveApprovalHistory/{historyId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid == resource.data.employeeId);
      allow create: if isManager() && request.auth.uid == request.resource.data.managerId;
    }
  }
}
`;

// Firestore indexes for leave management
const leaveManagementIndexes = {
  indexes: [
    // Manager leave requests indexes
    {
      collectionGroup: 'managerLeaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'managerId', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'managerLeaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeDepartment', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'managerLeaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'type', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'managerLeaveRequests',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'priority', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    
    // Employee leave balances indexes
    {
      collectionGroup: 'employeeLeaveBalances',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'year', order: 'DESCENDING' }
      ]
    },
    
    // Leave settings indexes
    {
      collectionGroup: 'leaveSettings',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'year', order: 'DESCENDING' }
      ]
    }
  ]
};

async function setupLeaveManagement() {
  console.log('🚀 Setting up Leave Management System...\n');

  try {
    // Check existing collections
    const collections = await db.listCollections();
    const existingCollections = collections.map(col => col.id);
    
    console.log('📋 Existing collections:', existingCollections.join(', '));
    console.log('');

    // Create leave management collections
    for (const [collectionName, documents] of Object.entries(leaveManagementData)) {
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

    // Write leave management Firestore rules
    const rulesPath = path.join(__dirname, 'firestore-leave-management.rules');
    fs.writeFileSync(rulesPath, leaveManagementRules);
    console.log('📜 Leave management Firestore rules written to firestore-leave-management.rules');

    // Write leave management indexes configuration
    const indexesPath = path.join(__dirname, 'firestore-leave-management.indexes.json');
    fs.writeFileSync(indexesPath, JSON.stringify(leaveManagementIndexes, null, 2));
    console.log('📊 Leave management indexes configuration written to firestore-leave-management.indexes.json');

    console.log('');
    console.log('🎉 Leave Management setup completed successfully!');
    console.log('');
    console.log('📋 Collections Created:');
    Object.keys(leaveManagementData).forEach(collection => {
      console.log(`   ✅ ${collection} (${leaveManagementData[collection].length} documents)`);
    });
    
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Deploy leave management rules: firebase deploy --only firestore:rules');
    console.log('2. Deploy leave management indexes: firebase deploy --only firestore:indexes');
    console.log('3. Test the Manager Leave Management dashboard');
    console.log('4. Configure leave approval notifications');
    
    console.log('');
    console.log('🔐 Leave Management Security Features:');
    console.log('- Manager approval workflow');
    console.log('- Employee data ownership protection');
    console.log('- Leave balance access control');
    console.log('- Audit trail for all leave decisions');

    console.log('');
    console.log('📊 Leave Management Performance Features:');
    console.log('- Optimized queries for manager dashboard');
    console.log('- Efficient leave request filtering');
    console.log('- Fast leave balance lookups');
    console.log('- Department-based leave analytics');

  } catch (error) {
    console.error('❌ Error setting up leave management:', error);
  } finally {
    admin.app().delete();
  }
}

// Run the leave management setup
setupLeaveManagement();
