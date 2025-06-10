/**
 * This file defines the ApplicationModule, which organizes all application services.
 * Application services implement the business logic of the application.
 */

import { Module } from '@nestjs/common';
import { DriverService } from './services/driver.service';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';

/**
 * ApplicationModule bundles all application services and their dependencies.
 * It imports the PersistenceModule to have access to repositories.
 */
@Module({
  imports: [
    // Import the PersistenceModule to have access to repositories
    PersistenceModule,
  ],
  providers: [
    // Register all application services
    DriverService,
  ],
  exports: [
    // Export services that need to be used by other modules
    DriverService,
  ],
})
export class ApplicationModule {}