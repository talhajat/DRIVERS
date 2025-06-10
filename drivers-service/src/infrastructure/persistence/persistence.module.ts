/**
 * This file defines a module that organizes all our database-related code.
 * In NestJS, modules are used to group related functionality together.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaDriverRepository } from './repositories/driver.repository';

/**
 * This constant is used as a token to identify our driver repository in the dependency injection system.
 * Since TypeScript interfaces don't exist at runtime, we use this string instead.
 */
export const DRIVER_REPOSITORY = 'DRIVER_REPOSITORY';

/**
 * PersistenceModule bundles all database-related services and repositories.
 * It makes these components available to other parts of the application.
 */
@Module({
  providers: [
    // Register the PrismaService which connects to our database
    PrismaService,
    
    // Register our driver repository implementation
    // The 'provide' property specifies the token that identifies this service
    // The 'useClass' property specifies which class to use as the implementation
    {
      provide: DRIVER_REPOSITORY,
      useClass: PrismaDriverRepository,
    },
  ],
  // Export these services so they can be used by other modules
  exports: [
    PrismaService,
    DRIVER_REPOSITORY,
  ],
})
export class PersistenceModule {}