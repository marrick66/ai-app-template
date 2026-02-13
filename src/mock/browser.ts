import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { seedData } from './data'

export async function startMockServiceWorker() {
  // Seed initial data
  seedData()
  
  // Create and start the worker
  const worker = setupWorker(...handlers)
  
  await worker.start({
    onUnhandledRequest: 'bypass', // Allow unhandled requests to pass through
  })
  
  console.log('[MSW] Mock service worker started')
  
  return worker
}
