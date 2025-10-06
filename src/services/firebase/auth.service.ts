// Firebase Authentication Service
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '@lib/firebase/config';

// User profile interface for Firestore
export interface FirebaseProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'manager' | 'employee';
  hourly_rate: number | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

// Firebase session interface
export interface FirebaseSession {
  user: {
    id: string;
    email: string;
  };
}

class FirebaseAuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ data: { session: FirebaseSession | null }, error: string | null }> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const session: FirebaseSession = {
        user: {
          id: user.uid,
          email: user.email || ''
        }
      };
      
      return { data: { session }, error: null };
    } catch (error: any) {
      return { data: { session: null }, error: error.message };
    }
  }

  // Sign up with email and password
  async signUp(
    email: string, 
    password: string, 
    fullName: string, 
    department: string,
    role: 'manager' | 'employee' = 'employee'
  ): Promise<{ data: { session: FirebaseSession | null }, error: string | null }> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const profile: FirebaseProfile = {
        id: user.uid,
        email: user.email || '',
        full_name: fullName,
        role: role,
        hourly_rate: role === 'employee' ? 1500 : null, // Default ETB rate for employees
        department: department,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), profile);
      
      const session: FirebaseSession = {
        user: {
          id: user.uid,
          email: user.email || ''
        }
      };
      
      return { data: { session }, error: null };
    } catch (error: any) {
      return { data: { session: null }, error: error.message };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Get current session
  async getSession(): Promise<{ data: { session: FirebaseSession | null } }> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          const session: FirebaseSession = {
            user: {
              id: user.uid,
              email: user.email || ''
            }
          };
          resolve({ data: { session } });
        } else {
          resolve({ data: { session: null } });
        }
      });
    });
  }

  // Get user profile
  async getProfile(userId: string): Promise<{ data: FirebaseProfile | null, error: string | null }> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: docSnap.data() as FirebaseProfile, error: null };
      } else {
        return { data: null, error: 'Profile not found' };
      }
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<FirebaseProfile>): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, { 
        ...updates, 
        updated_at: new Date().toISOString() 
      }, { merge: true });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Get all employees (for managers)
  async getEmployees(): Promise<{ data: FirebaseProfile[], error: string | null }> {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'employee'));
      const querySnapshot = await getDocs(q);
      
      const employees: FirebaseProfile[] = [];
      querySnapshot.forEach((doc) => {
        employees.push(doc.data() as FirebaseProfile);
      });
      
      return { data: employees, error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  // Listen to authentication state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

// Create and export a singleton instance
export const firebaseAuth = new FirebaseAuthService();
export default firebaseAuth;
