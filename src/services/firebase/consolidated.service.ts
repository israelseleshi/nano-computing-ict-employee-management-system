/**
 * Firebase Data Service for Consolidated Collections
 * Implements Proposition 1: 8 Core Collections
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@lib/firebase/config';

// ============================================
// CONSOLIDATED USER INTERFACE
// ============================================
export interface ConsolidatedUser {
  id: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  createdAt: string | Timestamp;
  
  // Profile data (merged from employees + employeeProfiles)
  profile: {
    fullName: string;
    department: string;
    position: string;
    hourlyRate: number;
    hireDate: string;
    phone?: string;
    address?: string;
    skills?: string[];
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    avatar?: string;
    bio?: string;
    status: 'active' | 'inactive' | 'on-leave';
  };
  
  // Leave balance data (merged from leaveBalances + employeeLeaveBalances)
  leaveBalance: {
    year: number;
    vacation: {
      total: number;
      used: number;
      available: number;
    };
    sick: {
      total: number;
      used: number;
      available: number;
    };
    personal: {
      total: number;
      used: number;
      available: number;
    };
  };
}

// ============================================
// CONSOLIDATED LEAVE REQUEST INTERFACE
// ============================================
export interface ConsolidatedLeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  dates: {
    start: string;
    end: string;
  };
  days: number;
  metadata: {
    reason: string;
    managerComment?: string;
    submittedAt: string | Timestamp;
    reviewedAt?: string | Timestamp | null;
    reviewedBy?: string | null;
  };
}

// ============================================
// CONSOLIDATED SETTINGS INTERFACE
// ============================================
export interface ConsolidatedSettings {
  id: string;
  general: {
    companyName: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    workingHours: {
      start: string;
      end: string;
    };
    workDays: string[];
  };
  leave: {
    vacationDays: number;
    sickDays: number;
    personalDays: number;
    carryOverLimit: number;
    advanceNotice: number;
    maxConsecutiveDays: number;
    blackoutDates: string[];
    approvalLevels: number;
  };
  departments: Array<{
    id: string;
    name: string;
    managerId: string;
    budget: number;
    headcount: number;
    description?: string;
    createdAt: string;
  }>;
  system: {
    maintenanceMode: boolean;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  updatedAt: string | Timestamp;
}

// ============================================
// EXISTING INTERFACES (Keep as-is)
// ============================================
export interface WorkTicket {
  id: string;
  employee_id: string;
  manager_id: string | null;
  work_date: string;
  start_time: string;
  end_time: string;
  task_description: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  employee_id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  break_duration: number;
  total_hours: number;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface PayrollEntry {
  id: string;
  employee_id: string;
  employee_name: string;
  period_start: string;
  period_end: string;
  hours_worked: number;
  hourly_rate: number;
  gross_pay: number;
  deductions: {
    tax: number;
    insurance: number;
    other: number;
  };
  net_pay: number;
  status: 'draft' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  created_at: string;
}

export interface Goal {
  id: string;
  employee_id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: 'hours' | 'tickets' | 'earnings';
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  created_at: string;
  updated_at: string;
}

// ============================================
// FIREBASE DATA SERVICE CLASS
// ============================================
class ConsolidatedFirebaseService {
  
  // ==========================================
  // USER OPERATIONS (Consolidated)
  // ==========================================
  
  async getUser(userId: string): Promise<ConsolidatedUser | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ConsolidatedUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  
  async getAllUsers(): Promise<ConsolidatedUser[]> {
    try {
      const q = query(collection(db, 'users'), orderBy('profile.fullName'));
      const querySnapshot = await getDocs(q);
      
      const users: ConsolidatedUser[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as ConsolidatedUser);
      });
      
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }
  
  async getUsersByDepartment(department: string): Promise<ConsolidatedUser[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('profile.department', '==', department),
        orderBy('profile.fullName')
      );
      const querySnapshot = await getDocs(q);
      
      const users: ConsolidatedUser[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as ConsolidatedUser);
      });
      
      return users;
    } catch (error) {
      console.error('Error getting users by department:', error);
      return [];
    }
  }
  
  async updateUserProfile(userId: string, profileData: Partial<ConsolidatedUser['profile']>): Promise<boolean> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        'profile': profileData,
        'updatedAt': serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }
  
  async updateUserLeaveBalance(userId: string, leaveBalance: ConsolidatedUser['leaveBalance']): Promise<boolean> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        'leaveBalance': leaveBalance,
        'updatedAt': serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating leave balance:', error);
      return false;
    }
  }
  
  // ==========================================
  // LEAVE REQUEST OPERATIONS (Consolidated)
  // ==========================================
  
  async createLeaveRequest(request: Omit<ConsolidatedLeaveRequest, 'id'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'leaveRequests'), {
        ...request,
        metadata: {
          ...request.metadata,
          submittedAt: serverTimestamp()
        }
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating leave request:', error);
      return null;
    }
  }
  
  async getLeaveRequests(employeeId?: string): Promise<ConsolidatedLeaveRequest[]> {
    try {
      let q;
      if (employeeId) {
        q = query(
          collection(db, 'leaveRequests'),
          where('employeeId', '==', employeeId),
          orderBy('metadata.submittedAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'leaveRequests'),
          orderBy('metadata.submittedAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const requests: ConsolidatedLeaveRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as ConsolidatedLeaveRequest);
      });
      
      return requests;
    } catch (error) {
      console.error('Error getting leave requests:', error);
      return [];
    }
  }
  
  async getPendingLeaveRequests(): Promise<ConsolidatedLeaveRequest[]> {
    try {
      const q = query(
        collection(db, 'leaveRequests'),
        where('status', '==', 'pending'),
        orderBy('metadata.submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const requests: ConsolidatedLeaveRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as ConsolidatedLeaveRequest);
      });
      
      return requests;
    } catch (error) {
      console.error('Error getting pending leave requests:', error);
      return [];
    }
  }
  
  async updateLeaveRequestStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    managerId: string,
    comment?: string
  ): Promise<boolean> {
    try {
      const docRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(docRef, {
        status,
        'metadata.reviewedAt': serverTimestamp(),
        'metadata.reviewedBy': managerId,
        'metadata.managerComment': comment || ''
      });
      return true;
    } catch (error) {
      console.error('Error updating leave request:', error);
      return false;
    }
  }
  
  // ==========================================
  // SETTINGS OPERATIONS (Consolidated)
  // ==========================================
  
  async getSettings(): Promise<ConsolidatedSettings | null> {
    try {
      const docRef = doc(db, 'settings', 'global-settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ConsolidatedSettings;
      }
      return null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }
  
  async updateSettings(settings: Partial<ConsolidatedSettings>): Promise<boolean> {
    try {
      const docRef = doc(db, 'settings', 'global-settings');
      await updateDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }
  
  async addDepartment(department: ConsolidatedSettings['departments'][0]): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      if (!settings) return false;
      
      const updatedDepartments = [...settings.departments, department];
      return await this.updateSettings({ departments: updatedDepartments });
    } catch (error) {
      console.error('Error adding department:', error);
      return false;
    }
  }
  
  // ==========================================
  // EXISTING OPERATIONS (Keep as-is)
  // ==========================================
  
  // Work Tickets
  async createWorkTicket(ticket: Omit<WorkTicket, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'workTickets'), {
        ...ticket,
        created_at: now,
        updated_at: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating work ticket:', error);
      return null;
    }
  }
  
  async getWorkTickets(employeeId?: string): Promise<WorkTicket[]> {
    try {
      let q;
      if (employeeId) {
        q = query(
          collection(db, 'workTickets'),
          where('employee_id', '==', employeeId),
          orderBy('created_at', 'desc')
        );
      } else {
        q = query(collection(db, 'workTickets'), orderBy('created_at', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const tickets: WorkTicket[] = [];
      
      querySnapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() } as WorkTicket);
      });
      
      return tickets;
    } catch (error) {
      console.error('Error getting work tickets:', error);
      return [];
    }
  }
  
  // Time Entries
  async createTimeEntry(entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'timeEntries'), {
        ...entry,
        created_at: now,
        updated_at: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating time entry:', error);
      return null;
    }
  }
  
  async getTimeEntries(employeeId?: string, date?: string): Promise<TimeEntry[]> {
    try {
      let q;
      if (employeeId && date) {
        q = query(
          collection(db, 'timeEntries'),
          where('employee_id', '==', employeeId),
          where('date', '==', date)
        );
      } else if (employeeId) {
        q = query(
          collection(db, 'timeEntries'),
          where('employee_id', '==', employeeId),
          orderBy('date', 'desc')
        );
      } else {
        q = query(collection(db, 'timeEntries'), orderBy('date', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const entries: TimeEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as TimeEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error getting time entries:', error);
      return [];
    }
  }
  
  // Payroll Entries
  async createPayrollEntry(entry: Omit<PayrollEntry, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'payrollEntries'), {
        ...entry,
        created_at: now,
        updated_at: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating payroll entry:', error);
      return null;
    }
  }
  
  async getPayrollEntries(employeeId?: string): Promise<PayrollEntry[]> {
    try {
      let q;
      if (employeeId) {
        q = query(
          collection(db, 'payrollEntries'),
          where('employee_id', '==', employeeId),
          orderBy('period_end', 'desc')
        );
      } else {
        q = query(collection(db, 'payrollEntries'), orderBy('period_end', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const entries: PayrollEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as PayrollEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error getting payroll entries:', error);
      return [];
    }
  }
  
  // Notifications
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        created_at: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }
  
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as Notification);
      });
      
      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }
  
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, {
        is_read: true
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
  
  // Goals
  async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'goals'), {
        ...goal,
        created_at: now,
        updated_at: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  }
  
  async getGoals(employeeId?: string): Promise<Goal[]> {
    try {
      let q;
      if (employeeId) {
        q = query(
          collection(db, 'goals'),
          where('employee_id', '==', employeeId),
          orderBy('deadline', 'asc')
        );
      } else {
        q = query(collection(db, 'goals'), orderBy('deadline', 'asc'));
      }
      
      const querySnapshot = await getDocs(q);
      const goals: Goal[] = [];
      
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as Goal);
      });
      
      return goals;
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }
  
  async updateGoalProgress(goalId: string, currentValue: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'goals', goalId);
      const goalDoc = await getDoc(docRef);
      
      if (!goalDoc.exists()) return false;
      
      const goalData = goalDoc.data() as Goal;
      const status = currentValue >= goalData.target_value ? 'completed' : 
                     new Date(goalData.deadline) < new Date() ? 'overdue' : 'active';
      
      await updateDoc(docRef, {
        current_value: currentValue,
        status,
        updated_at: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      return false;
    }
  }
  
  // ==========================================
  // BATCH OPERATIONS
  // ==========================================
  
  async batchUpdateLeaveBalances(updates: Array<{ userId: string; balance: ConsolidatedUser['leaveBalance'] }>): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      for (const update of updates) {
        const docRef = doc(db, 'users', update.userId);
        batch.update(docRef, {
          'leaveBalance': update.balance,
          'updatedAt': serverTimestamp()
        });
      }
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error batch updating leave balances:', error);
      return false;
    }
  }
  
  // ==========================================
  // REAL-TIME LISTENERS
  // ==========================================
  
  subscribeToUserChanges(userId: string, callback: (user: ConsolidatedUser | null) => void): () => void {
    const docRef = doc(db, 'users', userId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as ConsolidatedUser);
      } else {
        callback(null);
      }
    });
  }
  
  subscribeToPendingLeaveRequests(callback: (requests: ConsolidatedLeaveRequest[]) => void): () => void {
    const q = query(
      collection(db, 'leaveRequests'),
      where('status', '==', 'pending'),
      orderBy('metadata.submittedAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const requests: ConsolidatedLeaveRequest[] = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as ConsolidatedLeaveRequest);
      });
      callback(requests);
    });
  }
}

// Export singleton instance
export const firebaseService = new ConsolidatedFirebaseService();

// Export for backward compatibility
export default firebaseService;
