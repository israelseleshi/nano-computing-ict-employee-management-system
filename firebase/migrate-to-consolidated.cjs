const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Migration to Consolidated Core Collections (Proposition 1)
 * Target: 8 Collections from 17 (-53% reduction)
 */

// Helper function to safely get collection data
async function getCollectionData(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.log(`   ⚠️ Collection ${collectionName} not found or empty`);
    return [];
  }
}

// 1. Migrate Users (Consolidate: users + employees + employeeProfiles)
async function migrateUsers() {
  console.log('\n📦 MIGRATING USERS COLLECTION...');
  
  const users = await getCollectionData('users');
  const employees = await getCollectionData('employees');
  const employeeProfiles = await getCollectionData('employeeProfiles');
  const employeeLeaveBalances = await getCollectionData('employeeLeaveBalances');
  const leaveBalances = await getCollectionData('leaveBalances');
  
  const batch = db.batch();
  let count = 0;
  
  // Process each user
  for (const user of users) {
    // Find related employee data
    const employee = employees.find(e => 
      e.userId === user.id || e.email === user.email
    ) || {};
    
    // Find related profile
    const profile = employeeProfiles.find(p => 
      p.userId === user.id || p.employeeId === user.id || p.email === user.email
    ) || {};
    
    // Find leave balance
    const empLeaveBalance = employeeLeaveBalances.find(b => 
      b.employeeId === user.id || b.userId === user.id
    );
    const leaveBalance = leaveBalances.find(b => 
      b.employeeId === user.id || b.userId === user.id
    ) || empLeaveBalance;
    
    // Create consolidated user document
    const consolidatedUser = {
      // Core user data
      id: user.id,
      email: user.email || employee.email || profile.email,
      role: user.role || employee.role || 'employee',
      createdAt: user.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      
      // Profile data
      profile: {
        fullName: user.fullName || profile.fullName || employee.name || user.name || '',
        department: profile.department || employee.department || user.department || '',
        position: profile.position || employee.position || user.position || '',
        hourlyRate: profile.hourlyRate || employee.hourlyRate || user.hourlyRate || 0,
        hireDate: profile.hireDate || employee.hireDate || user.hireDate || new Date().toISOString(),
        phone: profile.phone || employee.phone || user.phone || '',
        address: profile.address || employee.address || '',
        skills: profile.skills || employee.skills || [],
        emergencyContact: profile.emergencyContact || employee.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        avatar: profile.avatar || user.avatar || '',
        bio: profile.bio || '',
        status: profile.status || employee.status || 'active'
      },
      
      // Leave balance data
      leaveBalance: leaveBalance ? {
        year: leaveBalance.year || new Date().getFullYear(),
        vacation: {
          total: leaveBalance.vacationTotal || leaveBalance.vacation?.total || 22,
          used: leaveBalance.vacationUsed || leaveBalance.vacation?.used || 0,
          available: leaveBalance.vacationAvailable || leaveBalance.vacation?.available || 22
        },
        sick: {
          total: leaveBalance.sickTotal || leaveBalance.sick?.total || 10,
          used: leaveBalance.sickUsed || leaveBalance.sick?.used || 0,
          available: leaveBalance.sickAvailable || leaveBalance.sick?.available || 10
        },
        personal: {
          total: leaveBalance.personalTotal || leaveBalance.personal?.total || 5,
          used: leaveBalance.personalUsed || leaveBalance.personal?.used || 0,
          available: leaveBalance.personalAvailable || leaveBalance.personal?.available || 5
        }
      } : {
        year: new Date().getFullYear(),
        vacation: { total: 22, used: 0, available: 22 },
        sick: { total: 10, used: 0, available: 10 },
        personal: { total: 5, used: 0, available: 5 }
      }
    };
    
    // Add to batch
    const docRef = db.collection('users').doc(user.id);
    batch.set(docRef, consolidatedUser);
    count++;
  }
  
  // Process employees without user accounts
  for (const employee of employees) {
    const hasUser = users.some(u => 
      u.id === employee.userId || u.email === employee.email
    );
    
    if (!hasUser && employee.id) {
      const profile = employeeProfiles.find(p => 
        p.employeeId === employee.id || p.email === employee.email
      ) || {};
      
      const leaveBalance = employeeLeaveBalances.find(b => 
        b.employeeId === employee.id
      ) || leaveBalances.find(b => 
        b.employeeId === employee.id
      );
      
      const consolidatedUser = {
        id: employee.id,
        email: employee.email || `${employee.id}@company.com`,
        role: employee.role || 'employee',
        createdAt: employee.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        
        profile: {
          fullName: employee.name || profile.fullName || '',
          department: employee.department || profile.department || '',
          position: employee.position || profile.position || '',
          hourlyRate: employee.hourlyRate || profile.hourlyRate || 0,
          hireDate: employee.hireDate || profile.hireDate || new Date().toISOString(),
          phone: employee.phone || profile.phone || '',
          address: employee.address || profile.address || '',
          skills: employee.skills || profile.skills || [],
          emergencyContact: employee.emergencyContact || profile.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          },
          avatar: employee.avatar || profile.avatar || '',
          bio: profile.bio || '',
          status: employee.status || 'active'
        },
        
        leaveBalance: leaveBalance ? {
          year: leaveBalance.year || new Date().getFullYear(),
          vacation: {
            total: leaveBalance.vacationTotal || 22,
            used: leaveBalance.vacationUsed || 0,
            available: leaveBalance.vacationAvailable || 22
          },
          sick: {
            total: leaveBalance.sickTotal || 10,
            used: leaveBalance.sickUsed || 0,
            available: leaveBalance.sickAvailable || 10
          },
          personal: {
            total: leaveBalance.personalTotal || 5,
            used: leaveBalance.personalUsed || 0,
            available: leaveBalance.personalAvailable || 5
          }
        } : {
          year: new Date().getFullYear(),
          vacation: { total: 22, used: 0, available: 22 },
          sick: { total: 10, used: 0, available: 10 },
          personal: { total: 5, used: 0, available: 5 }
        }
      };
      
      const docRef = db.collection('users').doc(employee.id);
      batch.set(docRef, consolidatedUser);
      count++;
    }
  }
  
  await batch.commit();
  console.log(`   ✅ Migrated ${count} users`);
  return count;
}

// 2. Migrate Leave Requests (Consolidate: leaveRequests + managerLeaveRequests)
async function migrateLeaveRequests() {
  console.log('\n📦 MIGRATING LEAVE REQUESTS...');
  
  const leaveRequests = await getCollectionData('leaveRequests');
  const managerLeaveRequests = await getCollectionData('managerLeaveRequests');
  
  const batch = db.batch();
  let count = 0;
  
  // Process all leave requests
  const allRequests = [...leaveRequests, ...managerLeaveRequests];
  const processedIds = new Set();
  
  for (const request of allRequests) {
    // Skip duplicates
    if (processedIds.has(request.id)) continue;
    processedIds.add(request.id);
    
    const consolidatedRequest = {
      id: request.id,
      employeeId: request.employeeId || request.userId || '',
      employeeName: request.employeeName || '',
      type: request.type || request.leaveType || 'vacation',
      status: request.status || 'pending',
      dates: {
        start: request.startDate || request.dates?.start || '',
        end: request.endDate || request.dates?.end || ''
      },
      days: request.days || request.totalDays || 1,
      metadata: {
        reason: request.reason || request.description || '',
        managerComment: request.managerComment || request.managerNotes || '',
        submittedAt: request.submittedAt || request.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        reviewedAt: request.reviewedAt || null,
        reviewedBy: request.reviewedBy || request.managerId || null
      }
    };
    
    const docRef = db.collection('leaveRequests').doc(request.id);
    batch.set(docRef, consolidatedRequest);
    count++;
    
    // Batch commit every 400 documents (Firestore limit is 500)
    if (count % 400 === 0) {
      await batch.commit();
      console.log(`   ⏳ Committed ${count} documents...`);
    }
  }
  
  await batch.commit();
  console.log(`   ✅ Migrated ${count} leave requests`);
  return count;
}

// 3. Migrate Settings (Consolidate: settings + leaveSettings + departments)
async function migrateSettings() {
  console.log('\n📦 MIGRATING SETTINGS...');
  
  const settings = await getCollectionData('settings');
  const leaveSettings = await getCollectionData('leaveSettings');
  const departments = await getCollectionData('departments');
  
  // Create consolidated settings document
  const consolidatedSettings = {
    id: 'global-settings',
    
    // General settings
    general: settings[0] || {
      companyName: 'Nano Computing ICT Solutions',
      timezone: 'Africa/Addis_Ababa',
      currency: 'ETB',
      dateFormat: 'DD/MM/YYYY',
      workingHours: {
        start: '09:00',
        end: '18:00'
      },
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    
    // Leave settings
    leave: leaveSettings[0] || {
      vacationDays: 22,
      sickDays: 10,
      personalDays: 5,
      carryOverLimit: 5,
      advanceNotice: 7,
      maxConsecutiveDays: 15,
      blackoutDates: [],
      approvalLevels: 1
    },
    
    // Departments
    departments: departments.map(dept => ({
      id: dept.id,
      name: dept.name || dept.departmentName || '',
      managerId: dept.managerId || dept.manager || '',
      budget: dept.budget || 0,
      headcount: dept.headcount || dept.employeeCount || 0,
      description: dept.description || '',
      createdAt: dept.createdAt || new Date().toISOString()
    })),
    
    // System settings
    system: {
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      sessionTimeout: 3600000, // 1 hour in milliseconds
      maxLoginAttempts: 5
    },
    
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  // Save consolidated settings
  await db.collection('settings').doc('global-settings').set(consolidatedSettings);
  
  console.log(`   ✅ Migrated settings with ${departments.length} departments`);
  return 1;
}

// 4. Keep existing collections as-is
async function verifyExistingCollections() {
  console.log('\n📦 VERIFYING EXISTING COLLECTIONS...');
  
  const collectionsToKeep = [
    'workTickets',
    'timeEntries',
    'payrollEntries',
    'notifications',
    'goals'
  ];
  
  for (const collection of collectionsToKeep) {
    const snapshot = await db.collection(collection).limit(1).get();
    if (!snapshot.empty) {
      const count = (await db.collection(collection).get()).size;
      console.log(`   ✅ ${collection}: ${count} documents (keeping as-is)`);
    } else {
      console.log(`   ⚠️ ${collection}: empty or not found`);
    }
  }
}

// 5. Clean up old collections (optional - run separately after verification)
async function cleanupOldCollections() {
  console.log('\n🗑️ CLEANUP OLD COLLECTIONS...');
  console.log('   ⚠️ This will delete old collections. Make sure you have backed up!');
  
  const collectionsToDelete = [
    'employees',
    'employeeProfiles',
    'employeeLeaveBalances',
    'leaveBalances',
    'managerLeaveRequests',
    'leaveSettings',
    'departments',
    'profileChangeLogs',
    'reports' // If not needed
  ];
  
  console.log('   Collections to delete:', collectionsToDelete.join(', '));
  console.log('   Run cleanup-old-collections.js separately after verification');
}

// Main migration function
async function runMigration() {
  console.log('=' * 60);
  console.log('🚀 STARTING MIGRATION TO CONSOLIDATED COLLECTIONS');
  console.log('   Target: 8 Collections (from 17)');
  console.log('=' * 60);
  
  try {
    // Run migrations
    const userCount = await migrateUsers();
    const leaveCount = await migrateLeaveRequests();
    const settingsCount = await migrateSettings();
    await verifyExistingCollections();
    
    console.log('\n' + '=' * 60);
    console.log('✅ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=' * 60);
    console.log('\n📊 Migration Summary:');
    console.log(`   • Users migrated: ${userCount}`);
    console.log(`   • Leave requests migrated: ${leaveCount}`);
    console.log(`   • Settings consolidated: ${settingsCount}`);
    console.log('\n📋 New Collection Structure (8 collections):');
    console.log('   1. users (consolidated)');
    console.log('   2. leaveRequests (consolidated)');
    console.log('   3. workTickets');
    console.log('   4. timeEntries');
    console.log('   5. payrollEntries');
    console.log('   6. notifications');
    console.log('   7. goals');
    console.log('   8. settings (consolidated)');
    
    await cleanupOldCollections();
    
    console.log('\n⚠️ IMPORTANT NEXT STEPS:');
    console.log('   1. Update firebaseData.ts with new structure');
    console.log('   2. Update security rules');
    console.log('   3. Test all application features');
    console.log('   4. Run cleanup-old-collections.js after verification');
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    console.error('   Please restore from backup and investigate the issue');
    process.exit(1);
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n✅ Migration process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
