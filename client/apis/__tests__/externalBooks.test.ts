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

  it('maps OpenLibrary and Google payloads', () => {
    const openLibrary = normaliseBookPayload(
      {
        key: '/works/OL1W',
        title: 'Open Book',
        author_name: ['One', 'Two'],
        isbn: ['978-0-123456-47-2'],
        cover_i: 42,
      },
      'openlibrary',
    )
    const google = normaliseBookPayload(
      {
        id: 'google-id',
        volumeInfo: {
          title: 'Google Book',
          authors: ['Google Author'],
          industryIdentifiers: [{ identifier: '0123456479' }],
          imageLinks: { thumbnail: '/google.jpg' },
        },
      },
      'google',
    )

    expect(openLibrary.work_id).toBe('OL1W')
    expect(openLibrary.creator).toBe('One, Two')
    expect(openLibrary.isbn).toBe('9780123456472')
    expect(google.googleVolumeId).toBe('google-id')
    expect(google.creator).toBe('Google Author')
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
