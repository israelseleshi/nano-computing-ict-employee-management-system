/**
 * Services Barrel Export
 */

// API Services
export * from './api/auth.service';
export * from './api/mock.service';

// Firebase Services
export * from './firebase/auth.service';
export * from './firebase/db.service';
export * from './firebase/consolidated.service';

// Re-export commonly used services
export { authService } from './api/auth.service';
export { mockDb } from './api/mock.service';
export { firebaseAuth } from './firebase/auth.service';
export { firebaseData } from './firebase/db.service';
export { firebaseService as consolidatedService } from './firebase/consolidated.service';
