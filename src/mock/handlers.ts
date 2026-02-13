import { http, HttpResponse, delay } from 'msw'
import { 
  getAllReports, 
  getReportById, 
  addReport, 
  deleteReport,
  getAllComparisons,
  getComparisonById,
  addComparison,
  deleteComparison,
  createComparisonSteps,
  createComparison,
  type Report,
  type Comparison
} from './data'
import { config
 } from '@/lib/config'
// Helper to create streaming response
function createStreamingResponse(steps: any[]) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      for (const step of steps) {
        controller.enqueue(encoder.encode(JSON.stringify(step) + '\n'))
        const delayMs = step.type === 'thinking' ? 1000 + Math.random() * 500 : 800 + Math.random() * 400
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
      controller.close()
    },
  })

  return new HttpResponse(stream, {
    status: 200,
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}

export const handlers = [
  // Reports
  http.get(`${config.apiBaseUrl}/reports`, async () => {
    await delay(400)
    return HttpResponse.json({ reports: getAllReports() })
  }),
  http.get(`${config.apiBaseUrl}/reports/:id`, async ({ params }) => {
    await delay(400)
    const report = getReportById(params.id as string)
    if (!report) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({ report })
  }),

  http.post(`${config.apiBaseUrl}/reports`, async ({ request }) => {
    await delay(400)
    const attrs = await request.json() as Partial<Report>
    const report = addReport(attrs as Report)
    return HttpResponse.json({ report }, { status: 201 })
  }),

  http.delete(`${config.apiBaseUrl}/reports/:id`, async ({ params }) => {
    await delay(400)
    const deleted = deleteReport(params.id as string)
    if (!deleted) {
      return new HttpResponse(null, { status: 404 })
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // Comparisons
  http.get(`${config.apiBaseUrl}/comparisons`, async () => {
    await delay(400)
    return HttpResponse.json({ comparisons: getAllComparisons() })
  }),

  http.get(`${config.apiBaseUrl}/comparisons/:id`, async ({ params }) => {
    await delay(400)
    const comparison = getComparisonById(params.id as string)
    if (!comparison) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({ comparison })
  }),

  http.post(`${config.apiBaseUrl}/comparisons`, async ({ request }) => {
    const attrs = await request.json() as Partial<Comparison>
    const comparison = createComparison(attrs)
    addComparison(comparison)
    
    // Return streaming response
    const steps = createComparisonSteps(comparison)
    return createStreamingResponse(steps)
  }),

  http.delete(`${config.apiBaseUrl}/comparisons/:id`, async ({ params }) => {
    await delay(400)
    const deleted = deleteComparison(params.id as string)
    if (!deleted) {
      return new HttpResponse(null, { status: 404 })
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // Uploads
  http.post(`${config.apiBaseUrl}/uploads`, async () => {
    await delay(400)
    return HttpResponse.json({ message: 'File uploaded successfully' }, { status: 201 })
  }),
]
