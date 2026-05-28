import { expect, it, describe, vi, beforeEach, afterEach} from 'vitest'
import { isOldEnoughToRegister } from '../utils/ageValidator'

describe('validate age utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });


  it('should validate a user who turns 18 today', () => {
    const fakeUserBirthdate = '2008-06-15'
    const result = isOldEnoughToRegister(fakeUserBirthdate)
    expect(result).toBe(true)
  })

  it('should reject a user turns 18 tomorrow', () => {
    const fakeUserBirthdate = '2008-06-16'
    const result = isOldEnoughToRegister(fakeUserBirthdate)
    expect(result).toBe(false)
  })

  it('should reject an invalid birthdate string', () => {
    const result = isOldEnoughToRegister('not-a-date')
    expect(result).toBe(false)
  })

  it('should validate a user whose 18th birthday was earlier this year', () => {
    const fakeUserBirthdate = '2008-01-01'
    const result = isOldEnoughToRegister(fakeUserBirthdate)
    expect(result).toBe(true)
  })

  it('should reject a user who turns 18 later this year in a subsequent month', () => {
    const fakeUserBirthdate = '2008-12-31'
    const result = isOldEnoughToRegister(fakeUserBirthdate)
    expect(result).toBe(false)
  })
})