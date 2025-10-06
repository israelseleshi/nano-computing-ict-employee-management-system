// Environment-aware authentication service
import { mockAuth, mockDb, MockSession } from './mock.service';
import { enhancedAuth } from '@lib/firebaseAdapter';

// Check if Firebase should be used
const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';

// Unified authentication service that switches between mock and Firebase
export const authService = {
  async signIn(email: string, password: string) {
    if (useFirebase) {
      return await enhancedAuth.signIn(email, password);
    } else {
      const result = await mockAuth.signInWithPassword({ email, password });
      if (result.error) {
        return { data: { session: null }, error: result.error.message };
      }
      const sessionResult = await mockAuth.getSession();
      return sessionResult;
    }
  },

  async signUp(email: string, password: string, fullName?: string, department?: string) {
    if (useFirebase) {
      return await enhancedAuth.signUp(email, password, fullName || '', department || '');
    } else {
      // Mock auth doesn't support signup, return error
      return { data: { session: null }, error: 'Sign up not supported in demo mode' };
    }
  },

  async signOut() {
    if (useFirebase) {
      return await enhancedAuth.signOut();
    } else {
      await mockAuth.signOut();
      return { error: null };
    }
  },

  async getSession() {
    if (useFirebase) {
      return await enhancedAuth.getSession();
    } else {
      return await mockAuth.getSession();
    }
  },

  async getProfile(userId: string) {
    if (useFirebase) {
      try {
        return await enhancedAuth.getProfile(userId);
      } catch (error) {
        console.warn('Firebase profile fetch failed, falling back to mock:', error);
        return await mockDb.getProfile(userId);
      }
    } else {
      return await mockDb.getProfile(userId);
    }
  },

  onAuthStateChange(callback: (session: MockSession | null) => void) {
    if (useFirebase) {
      // For Firebase, we'd need to implement this differently
      // For now, return mock implementation
      return mockAuth.onAuthStateChange((_event, session) => {
        callback(session);
      });
    } else {
      return mockAuth.onAuthStateChange((_event, session) => {
        callback(session);
      });
    }
  }
};

// Export configuration info
export const authConfig = {
  useFirebase,
  demoCredentials: {
    manager: {
      email: import.meta.env.VITE_DEMO_MANAGER_EMAIL || 'manager@nanocomputing.com',
      password: import.meta.env.VITE_DEMO_PASSWORD || 'demo123'
    },
    employee: {
      email: import.meta.env.VITE_DEMO_EMPLOYEE_EMAIL || 'john@nanocomputing.com',
      password: import.meta.env.VITE_DEMO_PASSWORD || 'demo123'
    }
  }
};
