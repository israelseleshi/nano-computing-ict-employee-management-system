/**
 * Configuration Barrel Export
 */

export * from './constants';
export * from './environment';

// Validate environment on import
import { validateEnvironment } from './environment';
validateEnvironment();
