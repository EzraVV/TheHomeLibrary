import { describe , it, expect } from 'vitest'
import { calculateDueDate } from '../utils/calculateDueDate';

describe('calculates new due date', () => {
  it ('should correctly add 2 weeksto a standard fixed date', () => {
    const fakeToday = '2026-01-10-T12:00:00:000Z'
    const expectedDueDate = '2026-01-24-T12:00:00:000Z'

    const result = calculateDueDate(2, fakeToday)

    expect(result).toBe(expectedDueDate);
  })

  it('should handle month rollovers', () =>{
    const endOfJanuary = '2026-01-28T12:00:00:000Z'
    const expectedDueDate = '2026-02-11T12:00:00:000Z'

    const result = calculateDueDate(2, endOfJanuary)

    expect(result).toBe(expectedDueDate)
  })
})