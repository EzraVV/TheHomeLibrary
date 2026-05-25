import { expect, it, describe, vi, beforeEach, afterEach} from 'vitest'
import { isOldEnoughToRegister } from '../utils/ageValidator'

describe('validate age utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
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
})