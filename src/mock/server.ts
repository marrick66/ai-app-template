import { createServer, Model, Factory, Response } from 'miragejs'
import type { Server } from 'miragejs'
import type { TimelineStep } from '@/types/thinking'

function createComparisonStream(server: Server, body: string): globalThis.Response {
  const attrs = JSON.parse(body)
  server.create('comparison', attrs)

  const { report_type, section_name, year1, year2 } = attrs
  const steps: TimelineStep[] = [
    {
      type: 'thinking',
      clippable: false,
      html: `<p>I need to compare the <strong>${section_name}</strong> section between the ${report_type} filings for ${year1} and ${year2}.</p>`,
    },
    {
      type: 'action',
      icon: 'file-read-icon',
      label: `Reading ${report_type} filing for ${year1}`,
    },
    {
      type: 'action',
      icon: 'file-read-icon',
      label: `Reading ${report_type} filing for ${year2}`,
    },
    {
      type: 'thinking',
      clippable: true,
      html: `<p>Now I have both filings loaded. Let me analyze the <strong>${section_name}</strong> section from each report.</p><p>I'll identify the key differences, changes in metrics, and notable trends between the two years.</p>`,
    },
    {
      type: 'action',
      icon: 'file-write-icon',
      label: `Generating comparison for ${section_name}`,
      file: `comparison-${year1}-${year2}.json`,
    },
    {
      type: 'thinking',
      clippable: false,
      html: '<p>The comparison has been generated successfully.</p>',
    },
    {
      type: 'done',
    },
  ]

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (const step of steps) {
        controller.enqueue(encoder.encode(JSON.stringify(step) + '\n'))
        const delay = step.type === 'thinking' ? 1000 + Math.random() * 500 : 800 + Math.random() * 400
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
      controller.close()
    },
  })

  return new globalThis.Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}

export function makeServer({ environment = 'development' } = {}) {
  const mirageServer = createServer({
    environment,

    models: {
      report: Model,
      comparison: Model,
    },

    factories: {
      report: Factory.extend({
        id(i: number) {
          return String(i + 1)
        },
        type() {
          return ['10-K', '10-Q'][Math.floor(Math.random() * 2)]
        },
        year() {
          return 2020 + Math.floor(Math.random() * 6)
        },
        version() {
          return Math.floor(Math.random() * 3) + 1
        },
        description() {
          const type = (this as any).type as string
          const year = (this as any).year as number
          return `${type} filing for fiscal year ${year}`
        },
      }),
      comparison: Factory.extend({
        id(i: number) {
          return String(i + 1)
        },
        report_type() {
          return ['10-K', '10-Q'][Math.floor(Math.random() * 2)]
        },
        section_name() {
          const sections = [
            'Revenue Recognition',
            'Operating Expenses',
            'Cash Flow Analysis',
            'Risk Factors',
            'Balance Sheet Summary',
            'Equity Compensation',
          ]
          return sections[Math.floor(Math.random() * sections.length)]
        },
        year1() {
          return 2022 + Math.floor(Math.random() * 2)
        },
        year2() {
          return ((this as any).year1 as number) + 1
        },
      }),
    },

    seeds(server) {
      server.createList('report', 5)
      server.createList('comparison', 6)
    },

    routes() {
      this.namespace = 'api'
      this.timing = 400

      // Reports
      this.get('/reports', (schema) => {
        return schema.all('report')
      })

      this.get('/reports/:id', (schema, request) => {
        return schema.find('report', request.params.id!)
      })

      this.post('/reports', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.create('report', attrs)
      })

      this.del('/reports/:id', (schema, request) => {
        const report = schema.find('report', request.params.id!)
        report?.destroy()
        return new Response(204)
      })

      // Comparisons
      this.get('/comparisons', (schema) => {
        return schema.all('comparison')
      })

      this.get('/comparisons/:id', (schema, request) => {
        return schema.find('comparison', request.params.id!)
      })

      this.del('/comparisons/:id', (schema, request) => {
        const comparison = schema.find('comparison', request.params.id!)
        comparison?.destroy()
        return new Response(204)
      })

      // Uploads
      this.post('/uploads', (_schema, _request) => {
        return new Response(201, {}, { message: 'File uploaded successfully' })
      })

      // Allow unhandled requests to pass through
      this.passthrough()
    },
  })

  // Wrap fetch so POST /api/comparisons returns a ReadableStream
  // (MirageJS can't return streaming responses natively)
  const mirageFetch = globalThis.fetch
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    if (url.endsWith('/api/comparisons') && init?.method === 'POST') {
      return createComparisonStream(mirageServer, init.body as string)
    }
    return mirageFetch.call(globalThis, input, init)
  }

  return mirageServer
}