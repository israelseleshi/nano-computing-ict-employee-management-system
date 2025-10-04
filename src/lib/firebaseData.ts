// Firebase Data Service for Work Tickets, Goals, and Notifications
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

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
}

// Create and export a singleton instance
export const firebaseData = new FirebaseDataService();
export default firebaseData;
