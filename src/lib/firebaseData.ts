// Firebase Data Service for Work Tickets, Goals, and Notifications
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@lib/firebase/config';

// Work Ticket interface for Firestore
export interface FirebaseWorkTicket {
  id: string;
  employee_id: string;
  manager_id: string | null;
  work_date: string;
  start_time: string;
  end_time: string;
  task_description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Goal interface for Firestore
export interface FirebaseGoal {
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

// Notification interface for Firestore
export interface FirebaseNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  related_ticket_id?: string;
  created_at: string;
}

// Leave Request interface for Firestore
export interface FirebaseLeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  employeePosition?: string;
  employeeEmail?: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  priority?: 'normal' | 'high' | 'urgent';
  managerComment?: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  managerId?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

// Leave Balance interface for Firestore
export interface FirebaseLeaveBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  year: number;
  vacation: {
    total: number;
    used: number;
    pending: number;
    available: number;
    carryOver?: number;
  };
  sick: {
    total: number;
    used: number;
    pending: number;
    available: number;
    carryOver?: number;
  };
  personal: {
    total: number;
    used: number;
    pending: number;
    available: number;
    carryOver?: number;
  };
  emergency: {
    total: number;
    used: number;
    pending: number;
    available: number;
    carryOver?: number;
  };
  lastUpdated: string;
  created_at: string;
}

class FirebaseDataService {
  // Work Tickets Operations
  async createWorkTicket(ticket: Omit<FirebaseWorkTicket, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: string | null, error: string | null }> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'workTickets'), {
        ...ticket,
        created_at: now,
        updated_at: now
      });
      
      return { data: docRef.id, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getWorkTickets(employeeId?: string): Promise<{ data: FirebaseWorkTicket[], error: string | null }> {
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
      const tickets: FirebaseWorkTicket[] = [];
      
      querySnapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() } as FirebaseWorkTicket);
      });
      
      return { data: tickets, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async updateWorkTicket(ticketId: string, updates: Partial<FirebaseWorkTicket>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'workTickets', ticketId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async deleteWorkTicket(ticketId: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, 'workTickets', ticketId));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Goals Operations
  async createGoal(goal: Omit<FirebaseGoal, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: string | null, error: string | null }> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'goals'), {
        ...goal,
        created_at: now,
        updated_at: now
      });
      
      return { data: docRef.id, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getGoals(employeeId: string): Promise<{ data: FirebaseGoal[], error: string | null }> {
    try {
      const q = query(
        collection(db, 'goals'),
        where('employee_id', '==', employeeId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const goals: FirebaseGoal[] = [];
      
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as FirebaseGoal);
      });
      
      return { data: goals, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async updateGoal(goalId: string, updates: Partial<FirebaseGoal>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'goals', goalId);
      await updateDoc(docRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async deleteGoal(goalId: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, 'goals', goalId));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Notifications Operations
  async createNotification(notification: Omit<FirebaseNotification, 'id' | 'created_at'>): Promise<{ data: string | null, error: string | null }> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        created_at: new Date().toISOString()
      });
      
      return { data: docRef.id, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getNotifications(userId: string): Promise<{ data: FirebaseNotification[], error: string | null }> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: FirebaseNotification[] = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as FirebaseNotification);
      });
      
      return { data: notifications, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { is_read: true });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async deleteNotification(notificationId: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Real-time listeners
  subscribeToWorkTickets(employeeId: string | null, callback: (tickets: FirebaseWorkTicket[]) => void) {
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

    return onSnapshot(q, (querySnapshot) => {
      const tickets: FirebaseWorkTicket[] = [];
      querySnapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() } as FirebaseWorkTicket);
      });
      callback(tickets);
    });
  }

  subscribeToNotifications(userId: string, callback: (notifications: FirebaseNotification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications: FirebaseNotification[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as FirebaseNotification);
      });
      callback(notifications);
    });
  }

  // Leave Request Operations
  async createLeaveRequest(request: Omit<FirebaseLeaveRequest, 'id' | 'created_at' | 'updated_at' | 'submittedAt' | 'status'>): Promise<{ data: string | null, error: string | null }> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'leaveRequests'), {
        ...request,
        submittedAt: now,
        created_at: now,
        updated_at: now,
        status: 'pending'
      });
      
      return { data: docRef.id, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getLeaveRequests(employeeId?: string): Promise<{ data: FirebaseLeaveRequest[], error: string | null }> {
    try {
      console.log('🔍 Firebase: Getting leave requests, employeeId:', employeeId);
      let q;
      if (employeeId) {
        q = query(
          collection(db, 'leaveRequests'),
          where('employeeId', '==', employeeId),
          orderBy('submittedAt', 'desc')
        );
      } else {
        q = query(collection(db, 'leaveRequests'), orderBy('submittedAt', 'desc'));
      }
      
      console.log('🔍 Firebase: Executing query...');
      const querySnapshot = await getDocs(q);
      const requests: FirebaseLeaveRequest[] = [];
      
      console.log('📊 Firebase: Query returned', querySnapshot.size, 'documents');
      
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        console.log('📄 Firebase: Document data:', { id: doc.id, ...docData });
        requests.push({ id: doc.id, ...docData } as FirebaseLeaveRequest);
      });
      
      console.log('✅ Firebase: Final requests array:', requests);
      return { data: requests, error: null };
    } catch (error: any) {
      console.error('❌ Firebase: Error in getLeaveRequests:', error);
      return { data: [], error: error.message };
    }
  }

  async updateLeaveRequestStatus(requestId: string, status: 'approved' | 'rejected', managerComment?: string): Promise<{ error: string | null }> {
    try {
      const now = new Date().toISOString();
      const updates: any = {
        status,
        updated_at: now
      };

      if (managerComment) {
        updates.managerComment = managerComment;
      }

      if (status === 'approved') {
        updates.approvedAt = now;
      } else if (status === 'rejected') {
        updates.rejectedAt = now;
      }

      const docRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(docRef, updates);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async getLeaveBalance(employeeId: string): Promise<{ data: FirebaseLeaveBalance | null, error: string | null }> {
    try {
      const currentYear = new Date().getFullYear();
      const q = query(
        collection(db, 'employeeLeaveBalances'),
        where('employeeId', '==', employeeId),
        where('year', '==', currentYear)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { data: null, error: 'No leave balance found for current year' };
      }

      const doc = querySnapshot.docs[0];
      const balance = { id: doc.id, ...doc.data() } as FirebaseLeaveBalance;
      
      return { data: balance, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async updateLeaveBalance(employeeId: string, updates: Partial<FirebaseLeaveBalance>): Promise<{ error: string | null }> {
    try {
      const currentYear = new Date().getFullYear();
      const q = query(
        collection(db, 'employeeLeaveBalances'),
        where('employeeId', '==', employeeId),
        where('year', '==', currentYear)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { error: 'No leave balance found to update' };
      }

      const docRef = doc(db, 'employeeLeaveBalances', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: new Date().toISOString()
      });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Real-time listener for leave requests
  subscribeToLeaveRequests(employeeId: string | null, callback: (requests: FirebaseLeaveRequest[]) => void) {
    let q;
    if (employeeId) {
      q = query(
        collection(db, 'leaveRequests'),
        where('employeeId', '==', employeeId),
        orderBy('submittedAt', 'desc')
      );
    } else {
      q = query(collection(db, 'leaveRequests'), orderBy('submittedAt', 'desc'));
    }

    return onSnapshot(q, (querySnapshot) => {
      const requests: FirebaseLeaveRequest[] = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as FirebaseLeaveRequest);
      });
      callback(requests);
    });
  }
}

// Create and export a singleton instance
export const firebaseData = new FirebaseDataService();
export default firebaseData;

// Export consolidated service for migration
export { firebaseService as consolidatedFirebaseService } from '@lib/firebaseDataConsolidated';
