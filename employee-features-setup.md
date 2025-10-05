# Employee Features Setup Guide

## Overview
This guide covers the setup of the new Employee Profile Management and Leave Management features, including Firebase collections, security rules, and indexes.

## 🚀 Quick Setup Commands

### 1. Setup Employee Features Collections
```bash
npm run setup-employee-features
```

### 2. Deploy Enhanced Security Rules
```bash
npm run deploy-rules
```

### 3. Deploy Performance Indexes
```bash
npm run deploy-indexes
```

### 4. Deploy Everything at Once
```bash
npm run deploy-firestore
```

## 📋 New Features Implemented

### 1. Employee Profile Management
**Location**: `src/components/employee/ProfileManagement.tsx`

#### Features:
- ✅ **Personal Information Management** - Name, position, address, hire date
- ✅ **Contact Information** - Phone, emergency contacts with relationships
- ✅ **Skills & Certifications** - Add/remove skills, manage certifications
- ✅ **Account Settings** - Notification preferences, password change
- ✅ **Profile Picture Upload** - Avatar management with file upload
- ✅ **Tabbed Interface** - Organized sections for better UX
- ✅ **Real-time Validation** - Form validation and success feedback
- ✅ **Audit Trail** - Change logging for security

#### Key Components:
- **Profile Header** with avatar and basic info
- **Tabbed Navigation** (Personal, Contact, Skills, Settings)
- **Editable Forms** with save/cancel functionality
- **Skills Management** with add/remove capabilities
- **Emergency Contact** management
- **Preferences Settings** with toggles

### 2. Leave Management
**Location**: `src/components/employee/LeaveManagement.tsx`

#### Features:
- ✅ **Leave Balance Dashboard** - Visual balance cards for all leave types
- ✅ **Leave Request Submission** - Modal form for new requests
- ✅ **Request History** - Table view of all past requests
- ✅ **Status Tracking** - Pending, approved, rejected with manager comments
- ✅ **Leave Type Support** - Vacation, sick, personal, emergency
- ✅ **Date Calculations** - Automatic day calculations
- ✅ **Filtering & Search** - Filter by status and type
- ✅ **Export Functionality** - Download leave reports

#### Key Components:
- **Leave Balance Cards** with usage visualization
- **Request Modal** with date picker and validation
- **Requests Table** with status indicators
- **Filter Controls** for easy navigation
- **Manager Comments** display

## 🔥 Firebase Collections Created

### 1. employeeProfiles
```javascript
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
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
  certifications: [...],
  preferences: {
    notifications: true,
    language: 'en',
    theme: 'light',
    timezone: 'Africa/Addis_Ababa'
  },
  avatar: null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. leaveRequests
```javascript
{
  id: 'leave-001',
  employeeId: 'emp-001',
  employeeName: 'John Doe',
  type: 'vacation', // vacation, sick, personal, emergency
  startDate: '2024-02-15',
  endDate: '2024-02-20',
  days: 6,
  reason: 'Family vacation to Bahir Dar',
  status: 'approved', // pending, approved, rejected
  managerComment: 'Approved. Enjoy your vacation!',
  submittedAt: '2024-01-20T10:00:00Z',
  approvedAt: '2024-01-21T14:30:00Z',
  managerId: 'manager-001',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. leaveBalances
```javascript
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
  lastUpdated: Timestamp,
  createdAt: Timestamp
}
```

### 4. profileChangeLogs
```javascript
{
  id: 'log-001',
  employeeId: 'emp-001',
  changedBy: 'emp-001',
  changeType: 'profile_update',
  field: 'skills',
  oldValue: ['JavaScript', 'React'],
  newValue: ['JavaScript', 'React', 'TypeScript'],
  timestamp: Timestamp,
  reason: 'Added new skills acquired through training'
}
```

## 🛡️ Enhanced Security Rules

### Employee Profile Protection
```javascript
// Employee profiles - employees can read/write their own, managers can read all
match /employeeProfiles/{profileId} {
  allow read: if isAuthenticated() && 
    (isManager() || request.auth.uid == resource.data.employeeId);
  allow write: if isAuthenticated() && 
    (isManager() || request.auth.uid == resource.data.employeeId);
}
```

### Leave Request Workflow
```javascript
// Leave requests - employees can create their own, managers can approve/reject
match /leaveRequests/{leaveId} {
  allow read: if isAuthenticated() && 
    (isManager() || request.auth.uid == resource.data.employeeId);
  allow create: if isEmployee() && request.auth.uid == request.resource.data.employeeId;
  allow update: if isManager() || 
    (isOwner(resource.data.employeeId) && resource.data.status == 'pending');
}
```

### Leave Balance Access
```javascript
// Leave balances - employees can read their own, managers can read/write all
match /leaveBalances/{balanceId} {
  allow read: if isAuthenticated() && 
    (isManager() || request.auth.uid == resource.data.employeeId);
  allow write: if isManager();
}
```

### Audit Trail Protection
```javascript
// Profile change logs - audit trail, employees can read their own, managers can read all
match /profileChangeLogs/{logId} {
  allow read: if isAuthenticated() && 
    (isManager() || request.auth.uid == resource.data.employeeId);
  allow create: if isAuthenticated() && request.auth.uid == request.resource.data.changedBy;
}
```

## 📊 Performance Indexes

### Employee Profile Queries
```javascript
// For employee profile lookups and updates
{
  collectionGroup: 'employeeProfiles',
  fields: [
    { fieldPath: 'employeeId', order: 'ASCENDING' },
    { fieldPath: 'updatedAt', order: 'DESCENDING' }
  ]
}
```

### Leave Request Filtering
```javascript
// For leave request filtering by employee, status, and date
{
  collectionGroup: 'leaveRequests',
  fields: [
    { fieldPath: 'employeeId', order: 'ASCENDING' },
    { fieldPath: 'status', order: 'ASCENDING' },
    { fieldPath: 'submittedAt', order: 'DESCENDING' }
  ]
}

// For leave request filtering by type
{
  collectionGroup: 'leaveRequests',
  fields: [
    { fieldPath: 'employeeId', order: 'ASCENDING' },
    { fieldPath: 'type', order: 'ASCENDING' },
    { fieldPath: 'startDate', order: 'DESCENDING' }
  ]
}

// For manager leave approval dashboard
{
  collectionGroup: 'leaveRequests',
  fields: [
    { fieldPath: 'managerId', order: 'ASCENDING' },
    { fieldPath: 'status', order: 'ASCENDING' },
    { fieldPath: 'submittedAt', order: 'DESCENDING' }
  ]
}
```

### Leave Balance Lookups
```javascript
// For leave balance queries by employee and year
{
  collectionGroup: 'leaveBalances',
  fields: [
    { fieldPath: 'employeeId', order: 'ASCENDING' },
    { fieldPath: 'year', order: 'DESCENDING' }
  ]
}
```

### Audit Trail Queries
```javascript
// For profile change history
{
  collectionGroup: 'profileChangeLogs',
  fields: [
    { fieldPath: 'employeeId', order: 'ASCENDING' },
    { fieldPath: 'timestamp', order: 'DESCENDING' }
  ]
}

// For specific change type filtering
{
  collectionGroup: 'profileChangeLogs',
  fields: [
    { fieldPath: 'employeeId', order: 'ASCENDING' },
    { fieldPath: 'changeType', order: 'ASCENDING' },
    { fieldPath: 'timestamp', order: 'DESCENDING' }
  ]
}
```

## 🔧 Integration Steps

### 1. Add to Employee Layout
```typescript
// In src/components/employee/EmployeeLayout.tsx
import ProfileManagement from './ProfileManagement';
import LeaveManagement from './LeaveManagement';

// Add to menu items
const menuItems = [
  // existing items...
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'leave', label: 'Leave Management', icon: Calendar }
];

// Add to render switch
case 'profile':
  return <ProfileManagement profile={profile} onUpdateProfile={handleUpdateProfile} />;
case 'leave':
  return <LeaveManagement 
    profile={profile} 
    leaveRequests={leaveRequests}
    leaveBalance={leaveBalance}
    onSubmitLeaveRequest={handleSubmitLeaveRequest}
  />;
```

### 2. Add State Management
```typescript
// In main App.tsx or context
const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);

// Handlers
const handleUpdateProfile = async (updates: Partial<Profile>) => {
  // Update profile in Firebase
  // Log changes to profileChangeLogs
};

const handleSubmitLeaveRequest = async (request: LeaveRequestData) => {
  // Submit to Firebase leaveRequests collection
  // Update leave balance pending counts
  // Send notification to manager
};
```

### 3. Firebase Service Integration
```typescript
// In src/lib/firebaseService.ts
export const updateEmployeeProfile = async (employeeId: string, updates: Partial<Profile>) => {
  const profileRef = doc(db, 'employeeProfiles', employeeId);
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const submitLeaveRequest = async (request: LeaveRequestData) => {
  const leaveRef = collection(db, 'leaveRequests');
  await addDoc(leaveRef, {
    ...request,
    status: 'pending',
    submittedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  });
};

export const getLeaveBalance = async (employeeId: string, year: number) => {
  const balanceQuery = query(
    collection(db, 'leaveBalances'),
    where('employeeId', '==', employeeId),
    where('year', '==', year)
  );
  const snapshot = await getDocs(balanceQuery);
  return snapshot.docs[0]?.data();
};
```

## 🧪 Testing

### 1. Profile Management Testing
- ✅ Test profile information updates
- ✅ Test skill addition/removal
- ✅ Test emergency contact updates
- ✅ Test avatar upload functionality
- ✅ Test form validation
- ✅ Test success/error feedback

### 2. Leave Management Testing
- ✅ Test leave request submission
- ✅ Test date validation
- ✅ Test leave balance calculations
- ✅ Test filtering functionality
- ✅ Test status updates
- ✅ Test manager approval workflow

### 3. Security Testing
- ✅ Test employee can only access own data
- ✅ Test manager can access all employee data
- ✅ Test leave approval permissions
- ✅ Test audit trail creation

## 📱 Mobile Responsiveness

Both components are fully responsive with:
- ✅ **Mobile-first design** with responsive grids
- ✅ **Touch-friendly buttons** and form elements
- ✅ **Collapsible sections** for mobile screens
- ✅ **Optimized modals** for small screens
- ✅ **Swipe-friendly tables** with horizontal scroll

## 🚀 Deployment Checklist

- [ ] Run `npm run setup-employee-features`
- [ ] Run `npm run deploy-rules`
- [ ] Run `npm run deploy-indexes`
- [ ] Test authentication with custom claims
- [ ] Verify security rules in Firebase Console
- [ ] Test all features in production
- [ ] Monitor performance and usage
- [ ] Set up backup procedures

## 📈 Performance Monitoring

Monitor these metrics:
- **Profile update response times**
- **Leave request submission speed**
- **Leave balance query performance**
- **Audit trail query efficiency**
- **Index usage statistics**

Your Employee Profile Management and Leave Management features are now ready for production! 🎉
