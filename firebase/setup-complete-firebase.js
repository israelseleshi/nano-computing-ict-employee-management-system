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

// Sample data
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
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      address: 'Addis Ababa, Ethiopia',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+251911234568',
        relationship: 'Spouse'
      },
      avatar: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'emp-002',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@nanocomputing.com',
      department: 'Design',
      hourlyRate: 120,
      position: 'UI/UX Designer',
      phone: '+251911234569',
      hireDate: '2024-02-01',
      status: 'active',
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'User Research'],
      address: 'Addis Ababa, Ethiopia',
      emergencyContact: {
        name: 'Mike Wilson',
        phone: '+251911234570',
        relationship: 'Brother'
      },
      avatar: null,
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
      budget: 500000,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'dept-002',
      name: 'Design',
      description: 'UI/UX design and creative services',
      manager: 'Manager Admin',
      employeeCount: 3,
      budget: 300000,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'dept-003',
      name: 'Marketing',
      description: 'Digital marketing and communications',
      manager: 'Manager Admin',
      employeeCount: 2,
      budget: 200000,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // New collections for employee features
  leaveRequests: [
    {
      id: 'leave-001',
      employeeId: 'emp-001',
      employeeName: 'John Doe',
      type: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 5,
      reason: 'Family vacation',
      status: 'approved',
      managerComment: 'Approved. Enjoy your vacation!',
      submittedAt: '2024-01-20T10:00:00Z',
      approvedAt: '2024-01-21T14:30:00Z',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  performanceMetrics: [
    {
      id: 'perf-001',
      employeeId: 'emp-001',
      period: '2024-01',
      hoursWorked: 160,
      tasksCompleted: 25,
      qualityScore: 85,
      punctualityScore: 90,
      collaborationScore: 88,
      overallRating: 87,
      goals: ['goal-001', 'goal-002'],
      achievements: ['ach-001'],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  messages: [
    {
      id: 'msg-001',
      senderId: 'emp-001',
      receiverId: 'emp-002',
      content: 'Hi Sarah, can you review the new design mockups?',
      timestamp: '2024-01-15T14:30:00Z',
      read: false,
      type: 'text',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  courses: [
    {
      id: 'course-001',
      title: 'Advanced React Development',
      description: 'Learn advanced React patterns and best practices',
      category: 'Development',
      duration: 40,
      difficulty: 'intermediate',
      prerequisites: ['Basic React', 'JavaScript ES6'],
      modules: [
        {
          id: 'mod-001',
          title: 'React Hooks Deep Dive',
          duration: 8,
          content: 'Advanced hooks usage and custom hooks'
        },
        {
          id: 'mod-002',
          title: 'State Management',
          duration: 12,
          content: 'Redux, Context API, and Zustand'
        }
      ],
      certification: true,
      instructor: 'Senior Developer',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  learningProgress: [
    {
      id: 'progress-001',
      employeeId: 'emp-001',
      courseId: 'course-001',
      progress: 65,
      completedModules: ['mod-001'],
      startDate: '2024-01-10T00:00:00Z',
      score: 85,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  expenses: [
    {
      id: 'exp-001',
      employeeId: 'emp-001',
      category: 'software',
      amount: 99.99,
      currency: 'USD',
      date: '2024-01-15',
      description: 'Adobe Creative Suite subscription',
      receipt: 'receipt-url-001',
      status: 'approved',
      submittedAt: '2024-01-15T10:00:00Z',
      approvedAt: '2024-01-16T09:30:00Z',
      managerComment: 'Approved for design work',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  documents: [
    {
      id: 'doc-001',
      name: 'Employee Handbook 2024.pdf',
      type: 'pdf',
      category: 'policy',
      size: 2048576,
      uploadedBy: 'manager-001',
      uploadedAt: '2024-01-01T00:00:00Z',
      lastModified: '2024-01-01T00:00:00Z',
      url: 'documents/handbook-2024.pdf',
      tags: ['handbook', 'policy', '2024'],
      shared: true,
      sharedWith: ['all'],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  teamMembers: [
    {
      id: 'team-001',
      employeeId: 'emp-001',
      name: 'John Doe',
      role: 'Senior Developer',
      department: 'Development',
      email: 'john.doe@nanocomputing.com',
      phone: '+251911234567',
      avatar: null,
      status: 'online',
      lastSeen: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  achievements: [
    {
      id: 'ach-001',
      employeeId: 'emp-001',
      title: 'Code Quality Champion',
      description: 'Maintained 95%+ code quality score for 3 months',
      category: 'quality',
      points: 100,
      badge: 'quality-champion.svg',
      earnedAt: '2024-01-15T00:00:00Z',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],

  // Enhanced existing collections
  reports: [
    {
      id: 'report-001',
      type: 'daily',
      date: '2024-01-15',
      generatedBy: 'manager-001',
      totalEmployees: 2,
      totalHours: 16.5,
      totalAmount: 2400,
      status: 'completed',
      data: {
        departmentBreakdown: {
          'Development': { hours: 8.5, amount: 1275 },
          'Design': { hours: 8, amount: 960 }
        }
      },
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
      leavePolicy: {
        annualLeave: 22,
        sickLeave: 10,
        personalLeave: 5,
        emergencyLeave: 3
      },
      performanceSettings: {
        reviewPeriod: 'quarterly',
        goalWeights: {
          quality: 0.3,
          punctuality: 0.2,
          collaboration: 0.2,
          productivity: 0.3
        }
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

// Enhanced Firestore Security Rules
const enhancedFirestoreRules = `
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

    // Users collection
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Employees collection
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow write: if isManager() || isOwner(employeeId);
    }
    
    // Departments collection
    match /departments/{deptId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Work tickets
    match /workTickets/{ticketId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    // Time entries
    match /timeEntries/{entryId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    // Payroll entries - managers only
    match /payrollEntries/{payrollId} {
      allow read, write: if isManager();
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        (isManager() || request.auth.uid in resource.data.recipients);
      allow write: if isManager();
    }
    
    // Goals
    match /goals/{goalId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    // Leave requests
    match /leaveRequests/{leaveId} {
      allow read: if isAuthenticated();
      allow create: if isEmployee() && request.auth.uid == request.resource.data.employeeId;
      allow update: if isManager() || isOwner(resource.data.employeeId);
    }
    
    // Performance metrics
    match /performanceMetrics/{perfId} {
      allow read: if isManagerOrOwner(resource.data.employeeId);
      allow write: if isManager();
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.senderId;
      allow update: if isAuthenticated() && request.auth.uid == resource.data.receiverId;
    }
    
    // Courses - all can read, managers can write
    match /courses/{courseId} {
      allow read: if isAuthenticated();
      allow write: if isManager();
    }
    
    // Learning progress
    match /learningProgress/{progressId} {
      allow read: if isManagerOrOwner(resource.data.employeeId);
      allow write: if isManagerOrOwner(resource.data.employeeId);
    }
    
    // Expenses
    match /expenses/{expenseId} {
      allow read: if isManagerOrOwner(resource.data.employeeId);
      allow create: if isEmployee() && request.auth.uid == request.resource.data.employeeId;
      allow update: if isManager() || 
        (isOwner(resource.data.employeeId) && resource.data.status == 'draft');
    }
    
    // Documents
    match /documents/{docId} {
      allow read: if isAuthenticated() && 
        (resource.data.shared == true || 
         resource.data.uploadedBy == request.auth.uid ||
         request.auth.uid in resource.data.sharedWith ||
         isManager());
      allow write: if isAuthenticated() && 
        (resource.data.uploadedBy == request.auth.uid || isManager());
    }
    
    // Team members
    match /teamMembers/{memberId} {
      allow read: if isAuthenticated();
      allow write: if isManager() || request.auth.uid == resource.data.employeeId;
    }
    
    // Achievements
    match /achievements/{achievementId} {
      allow read: if isManagerOrOwner(resource.data.employeeId);
      allow write: if isManager();
    }
    
    // Reports - managers only
    match /reports/{reportId} {
      allow read, write: if isManager();
    }
    
    // Settings - managers only
    match /settings/{settingId} {
      allow read, write: if isManager();
    }
  }
}
`;

// Firestore indexes configuration
const firestoreIndexes = {
  indexes: [
    {
      collectionGroup: 'workTickets',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'date', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'workTickets',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'timeEntries',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'date', order: 'DESCENDING' }
      ]
    },
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
      collectionGroup: 'messages',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'receiverId', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'messages',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'senderId', order: 'ASCENDING' },
        { fieldPath: 'timestamp', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'expenses',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'submittedAt', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'performanceMetrics',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'period', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'learningProgress',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'employeeId', order: 'ASCENDING' },
        { fieldPath: 'progress', order: 'DESCENDING' }
      ]
    },
    {
      collectionGroup: 'notifications',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'recipients', arrayConfig: 'CONTAINS' },
        { fieldPath: 'timestamp', order: 'DESCENDING' }
      ]
    }
  ]
};

async function setupCompleteFirebase() {
  console.log('🚀 Starting Complete Firebase Setup...\n');

  try {
    // Check existing collections
    const collections = await db.listCollections();
    const existingCollections = collections.map(col => col.id);
    
    console.log('📋 Existing collections:', existingCollections.join(', '));
    console.log('');

    // Create all collections with enhanced data
    for (const [collectionName, documents] of Object.entries(completeData)) {
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
    const rulesPath = path.join(__dirname, 'firestore.rules');
    fs.writeFileSync(rulesPath, enhancedFirestoreRules);
    console.log('📜 Enhanced Firestore rules written to firestore.rules');

    // Write Firestore indexes configuration
    const indexesPath = path.join(__dirname, 'firestore.indexes.json');
    fs.writeFileSync(indexesPath, JSON.stringify(firestoreIndexes, null, 2));
    console.log('📊 Firestore indexes configuration written to firestore.indexes.json');

    console.log('');
    console.log('🎉 Complete Firebase setup finished successfully!');
    console.log('');
    console.log('📋 Collections Created/Updated:');
    Object.keys(completeData).forEach(collection => {
      console.log(`   ✅ ${collection} (${completeData[collection].length} documents)`);
    });
    
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Deploy Firestore rules: firebase deploy --only firestore:rules');
    console.log('2. Deploy Firestore indexes: firebase deploy --only firestore:indexes');
    console.log('3. Set up Authentication with custom claims');
    console.log('4. Test all features in your application');
    
    console.log('');
    console.log('🔐 Security Features:');
    console.log('- Enhanced role-based access control');
    console.log('- Employee data ownership protection');
    console.log('- Manager administrative privileges');
    console.log('- Secure document sharing controls');
    console.log('- Message privacy protection');

    console.log('');
    console.log('📊 Performance Features:');
    console.log('- Optimized indexes for common queries');
    console.log('- Efficient data retrieval patterns');
    console.log('- Scalable collection structure');

  } catch (error) {
    console.error('❌ Error setting up Firebase:', error);
  } finally {
    admin.app().delete();
  }
}

// Run the complete setup
setupCompleteFirebase();
