import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'superagent'
import type { Book } from '../../../models/book'
import { getGoogleMetadataForBook } from '../externalApis'

vi.mock('superagent', () => ({
  default: {
    get: vi.fn(),
  },
}))

const book: Book = {
  book_id: 'bk_google_test',
  owner_id: 'u_test',
  title: 'Dune',
  creator: 'Frank Herbert',
  edition_name: 'Local edition',
  work_id: 'local-work',
  isbn: '9780441172719',
  format: 'Paperback',
  condition: 'Good',
  status: 'Available',
  image: '',
  lending_terms: 'Two weeks',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
}

describe('Google Books catalogue metadata', () => {
  afterEach(() => vi.clearAllMocks())

  it('maps Google metadata without replacing local lending fields', async () => {
    vi.mocked(request.get).mockReturnValue({
      query: vi.fn().mockResolvedValue({
        body: {
          items: [
            {
              id: 'google-volume',
              volumeInfo: {
                title: 'Dune',
                authors: ['Frank Herbert'],
                description: 'Google description',
                industryIdentifiers: [{ identifier: '9780441172719' }],
                imageLinks: { thumbnail: 'http://example.com/dune.jpg' },
              },
            },
          ],
        },
      }),
    } as never)

    const metadata = await getGoogleMetadataForBook(book)

    expect(metadata).toMatchObject({
      title: 'Dune',
      creator: 'Frank Herbert',
      description: 'Google description',
      image: 'https://example.com/dune.jpg',
      work_id: 'google-volume',
      isbn: '9780441172719',
    })
    expect(metadata).not.toHaveProperty('owner_id')
    expect(metadata).not.toHaveProperty('condition')
    expect(metadata).not.toHaveProperty('status')
    expect(metadata).not.toHaveProperty('lending_terms')
  })
})
