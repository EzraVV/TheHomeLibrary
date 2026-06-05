import { describe , it, expect } from 'vitest'
import { generateSortTitle, normaliseAuthorName, flattenText, prepareForHash, prepareForSearchIndex, cleanBookTitle } from '../utils/formatters'

describe ('Generate Sort Title', () => {
  it('should invert a with main title', () => {
  const fakeTitle = 'A game of thrones'
  const result = generateSortTitle(fakeTitle)
  expect(result).toBe('game of thrones, A')
})

  it('should invert The with main title', () => {
  const fakeTitle = 'The game of thrones'
  const result = generateSortTitle(fakeTitle)
  expect(result).toBe('game of thrones, The')
})

  it('should invert An with main title', () => {
    const fakeTitle = 'An endgame of thrones'
    const result = generateSortTitle(fakeTitle)
    expect(result).toBe('endgame of thrones, An')
  })

  it('should return the original title if it does not start with an article', () => {
    const fakeTitle = 'Game of Thrones'
    const result = generateSortTitle(fakeTitle)
    expect(result).toBe('Game of Thrones')
  })
})

describe ('Normalise Author Name', () => {
  it('should reverse last name, firstname', () =>{
    const author = 'Surname, Forename'
    const result = normaliseAuthorName(author)
    expect(result).toBe('forename surname')
  })

  it('should ignore initials', () =>{
    const author = 'Jerome K. Jerome'
    const result = normaliseAuthorName(author)
    expect(result).toBe('jerome k. jerome')
  })
})

describe ('Clean Book Title', () => {
  it('should remove trailing editions, dashes etc', () =>{
    const title = 'Dune 5th volume'
    const result = cleanBookTitle(title)
    expect(result).toBe('Dune')
  })

  it('should ignore redundant ordinal prefix ', () =>{
    const title = 'Tristram Shandy 5th edition'
    const result = cleanBookTitle(title)
    expect(result).toBe('Tristram Shandy')
  })
})

describe ('Flatten Text', () => {
  it('should change to lowercase, remove accents', () =>{
    const title = 'Māori music'
    const result = flattenText(title)
    expect(result).toBe('maori music')
  })
})

describe ('Prepare for hash', () => {
  it('should clear format/volume info,flatten accents, remove spaces for unique id', () =>{
    const title = 'Māori Music'
    const creator = 'Dalvanius Prime'

    const result = prepareForHash(title, creator)

    expect(result).toBe('maorimusicdalvaniusprime')
  })
})

describe ('Prepare for search index', () => {
  it('should change to lowercase, remove accents', () =>{
    const title = 'Māori music'
    const creator = 'Dalvanius Prime'
    const cleanIsbn = ''

    const result = prepareForSearchIndex(title, creator, cleanIsbn)
    expect(result).toBe('maori music dalvanius prime')
  })
})

describe('Formatter edge cases', () => {
  it('should handle falsy values elegantly', () => {
    // @ts-expect-error - exercising invalid runtime input
    expect(flattenText(null)).toBe('')
    // @ts-expect-error - exercising invalid runtime input
    expect(cleanBookTitle(null)).toBe('')
    // @ts-expect-error - exercising invalid runtime input
    expect(normaliseAuthorName(null)).toBe('')
    // @ts-expect-error - exercising invalid runtime input
    expect(generateSortTitle(null)).toBe('')
  })

  it('should handle prepareForHash with missing creator', () => {
    const result = prepareForHash('Dune 1st volume', null)
    expect(result).toBe('dune')
  })

  it('should handle prepareForSearchIndex with missing creator or isbn', () => {
    const result = prepareForSearchIndex('Māori Music', null, null)
    expect(result).toBe('maori music')
  })
})