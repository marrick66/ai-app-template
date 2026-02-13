import { describe, it, expect, beforeEach } from 'vitest'
import { resetData, seedData, getAllReports, getAllComparisons } from '../src/mock/data'

describe('Mock Data', () => {
  beforeEach(() => {
    resetData()
  })

  it('should seed initial data', () => {
    seedData()
    
    const reports = getAllReports()
    const comparisons = getAllComparisons()
    
    expect(reports).toHaveLength(5)
    expect(comparisons).toHaveLength(6)
  })

  it('should create reports with correct structure', () => {
    seedData()
    
    const reports = getAllReports()
    const report = reports[0]
    
    expect(report).toHaveProperty('id')
    expect(report).toHaveProperty('type')
    expect(report).toHaveProperty('year')
    expect(report).toHaveProperty('version')
    expect(report).toHaveProperty('description')
  })

  it('should create comparisons with correct structure', () => {
    seedData()
    
    const comparisons = getAllComparisons()
    const comparison = comparisons[0]
    
    expect(comparison).toHaveProperty('id')
    expect(comparison).toHaveProperty('report_type')
    expect(comparison).toHaveProperty('section_name')
    expect(comparison).toHaveProperty('year1')
    expect(comparison).toHaveProperty('year2')
  })
})
