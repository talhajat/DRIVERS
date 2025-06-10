/**
 * This file exports all components from a single location.
 * This makes it easier to import them in other parts of the application or in other services.
 */

// Export domain components
export * from './domain/models';
export * from './domain/repositories';

// Export application components
export * from './application';

// Export infrastructure components
export * from './infrastructure';

// Export the main module
export * from './app.module';