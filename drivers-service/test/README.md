# Test Organization for Drivers Service

This document outlines the test organization following Domain-Driven Design (DDD) principles for the drivers-service microservice in a polyrepo architecture.

## Architecture Overview

The drivers-service follows **Domain-Driven Design (DDD)** with clear separation of concerns:

- **Domain Layer** (`src/domain/`): Business entities, value objects, domain services, and repository interfaces
- **Application Layer** (`src/application/`): Application services, use cases, and business workflows
- **Infrastructure Layer** (`src/infrastructure/`): External concerns (API controllers, database repositories, external services)

## Test Structure

```
drivers-service/
├── src/                           # Source code following DDD layers
│   ├── domain/                   # Domain layer
│   ├── application/              # Application layer
│   └── infrastructure/           # Infrastructure layer
└── test/                         # Test organization mirroring DDD structure
    ├── unit/                     # Unit tests - isolated component testing
    │   ├── domain/              # Domain layer unit tests
    │   │   ├── models/          # Entity and value object tests
    │   │   │   ├── driver.entity.test.ts
    │   │   │   ├── emergency-contact.entity.test.ts
    │   │   │   ├── endorsement.entity.test.ts
    │   │   │   ├── document.entity.test.ts
    │   │   │   └── hours-of-service.entity.test.ts
    │   │   └── services/        # Domain service tests
    │   ├── application/         # Application layer unit tests
    │   │   └── services/        # Application service tests
    │   │       └── driver.service.test.ts
    │   └── infrastructure/      # Infrastructure layer unit tests
    │       ├── api/            # Controller and DTO tests
    │       │   ├── controllers/
    │       │   │   └── driver.controller.test.ts
    │       │   └── dtos/
    │       │       ├── create-driver.dto.test.ts
    │       │       ├── update-driver.dto.test.ts
    │       │       └── driver-response.dto.test.ts
    │       └── persistence/    # Repository implementation tests
    │           └── repositories/
    │               └── driver.repository.test.ts
    ├── integration/            # Integration tests - layer interactions
    │   ├── api/               # API endpoint integration tests
    │   │   ├── driver-api.test.js        # ✅ Current: API endpoints
    │   │   └── hassan-driver.test.js     # ✅ Current: Specific driver test
    │   ├── database/          # Database integration tests
    │   │   ├── driver-repository.integration.test.ts
    │   │   └── prisma-migrations.test.ts
    │   └── external/          # External service integration tests
    │       └── file-upload.integration.test.ts
    ├── e2e/                   # End-to-end tests - complete workflows
    │   └── scenarios/         # Business scenario tests
    │       ├── driver-lifecycle.e2e.test.ts
    │       ├── driver-onboarding.e2e.test.ts
    │       └── driver-status-management.e2e.test.ts
    └── fixtures/              # Test data and utilities
        ├── data/              # Test data fixtures
        │   ├── drivers.fixture.ts
        │   ├── emergency-contacts.fixture.ts
        │   └── documents.fixture.ts
        └── helpers/           # Test helper functions
            ├── database.helper.ts
            ├── api.helper.ts
            └── mock.helper.ts
```

## Test Types & Responsibilities

### Unit Tests (`test/unit/`)

**Domain Layer Tests**:
- **Entities**: Test business rules, validation, and entity behavior
- **Value Objects**: Test immutability and validation rules
- **Domain Services**: Test complex business logic

**Application Layer Tests**:
- **Application Services**: Test use cases and business workflows
- **Command/Query Handlers**: Test CQRS patterns if implemented

**Infrastructure Layer Tests**:
- **Controllers**: Test HTTP request/response handling
- **DTOs**: Test data transformation and validation
- **Repository Implementations**: Test data access logic (mocked database)

### Integration Tests (`test/integration/`)

**API Integration**:
- Test complete HTTP request/response cycles
- Test middleware, validation, and error handling
- Test multipart/form-data file uploads

**Database Integration**:
- Test repository implementations with real database
- Test Prisma schema and migrations
- Test database constraints and relationships

**External Service Integration**:
- Test file storage integrations
- Test third-party API integrations

### End-to-End Tests (`test/e2e/`)

**Business Scenarios**:
- Complete driver onboarding workflow
- Driver status lifecycle management
- Document upload and verification processes

## Current Implementation Status

### ✅ Completed
- **Test Structure**: DDD-aligned folder organization created
- **Integration Tests**: Moved existing API tests to proper location
  - [`driver-api.test.js`](integration/driver-api.test.js) - API endpoint testing
  - [`hassan-driver.test.js`](integration/hassan-driver.test.js) - Specific driver creation test
- **Documentation**: Comprehensive test organization guide

### 🔄 Next Steps
1. **Add Jest Configuration**: Set up proper test runner configuration
2. **Create Test Fixtures**: Add reusable test data and helpers
3. **Unit Test Implementation**: Start with domain entity tests
4. **Database Test Setup**: Configure test database for integration tests

## Testing Guidelines

### 1. **DDD Layer Alignment**
- Mirror source code structure in test organization
- Test each layer in isolation with appropriate mocking
- Ensure clear separation between unit, integration, and e2e tests

### 2. **Test Isolation & Independence**
- Unit tests should not depend on external resources (database, APIs)
- Use dependency injection and mocking for external dependencies
- Each test should be able to run independently

### 3. **Naming Conventions**
- Use `.test.ts` or `.spec.ts` suffix for TypeScript tests
- Use `.test.js` for JavaScript tests (legacy)
- Follow descriptive naming: `[component].[layer].[type].test.ts`

### 4. **Test Data Management**
- Use fixtures for consistent, reusable test data
- Implement database seeding for integration tests
- Clean up test data after each test run

### 5. **Mocking Strategy**
- Mock external dependencies in unit tests
- Use real implementations in integration tests
- Mock time-dependent operations for consistency

## Running Tests

```bash
# Install test dependencies
npm install --save-dev jest @types/jest ts-jest supertest

# Run all tests
npm test

# Run tests by type
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # End-to-end tests only

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- driver.entity.test.ts
```

## Test Dependencies & Tools

### Core Testing Framework
- **Jest**: Primary testing framework with TypeScript support
- **ts-jest**: TypeScript preprocessor for Jest
- **@types/jest**: TypeScript definitions for Jest

### API Testing
- **Supertest**: HTTP assertion library for API testing
- **MSW (Mock Service Worker)**: API mocking for external services

### Database Testing
- **@testcontainers/postgresql**: Docker containers for database testing
- **prisma**: Database ORM with test database support

### Utilities
- **faker**: Generate realistic test data
- **uuid**: Generate test UUIDs
- **multer**: File upload testing utilities

## Environment Configuration

### Test Database
```bash
# Test environment variables (.env.test)
DATABASE_URL="postgresql://test:test@localhost:5433/drivers_test"
NODE_ENV="test"
JWT_SECRET="test-secret"
```

### Jest Configuration
- TypeScript support with ts-jest
- Path mapping for clean imports
- Coverage reporting
- Test environment setup and teardown

## Best Practices

1. **Test Pyramid**: More unit tests, fewer integration tests, minimal e2e tests
2. **Fast Feedback**: Unit tests should run quickly (< 1s per test)
3. **Reliable Tests**: Tests should be deterministic and not flaky
4. **Readable Tests**: Use descriptive test names and clear assertions
5. **Maintainable Tests**: Keep tests simple and focused on single concerns

## Microservice Testing Considerations

As a **polyrepo microservice**, the drivers-service should:

1. **Test in Isolation**: Don't depend on other microservices in tests
2. **Contract Testing**: Ensure API contracts are maintained
3. **Database Independence**: Use dedicated test database
4. **Environment Parity**: Test environment should match production
5. **CI/CD Integration**: Tests should run in continuous integration pipeline

## Migration from Legacy Tests

The existing JavaScript test files have been moved to the integration folder:
- `test-driver-api.js` → `test/integration/driver-api.test.js`
- `test-hassan-driver.js` → `test/integration/hassan-driver.test.js`

These tests should be gradually migrated to TypeScript and follow the new testing patterns outlined in this document.