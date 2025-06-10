import { Module } from '@nestjs/common';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { ApplicationModule } from './application/application.module';
import { ApiModule } from './infrastructure/api/api.module';

/**
 * AppModule is the root module of our application.
 * It imports all other modules and sets up the application.
 */
@Module({
  imports: [
    // Import the PersistenceModule which provides database access
    PersistenceModule,
    // Import the ApplicationModule which provides application services
    ApplicationModule,
    // Import the ApiModule which provides API controllers
    ApiModule,
  ],
})
export class AppModule {}