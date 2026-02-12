import { createServer, Model, Factory, Response } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
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

      this.post('/comparisons', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.create('comparison', attrs)
      })

      this.del('/comparisons/:id', (schema, request) => {
        const comparison = schema.find('comparison', request.params.id!)
        comparison?.destroy()
        return new Response(204)
      })

      // Allow unhandled requests to pass through
      this.passthrough()
    },
  })
}