// Firebase Adapter - Bridges Firebase services with existing app interfaces
import { firebaseAuth, FirebaseProfile, FirebaseSession } from './firebaseAuth';
import { firebaseData, FirebaseWorkTicket, FirebaseGoal, FirebaseNotification } from './firebaseData';
import { Profile, WorkTicketDB, MockSession } from './mockAuth';

// Convert Firebase types to app types
export class FirebaseAdapter {
  // Convert Firebase profile to app profile
  static convertProfile(firebaseProfile: FirebaseProfile): Profile {
    return {
      id: firebaseProfile.id,
      email: firebaseProfile.email,
      full_name: firebaseProfile.full_name,
      role: firebaseProfile.role,
      hourly_rate: firebaseProfile.hourly_rate,
      department: firebaseProfile.department,
      created_at: firebaseProfile.created_at,
      updated_at: firebaseProfile.updated_at
    };
  }

  // Convert Firebase session to app session
  static convertSession(firebaseSession: FirebaseSession): MockSession {
    return {
      user: {
        id: firebaseSession.user.id,
        email: firebaseSession.user.email
      }
    };
  }

  // Convert Firebase work ticket to app work ticket
  static convertWorkTicket(firebaseTicket: FirebaseWorkTicket): WorkTicketDB {
    return {
      id: firebaseTicket.id,
      employee_id: firebaseTicket.employee_id,
      manager_id: firebaseTicket.manager_id,
      work_date: firebaseTicket.work_date,
      start_time: firebaseTicket.start_time,
      end_time: firebaseTicket.end_time,
      task_description: firebaseTicket.task_description,
      status: firebaseTicket.status,
      created_at: firebaseTicket.created_at,
      updated_at: firebaseTicket.updated_at
    };
  }

  // Convert app work ticket to Firebase work ticket
  static convertToFirebaseWorkTicket(appTicket: Omit<WorkTicketDB, 'id' | 'created_at' | 'updated_at'>): Omit<FirebaseWorkTicket, 'id' | 'created_at' | 'updated_at'> {
    return {
      employee_id: appTicket.employee_id,
      manager_id: appTicket.manager_id,
      work_date: appTicket.work_date,
      start_time: appTicket.start_time,
      end_time: appTicket.end_time,
      task_description: appTicket.task_description,
      status: appTicket.status
    };
  }
}

// Enhanced authentication service that uses Firebase
export class EnhancedAuthService {
  // Sign in
  async signIn(email: string, password: string): Promise<{ data: { session: MockSession | null }, error: string | null }> {
    const result = await firebaseAuth.signIn(email, password);
    
    if (result.error) {
      return { data: { session: null }, error: result.error };
    }
    
    if (result.data.session) {
      const session = FirebaseAdapter.convertSession(result.data.session);
      return { data: { session }, error: null };
    }
    
    return { data: { session: null }, error: 'Authentication failed' };
  }

  // Sign up
  async signUp(email: string, password: string, fullName: string, department: string): Promise<{ data: { session: MockSession | null }, error: string | null }> {
    const result = await firebaseAuth.signUp(email, password, fullName, department);
    
    if (result.error) {
      return { data: { session: null }, error: result.error };
    }
    
    if (result.data.session) {
      const session = FirebaseAdapter.convertSession(result.data.session);
      return { data: { session }, error: null };
    }
    
    return { data: { session: null }, error: 'Registration failed' };
  }

  // Get session
  async getSession(): Promise<{ data: { session: MockSession | null } }> {
    const result = await firebaseAuth.getSession();
    
    if (result.data.session) {
      const session = FirebaseAdapter.convertSession(result.data.session);
      return { data: { session } };
    }
    
    return { data: { session: null } };
  }

  // Get profile
  async getProfile(userId: string): Promise<{ data: Profile | null, error: string | null }> {
    const result = await firebaseAuth.getProfile(userId);
    
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    if (result.data) {
      const profile = FirebaseAdapter.convertProfile(result.data);
      return { data: profile, error: null };
    }
    
    return { data: null, error: 'Profile not found' };
  }

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    return await firebaseAuth.signOut();
  }

  // Get employees (for managers)
  async getEmployees(): Promise<{ data: Profile[], error: string | null }> {
    const result = await firebaseAuth.getEmployees();
    
    if (result.error) {
      return { data: [], error: result.error };
    }
    
    const profiles = result.data.map(FirebaseAdapter.convertProfile);
    return { data: profiles, error: null };
  }
}

// Enhanced data service that uses Firebase
export class EnhancedDataService {
  // Work tickets
  async getWorkTickets(employeeId?: string): Promise<{ data: WorkTicketDB[], error: string | null }> {
    const result = await firebaseData.getWorkTickets(employeeId);
    
    if (result.error) {
      return { data: [], error: result.error };
    }
    
    const tickets = result.data.map(FirebaseAdapter.convertWorkTicket);
    return { data: tickets, error: null };
  }

  async createWorkTicket(ticket: Omit<WorkTicketDB, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: string | null, error: string | null }> {
    const firebaseTicket = FirebaseAdapter.convertToFirebaseWorkTicket(ticket);
    return await firebaseData.createWorkTicket(firebaseTicket);
  }

  async updateWorkTicket(ticketId: string, updates: Partial<WorkTicketDB>): Promise<{ error: string | null }> {
    return await firebaseData.updateWorkTicket(ticketId, updates);
  }

  // Goals
  async getGoals(employeeId: string): Promise<{ data: FirebaseGoal[], error: string | null }> {
    return await firebaseData.getGoals(employeeId);
  }

  async createGoal(goal: Omit<FirebaseGoal, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: string | null, error: string | null }> {
    return await firebaseData.createGoal(goal);
  }

  async updateGoal(goalId: string, updates: Partial<FirebaseGoal>): Promise<{ error: string | null }> {
    return await firebaseData.updateGoal(goalId, updates);
  }

  async deleteGoal(goalId: string): Promise<{ error: string | null }> {
    return await firebaseData.deleteGoal(goalId);
  }

  // Notifications
  async getNotifications(userId: string): Promise<{ data: FirebaseNotification[], error: string | null }> {
    return await firebaseData.getNotifications(userId);
  }

  async createNotification(notification: Omit<FirebaseNotification, 'id' | 'created_at'>): Promise<{ data: string | null, error: string | null }> {
    return await firebaseData.createNotification(notification);
  }

  async markNotificationAsRead(notificationId: string): Promise<{ error: string | null }> {
    return await firebaseData.markNotificationAsRead(notificationId);
  }

  // Real-time subscriptions
  subscribeToWorkTickets(employeeId: string | null, callback: (tickets: WorkTicketDB[]) => void) {
    return firebaseData.subscribeToWorkTickets(employeeId, (firebaseTickets) => {
      const tickets = firebaseTickets.map(FirebaseAdapter.convertWorkTicket);
      callback(tickets);
    });
  }

  subscribeToNotifications(userId: string, callback: (notifications: FirebaseNotification[]) => void) {
    return firebaseData.subscribeToNotifications(userId, callback);
  }
}

// Export singleton instances
export const enhancedAuth = new EnhancedAuthService();
export const enhancedData = new EnhancedDataService();
