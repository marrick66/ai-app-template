# Mock Service Migration

This project has been migrated from **MirageJS** to **MSW (Mock Service Worker)** with **Vitest** for mocking.

## Why the Change?

- **Better Test Integration**: MSW works seamlessly with Vitest and other modern testing frameworks
- **Browser & Node Support**: Same mock handlers work in both development (browser) and tests (Node)
- **More Realistic**: MSW intercepts requests at the network level, making mocks more realistic
- **Active Development**: MSW is actively maintained and has better TypeScript support

## Architecture

### Development Mode (Browser)

When running the app in development mode (`npm run dev`), MSW's service worker intercepts API calls:

1. [src/main.ts](src/main.ts) - Conditionally starts MSW in dev mode
2. [src/mock/browser.ts](src/mock/browser.ts) - Sets up the browser service worker
3. [src/mock/handlers.ts](src/mock/handlers.ts) - Defines HTTP request handlers
4. [src/mock/data.ts](src/mock/data.ts) - Mock data factories and storage

### Test Mode (Node)

For Vitest tests, MSW's Node server intercepts requests:

1. [vitest.setup.ts](vitest.setup.ts) - Configures MSW server for all tests
2. [vite.config.ts](vite.config.ts) - Points Vitest to the setup file
3. [src/mock/handlers.ts](src/mock/handlers.ts) - Same handlers used in browser

## API Endpoints

The mock implementation provides the following endpoints:

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get a specific report
- `POST /api/reports` - Create a new report
- `DELETE /api/reports/:id` - Delete a report

### Comparisons
- `GET /api/comparisons` - Get all comparisons
- `GET /api/comparisons/:id` - Get a specific comparison
- `POST /api/comparisons` - Create a comparison (returns streaming response)
- `DELETE /api/comparisons/:id` - Delete a comparison

### Uploads
- `POST /api/uploads` - Upload a file

## Using Mocks in Tests

```typescript
import { describe, it, expect } from 'vitest'
import { server } from '../vitest.setup'
import { http, HttpResponse } from 'msw'

describe('My Component', () => {
  it('handles custom response', async () => {
    // Override a specific handler for this test
    server.use(
      http.get('/api/reports', () => {
        return HttpResponse.json({ reports: [{ id: '1', type: '10-K' }] })
      })
    )
    
    // Your test code here
  })
})
```

## Mock Data Utilities

The [src/mock/data.ts](src/mock/data.ts) file provides utilities for managing mock data:

```typescript
import { seedData, resetData, createReport, getAllReports } from '@/mock/data'

// Seed with initial data
seedData()

// Create custom data
const report = createReport({ type: '10-K', year: 2024 })

// Get all data
const allReports = getAllReports()

// Reset data (useful between tests)
resetData()
```

## Running Tests

```bash
npm run test
```

Tests will automatically use the MSW server configured in [vitest.setup.ts](vitest.setup.ts).

## Files Changed

- ✅ Created: `src/mock/data.ts` - Mock data factories and storage
- ✅ Created: `src/mock/handlers.ts` - MSW request handlers
- ✅ Created: `src/mock/browser.ts` - Browser service worker setup
- ✅ Created: `vitest.setup.ts` - Test environment configuration
- ✅ Created: `test/mock-data.test.ts` - Example test file
- ✅ Updated: `src/main.ts` - Replace MirageJS with MSW
- ✅ Updated: `vite.config.ts` - Add Vitest configuration
- ✅ Deleted: `src/mock/server.ts` - Old MirageJS server
- ✅ Removed: `miragejs` dependency from package.json
