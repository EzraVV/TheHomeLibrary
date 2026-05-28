import { useState } from 'react'
import { useAddBookSearch, useAddBook } from '../../hooks/useBooks'
import BookForm from './BookForm' 
import { Book, BookFormData } from '../../../models/book'
import { isValidISBN } from '../../../shared/utils/isbnCheck'
import { generateWorkId } from '../../../server/utils/generateWorkId'
import { IngestionPayload } from '../../apis/books'
//Manages search query state, cascading hook, display matches.
//Hopefully a user can click on a match and get those details.

type SelectableBook = Partial<Book> & {
  source?: 'local' | 'openLibrary' | 'google' | 'none'
  googleVolumeId?:string}

export function AddBook() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<SelectableBook | null>(null)

  //Join query and mutation
  const { data: searchResult, isLoading: isSearching } = useAddBookSearch(searchQuery)
  const bookMutation = useAddBook()
  const isSaving = bookMutation.isPending

  const lookupMatches: SelectableBook[] = (searchResult?.data || []).map((book) => ({
    ...book,
    source: searchResult?.source,
    googleVolumeId: searchResult?.source==='google' ? book.id: undefined
  }))
  const matchSource = searchResult?.source

  const handleCreateRecord = async (formData: BookFormData) => {
    let finalWorkId = selectedBook?.work_id || selectedBook?.googleVolumeId 
    
    if (!finalWorkId) {
      finalWorkId = await generateWorkId(formData.title, formData.creator);
    }

    const completeBookPayload: Partial<Book> = {
      ...formData,
      owner_id: 'u_00001', //Pull from auth

      work_id: finalWorkId,

      condition: formData.condition|| 'Good',
      search_index: `${formData.title.toLowerCase()} ${formData.creator.toLowerCase()}`,
      lending_terms: formData.lending_terms || '',

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    bookMutation.mutate(
      {mode: 'manual', payload: completeBookPayload },
    {
      onSuccess: () => {
        alert('Book listed in library manually')
        setSelectedBook(null)
        setSearchQuery('')
      },
      onError: () => alert('Failed to save book.')
    })
}

  const handleIngestRecord = (payload: IngestionPayload) => {
    
    bookMutation.mutate(
      {mode: 'ingest', payload: payload },
    {
      onSuccess: () => {
        alert('Book ingested from external registry')
        setSelectedBook(null)
        setSearchQuery('')
      },
      onError: () => alert('Failed to ingest book with this ISBN. Try manual form entry.')
    })
}

const formSubmitHandler = (formData: BookFormData) => {
  const source = selectedBook?.source 
if (source ==='openLibrary' || source === 'google') {
  if (formData.isbn) {
      return handleIngestRecord({ type: 'isbn', identifier: formData.isbn })
    } else if (selectedBook && selectedBook?.work_id) {
      return handleIngestRecord({ type: 'openlibrary', identifier: selectedBook.work_id })
    } else if (source === 'google' && selectedBook?.id) {
      return handleIngestRecord({ type: 'google', identifier: selectedBook.id })
    }
  }
  return handleCreateRecord(formData)
}

//Some unformatted content, sorry!
return (
    <div>

    <div>
      <h2>Quick Lookup</h2>
      <p>Search by Title or ISBN to pull details from OpenLibrary or Google Books.</p>
      
      <input 
        type="text"
        placeholder="Search global registries..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isSearching && <div>Crawling external APIs...</div>}

      {lookupMatches.length > 0 && (
        <div >
          <div>Matches Found via {matchSource}</div>
          <ul>
            {lookupMatches.map((book:SelectableBook, i:number) => (
              <li key={i}>
          
                <div className="book-cover-thumbnail" style={{ width: '50px', height: '75px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {book.image ? (
                    <img 
                      src={book.image} 
                      alt={`${book.title} cover`} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/default-book-cover.png'
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '10px', color: '#888' }}>No Cover</span>
                  )}
                </div>
                {/*Metadata*/}
                <span><strong>{book.title}</strong> by {book.creator}</span>
                  <div style={{ fontSize: '14px', color: '#555' }}>by {book.creator}</div>
                <button 
                  onClick={() => setSelectedBook(book)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div>
      <h2>Book Specifications</h2>
      <p>Verify before confirming your submission entry.</p>
      
      <BookForm 
        initialValues={selectedBook} 
        onSubmit={formSubmitHandler}
        isSaving={isSaving}
      />
    </div>

    </div>
  )
}