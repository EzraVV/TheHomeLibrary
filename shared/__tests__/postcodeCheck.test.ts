import { describe , it, expect } from 'vitest'
import { isValidNZPostcode } from '../utils/postcodeCheck'

describe('NZ Postcode validation', () => {
  it ('should reject postcodes of invalid length (5)', () => {
    const fakePostcode = '40586'
    const result = isValidNZPostcode(fakePostcode)
    expect(result).toBe(false);
  })

  it ('should reject postcodes of invalid length (3)', () => {
    const fakePostcode = '586'
    const result = isValidNZPostcode(fakePostcode)
    expect(result).toBe(false);
  })
    it ('should reject Postcodes of invalid format', () => {
    const fakePostcode = 'A129'
    const result = isValidNZPostcode(fakePostcode)
    expect(result).toBe(false);
  })

    it ('should handle extra spaces at end', () => {
    const fakePostcode = '6000 '
    const result = isValidNZPostcode(fakePostcode)
    expect(result).toBe(true);
  })

  it('should accept a valid postcode', () =>{
    const fakePostcode = '1010'
    const result = isValidNZPostcode(fakePostcode)
    expect(result).toBe(true)
  })
})