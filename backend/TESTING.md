# Testing Documentation

This document explains how to run tests for the DuoTime backend, specifically focusing on the authentication system.

## Test Structure

The authentication system has comprehensive tests covering:

### 1. Unit Tests

#### AuthService Tests (`src/auth/auth.service.spec.ts`)

Tests the core authentication business logic:

- **Google Login**: Tests Google OAuth integration, user creation, and JWT token generation
- **User Retrieval**: Tests fetching user profiles by ID
- **Token Renewal**: Tests JWT token renewal with proper expiration

#### AuthResolver Tests (`src/auth/auth.resolver.spec.ts`)

Tests the GraphQL resolver layer:

- **GraphQL Mutations**: Tests `googleLogin` and `renewToken` mutations
- **GraphQL Queries**: Tests `getProfile` query
- **Error Handling**: Tests proper error responses
- **Integration Scenarios**: Tests complete authentication flows

### 2. End-to-End Tests

#### Auth E2E Tests (`test/auth.e2e-spec.ts`)

Tests the complete GraphQL endpoints with HTTP requests:

- **GraphQL Schema**: Validates GraphQL schema and resolvers
- **Authentication Guards**: Tests JWT authentication middleware
- **Error Responses**: Tests proper error handling for unauthorized requests

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Only Auth Tests

```bash
npm test -- --testPathPattern=auth
```

### Run Specific Test Files

```bash
# Run only service tests
npm test -- --testPathPattern=auth.service.spec.ts

# Run only resolver tests
npm test -- --testPathPattern=auth.resolver.spec.ts

# Run only e2e tests
npm test -- --testPathPattern=auth.e2e-spec.ts
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:cov
```

## Test Coverage

The auth tests cover:

### ✅ Happy Path Scenarios

- Successful Google OAuth login
- User profile retrieval
- JWT token renewal
- New user creation during first login

### ✅ Error Scenarios

- Invalid Google tokens
- User not found
- Missing authentication
- Database errors

### ✅ Edge Cases

- Missing email in Google payload
- Null/undefined user fields
- Token expiration handling

## Mocking Strategy

### External Dependencies

- **Google OAuth**: Mocked to avoid external API calls
- **JWT Service**: Mocked for predictable token generation
- **Database**: Mocked Prisma client for isolated testing

### Test Data

- Mock user objects with realistic data
- Mock JWT payloads
- Mock Google OAuth responses

## Adding New Tests

### For New Auth Features

1. Add unit tests to `auth.service.spec.ts` for business logic
2. Add resolver tests to `auth.resolver.spec.ts` for GraphQL layer
3. Add e2e tests to `auth.e2e-spec.ts` for integration testing

### Test Naming Convention

- Use descriptive test names: `should [expected behavior] when [condition]`
- Group related tests in `describe` blocks
- Use `it` for individual test cases

### Example Test Structure

```typescript
describe('FeatureName', () => {
  it('should do something when condition is met', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Troubleshooting

### Common Issues

1. **Import Path Errors**: Ensure relative paths are correct
2. **Mock Issues**: Check that external dependencies are properly mocked
3. **Type Errors**: Verify TypeScript types match the actual implementation

### Debug Mode

Run tests in debug mode for detailed logging:

```bash
npm run test:debug
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines and will:

- Validate authentication logic
- Ensure GraphQL schema integrity
- Verify error handling
- Check integration points
