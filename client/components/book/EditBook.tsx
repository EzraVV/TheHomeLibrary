import { useEditBook, useGetBookById } from '../hooks/useBooks'
import BookForm from './BookForm'
import { Book, BookFormData } from '../../../models/book'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export function EditBook() {
  const { id } = useParams<{ id: string }>() // Pulling ID from URL
  const { data: selectedBook, error } = useGetBookById(id || '')

  const bookMutation = useEditBook()

  const [searchQuery, setSearchQuery] = useState('')
  console.log('EditBook rendering, searchQuery is:', searchQuery)
  const [stagedBook, setStagedBook] = useState<Book | null>(null)
  const currentFormData = stagedBook || selectedBook

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  console.log('Current Debounced Query:', debouncedQuery)
  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ['book-search', debouncedQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/books/search/metadata?q=${encodeURIComponent(debouncedQuery)}`,
      )
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    },
    enabled: debouncedQuery.length >= 3,
    placeholderData: (previousData) => previousData,
  })

  const handleSelectCandidate = (book: Book) => {
    setStagedBook({
      ...book,
      id: selectedBook?.id,
      owner_id: selectedBook?.owner_id,
    })
  }

  const formSubmitHandler = async (formData: BookFormData) => {
    await bookMutation.mutateAsync({
      mode: 'manual',
      payload: {
        ...formData,
        id: currentFormData?.id,
        owner_id: currentFormData?.owner_id,
      },
    })
  }

  if (error) return <div>Error loading book.</div>

  console.log('Search Result Data:', searchResults)
  return (
    <div className="flex gap-8 items-start p-6">
      {/* LEFT COLUMN: Search & Results */}
      <div className="w-1/2 flex flex-col gap-4">
        <div className="bg-white p-4 border rounded shadow-sm">
          <h3 className="font-bold text-lg mb-2">Overlay Metadata</h3>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Search by title, author or ISBN."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Scrollable area for results: Keeps the form from moving */}
        <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-3">
          {searchResults.map((book: any, i: any) => {
            const creatorDisplay = Array.isArray(book.author_name)
              ? book.author_name.join(', ')
              : book.author_name || book.creator || 'Unknown'

            return (
              <div
                key={book.isbn || i}
                onClick={() =>
                  handleSelectCandidate({ ...book, creator: creatorDisplay })
                }
                className="flex border p-3 rounded shadow-sm hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-16 h-24 object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 mr-4 flex items-center justify-center text-xs text-gray-500">
                    No Cover
                  </div>
                )}

                <div>
                  <h4 className="font-bold">{book.title}</h4>
                  <p className="text-sm text-gray-600">
                    Author:{' '}
                    {Array.isArray(book.author_name)
                      ? book.author_name.join(', ')
                      : book.creator || 'No Author Listed'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Edition: {book.edition_name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: The Form */}
      <div className="w-1/2">
        <div className="sticky top-4">
          <BookForm
            initialValues={currentFormData}
            onSubmit={formSubmitHandler}
            isSaving={bookMutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}
