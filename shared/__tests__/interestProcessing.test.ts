import { describe , it, expect } from 'vitest'
import { stringifyInterests, atomiseInterests } from './../utils/interestProcessing'

describe ('Stringify interests', () => {
  it('should compress a string array into a flat string', () => {
  const fakeInterests = ['Ponies', 'Cats', "Action films"]
  const result = stringifyInterests(fakeInterests)
  expect(result).toBe('Ponies,Cats,Action films')
  })
})

describe ('Atomise interests', () => {
  it('should create an array from csv interest tags', () => {
    const fakeInterests = 'Ponies, Cats, Action films'
    const result = atomiseInterests(fakeInterests)
    expect(result).toEqual(['Ponies', 'Cats', 'Action films'])
  })

  it('should handle missing spaces and odd casing', () => {
    const fakeInterests = 'ponies,cats,  Action films'
    const result = atomiseInterests(fakeInterests)
    expect(result).toEqual(['ponies', 'cats', 'Action films'])
  })

  it('should return an empty array if given null, undefined or empty text', () => {
    expect(atomiseInterests(null)).toEqual([])
    expect(atomiseInterests('')).toEqual([])
  })
})

describe('Stringify interests edge cases', () => {
  it('should return empty string if input is not an array', () => {
    // @ts-ignore
    expect(stringifyInterests(null)).toBe('')
    // @ts-ignore
    expect(stringifyInterests('not-an-array')).toBe('')
  })
})