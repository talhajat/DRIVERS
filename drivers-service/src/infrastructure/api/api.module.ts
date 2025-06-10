/**
 * This file defines the ApiModule, which organizes all API-related components.
 * API components include controllers, DTOs, and other HTTP-related code.
 */

import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { DriverController } from './controllers/driver.controller';

/**
 * ApiModule bundles all API-related components and their dependencies.
 * It imports the ApplicationModule to have access to application services.
 */
@Module({
  imports: [
    // Import the ApplicationModule to have access to application services
    ApplicationModule,
  ],
  controllers: [
    // Register all controllers
    DriverController,
  ],
})
export class ApiModule {}