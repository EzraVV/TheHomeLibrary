import { describe, expect, it } from 'vitest'
import { normaliseBookPayload } from '../../../shared/utils/normaliseBookPayload'

describe('normaliseBookPayload', () => {
  it('maps local database fields including book_id', () => {
    const book = normaliseBookPayload(
      {
        book_id: 'bk_00001',
        title: 'Local Book',
        creator: 'Local Author',
        image: '/cover.jpg',
      },
      'local',
    )

    expect(book.book_id).toBe('bk_00001')
    expect(book.isLocal).toBe(true)
    expect(book.image).toBe('/cover.jpg')
  })

  it('maps Google Books metadata used by the add-book confirmation form', () => {
    const google = normaliseBookPayload(
      {
        id: 'google-id',
        volumeInfo: {
          title: 'Google Book',
          authors: ['Google Author'],
          industryIdentifiers: [{ identifier: '0123456479' }],
          imageLinks: { thumbnail: 'http://example.com/google.jpg' },
          description: 'A Google Books description.',
        },
      },
      'google',
    )

    expect(google.googleVolumeId).toBe('google-id')
    expect(google.creator).toBe('Google Author')
    expect(google.image).toBe('https://example.com/google.jpg')
    expect(google.description).toBe('A Google Books description.')
  })

  it('returns safe defaults for malformed input', () => {
    expect(normaliseBookPayload(null, 'none')).toMatchObject({
      title: 'Untitled Edition',
      creator: 'Unknown',
      isbn: '',
      image: '',
    })
  })
})
