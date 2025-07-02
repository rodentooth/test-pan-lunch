# End-to-End Testing

This directory contains Playwright end-to-end tests for the Task Manager application.

## Setup

E2E tests are automatically configured with the project. The tests will:

1. Start the Next.js development server automatically
2. Use a PostgreSQL test database
3. Run tests across multiple browsers (Chromium, Firefox, WebKit)

## Running Tests

```bash
# Run tests headlessly (CI mode)
yarn test:e2e

# Run tests with browser visible
yarn test:e2e:headed

# Run tests with Playwright UI
yarn test:e2e:ui
```

## Test Database

The tests use the same PostgreSQL database as development. Make sure you have:

1. PostgreSQL running via Docker: `docker-compose up -d`
2. Environment variables configured in `.env.local`

## Test Files

- `add-task.spec.ts` - Tests for creating new tasks and task management functionality

## Test Coverage

Current E2E tests cover:

- ✅ Adding new tasks with all fields
- ✅ Adding minimal tasks (title only)
- ✅ Form validation for required fields
- ✅ Task list display and counting
- ✅ Task completion toggling
- ✅ Form clearing after submission
- ✅ Priority and category display

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to main/develop branches
- Pull requests
- Test reports are uploaded as artifacts

## Best Practices

1. Use `data-testid` attributes for reliable element selection
2. Wait for network idle state after form submissions
3. Test both positive and negative scenarios
4. Keep tests independent and clean up state
5. Use descriptive test names and organize with `describe` blocks