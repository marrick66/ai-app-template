import type { TimelineStep } from '@/types/thinking'

export interface Report {
  id: string
  type: string
  year: number
  version: number
  description: string
}

export interface Comparison {
  id: string
  report_type: string
  section_name: string
  year1: number
  year2: number
}

// Mock data stores
let reports: Report[] = []
let comparisons: Comparison[] = []

// Factory functions
export function createReport(attrs: Partial<Report> = {}): Report {
  const id = attrs.id ?? String(reports.length + 1)
  const type = attrs.type ?? (['10-K', '10-Q'][Math.floor(Math.random() * 2)] as string)
  const year = attrs.year ?? (2020 + Math.floor(Math.random() * 6))
  const version = attrs.version ?? (Math.floor(Math.random() * 3) + 1)
  const description = attrs.description ?? `${type} filing for fiscal year ${year}`

  const report: Report = { id, type, year, version, description }
  reports.push(report)
  return report
}

export function createComparison(attrs: Partial<Comparison> = {}): Comparison {
  const sections = [
    'Revenue Recognition',
    'Operating Expenses',
    'Cash Flow Analysis',
    'Risk Factors',
    'Balance Sheet Summary',
    'Equity Compensation',
  ]
  
  const id = attrs.id ?? String(comparisons.length + 1)
  const report_type = attrs.report_type ?? (['10-K', '10-Q'][Math.floor(Math.random() * 2)] as string)
  const section_name = attrs.section_name ?? (sections[Math.floor(Math.random() * sections.length)] as string)
  const year1 = attrs.year1 ?? (2022 + Math.floor(Math.random() * 2))
  const year2 = attrs.year2 ?? (year1 + 1)

  const comparison: Comparison = { id, report_type, section_name, year1, year2 }
  comparisons.push(comparison)
  return comparison
}

// Data access functions
export function getAllReports(): Report[] {
  return reports
}

export function getReportById(id: string): Report | undefined {
  return reports.find(r => r.id === id)
}

export function addReport(report: Report): Report {
  reports.push(report)
  return report
}

export function deleteReport(id: string): boolean {
  const index = reports.findIndex(r => r.id === id)
  if (index !== -1) {
    reports.splice(index, 1)
    return true
  }
  return false
}

export function getAllComparisons(): Comparison[] {
  return comparisons
}

export function getComparisonById(id: string): Comparison | undefined {
  return comparisons.find(c => c.id === id)
}

export function addComparison(comparison: Comparison): Comparison {
  comparisons.push(comparison)
  return comparison
}

export function deleteComparison(id: string): boolean {
  const index = comparisons.findIndex(c => c.id === id)
  if (index !== -1) {
    comparisons.splice(index, 1)
    return true
  }
  return false
}

// Seed data
export function seedData(): void {
  reports = []
  comparisons = []
  
  // Create 5 reports
  for (let i = 0; i < 5; i++) {
    createReport()
  }
  
  // Create 6 comparisons
  for (let i = 0; i < 6; i++) {
    createComparison()
  }
}

// Reset data (useful for testing)
export function resetData(): void {
  reports = []
  comparisons = []
}

// Create comparison stream steps
export function createComparisonSteps(attrs: Partial<Comparison>): TimelineStep[] {
  const { report_type, section_name, year1, year2 } = attrs
  
  return [
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
}
