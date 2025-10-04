// Mock authentication service to replace Supabase
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'manager' | 'employee';
  hourly_rate: number | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkTicketDB {
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

export interface MockSession {
  user: {
    id: string;
    email: string;
  };
}

// Mock user data
const mockUsers = [
  {
    id: 'manager-1',
    email: 'manager@nanocomputing.com',
    password: 'demo123',
    profile: {
      id: 'manager-1',
      email: 'manager@nanocomputing.com',
      full_name: 'Manager Admin',
      role: 'manager' as const,
      hourly_rate: null,
      department: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
  {
    id: 'employee-1',
    email: 'john@nanocomputing.com',
    password: 'demo123',
    profile: {
      id: 'employee-1',
      email: 'john@nanocomputing.com',
      full_name: 'John Doe',
      role: 'employee' as const,
      hourly_rate: 1250.00,
      department: 'Development',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
];

// Mock work tickets
const mockWorkTickets: WorkTicketDB[] = [
  {
    id: 'ticket-1',
    employee_id: 'employee-1',
    manager_id: 'manager-1',
    work_date: '2024-05-21',
    start_time: '09:00',
    end_time: '12:00',
    task_description: 'Implemented authentication module for client portal',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ticket-2',
    employee_id: 'employee-1',
    manager_id: 'manager-1',
    work_date: '2024-05-21',
    start_time: '13:00',
    end_time: '17:00',
    task_description: 'Code review and bug fixes for payment integration',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ticket-3',
    employee_id: 'employee-1',
    manager_id: 'manager-1',
    work_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '12:00',
    task_description: 'Working on new feature implementation',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Mock authentication state
let currentSession: MockSession | null = null;
let authListeners: ((session: MockSession | null) => void)[] = [];

// Mock authentication service
export const mockAuth = {
  // Get current session
  getSession: () => {
    return Promise.resolve({ data: { session: currentSession } });
  },

  // Sign in with email and password
  signInWithPassword: (credentials: { email: string; password: string }) => {
    return new Promise<{ error?: { message: string } }>((resolve) => {
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        currentSession = {
          user: {
            id: user.id,
            email: user.email,
          }
        };
        
        // Notify listeners
        authListeners.forEach(listener => listener(currentSession));
        resolve({});
      } else {
        resolve({ error: { message: 'Invalid login credentials' } });
      }
    });
  },

  // Sign out
  signOut: () => {
    return new Promise<void>((resolve) => {
      currentSession = null;
      authListeners.forEach(listener => listener(null));
      resolve();
    });
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
    const listener = (session: MockSession | null) => {
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    };
    
    authListeners.push(listener);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = authListeners.indexOf(listener);
            if (index > -1) {
              authListeners.splice(index, 1);
            }
          }
        }
      }
    };
  }
};

// Mock database service
export const mockDb = {
  // Get user profile
  getProfile: (userId: string) => {
    return new Promise<{ data: Profile | null; error?: { message: string } }>((resolve) => {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        resolve({ data: user.profile });
      } else {
        resolve({ data: null, error: { message: 'Profile not found' } });
      }
    });
  },

  // Get work tickets
  getWorkTickets: () => {
    return new Promise<{ data: WorkTicketDB[]; error?: { message: string } }>((resolve) => {
      resolve({ data: mockWorkTickets });
    });
  }
};
