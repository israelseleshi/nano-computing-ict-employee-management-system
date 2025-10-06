/**
 * Environment Configuration
 */

// Environment
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const MODE = import.meta.env.MODE;

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Feature Flags
export const FEATURES = {
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true'
};

// Logging
export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || (IS_PRODUCTION ? 'error' : 'debug');

// Security
export const ENABLE_HTTPS = import.meta.env.VITE_ENABLE_HTTPS === 'true';
export const CSP_NONCE = import.meta.env.VITE_CSP_NONCE || '';

// Performance
export const ENABLE_PERFORMANCE_MONITORING = import.meta.env.VITE_ENABLE_PERFORMANCE === 'true';
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';

// Validate required environment variables
export function validateEnvironment(): void {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0 && IS_PRODUCTION) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (missing.length > 0 && IS_DEVELOPMENT) {
    console.warn('Missing environment variables:', missing);
  }
}

// Export environment info for debugging
export const ENVIRONMENT_INFO = {
  mode: MODE,
  isProduction: IS_PRODUCTION,
  isDevelopment: IS_DEVELOPMENT,
  features: FEATURES,
  logLevel: LOG_LEVEL
};
