/**
 * This file exports all infrastructure components from a single location.
 * This makes it easier to import them in other parts of the application.
 */

// Export API components
export * from './api';

// Export persistence components
export * from './persistence/persistence.module';
export * from './persistence/prisma.service';
export * from './persistence/repositories';