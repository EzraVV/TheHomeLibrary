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

  it('should reject non-string input types with custom error objects', () => {
    // @ts-expect-error - exercising invalid runtime input
    const result = isValidISBN(1234567890)
    expect(result).toEqual({ isValid: false, error: 'Input must be a string' })
  })

  it('should accept a valid ISBN-10 ending with X', () => {
    const fakeISBN = '0-9752298-0-X'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(true)
  })

  it('should reject an ISBN-10 ending in X with invalid checksum', () => {
    const fakeISBN = '0-345-24223-X'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false)
  })

  it('should reject an ISBN-10 containing a letter within the first 9 digits', () => {
    const fakeISBN = '02a0340586'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false)
  })

  it('should accept a valid ISBN-13', () => {
    const fakeISBN = '978-0-306-40615-7'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(true)
  })

  it('should reject an ISBN-13 containing a letter in the first 12 digits', () => {
    const fakeISBN = '97803a6406157'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false)
  })

  it('should reject an ISBN-13 with an invalid check digit', () => {
    const fakeISBN = '9780306406150'
    const result = isValidISBN(fakeISBN)
    expect(result).toBe(false)
  })
})