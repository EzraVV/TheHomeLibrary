import { describe , it, expect, vi } from 'vitest'
import { calculateDueDate } from '../utils/calculateDueDate';

describe('calculates new due date', () => {
  it ('should correctly add 2 weeks to a standard fixed date', () => {
    const fakeToday = '2026-01-10T12:00:00.000Z'
    const expectedDueDate = '2026-01-24T12:00:00.000Z'

    const result = calculateDueDate(2, fakeToday)

    expect(result).toBe(expectedDueDate);
  })

  it('should handle month rollovers', () =>{
    const endOfJanuary = '2026-01-28T12:00:00.000Z'
    const expectedDueDate = '2026-02-11T12:00:00.000Z'

    const result = calculateDueDate(2, endOfJanuary)

    expect(result).toBe(expectedDueDate)
  })

  it('should default to today as the starting date if none is provided', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'))
    
    const result = calculateDueDate(3)
    expect(result).toBe('2026-03-22T12:00:00.000Z')
    
    vi.useRealTimers()
  })
})