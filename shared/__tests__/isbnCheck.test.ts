import { describe , it, expect } from 'vitest'
import { isValidISBN } from '../utils/isbnCheck'

describe('ISBN validation', () => {
  it ('should reject ISBNs of invalid length (9)', () => {
    const fakeISBN = '02-034-0586'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false);
  })

    it ('should reject ISBNs of invalid length (12)', () => {
    const fakeISBN = '02-034-0586-129'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false);
  })

    it ('should reject ISBNs with invalid characters', () => {
    const fakeISBN = '02d-034-0586'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false);
  })

  it('should accept a valid isbn', () =>{
    const fakeISBN = '0-345-24223-8'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(true)
  })
})