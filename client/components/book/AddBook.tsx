import { useEffect, useRef, useState } from 'react'
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
  googleVolumeId?:string
  availableIsbns?: string[]
}

export function AddBook() {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<SelectableBook | null>(null)
  
  //Track a selected search map when multiple isbns to choose from
  const [bookWithPendingIsbnChoice, setBookWithPendingIsbnChoice] = useState<SelectableBook | null>(null)

  const debounceTimeout = useRef <number | null>(null)

  //Join query and mutation
  const { data: searchResult, isLoading: isSearching } = useAddBookSearch(searchQuery)
  const bookMutation = useAddBook()
  const isSaving = bookMutation.isPending
  
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = window.setTimeout(() => {
      setSearchQuery(inputValue)
  }, 500)
  return () =>{
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
  }
  }, [inputValue])


  const lookupMatches: SelectableBook[] = (searchResult?.data || []).map((book) => {
    const embeddedIsbns: string[] =[];
    if (Array.isArray(book.ia)) {
      book.ia.forEaach((tag:string) => {
        if (tag.startsWith('isbn_')) {
          const cleanIsbn = tag.replace('isbn_', '').trim()
          if (cleanIsbn && !embeddedIsbns.includes(cleanIsbn)) {
            embeddedIsbns.push(cleanIsbn)
          }
        }
      })
    }
    return {
    ...book,
    source: searchResult?.source,
    googleVolumeId: searchResult?.source==='google' ? book.id: undefined,
    availableIsbns: embeddedIsbns
  }
})
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

//Intercept selection to check whether ISBN target needs to be refined 
const handleSelectBookMatch = (book: SelectableBook) => {
  //Prompt to select from available
  if(book.availableIsbns && book.availableIsbns.length > 0) {
    setBookWithPendingIsbnChoice(book)
  } else {
    setSelectedBook(book)
    setBookWithPendingIsbnChoice(null)
  }
}

const handlePickSpecificIsbn = (isbn: string) => {
  if (!bookWithPendingIsbnChoice) return

  const completeSelection: SelectableBook = {
    ...bookWithPendingIsbnChoice,
    isbn: isbn
  }
  setSelectedBook(completeSelection)
  setBookWithPendingIsbnChoice(null)
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
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {isSearching && <div>Crawling external APIs...</div>}

      {/*High-Level Search Results */}
        {lookupMatches.length > 0 && !bookWithPendingIsbnChoice && (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Matches Found via {matchSource}</div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {lookupMatches.map((book: SelectableBook, i: number) => (
                <li key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                  
                  <div className="book-cover-thumbnail" style={{ width: '50px', height: '75px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{book.title}</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>by {book.creator}</div>
                    {book.availableIsbns && book.availableIsbns.length > 0 && (
                      <span style={{ fontSize: '11px' }}>
                        ({book.availableIsbns.length} copies matched)
                      </span>
                    )}
                  </div>

                  <button type="button" onClick={() => handleSelectBookMatch(book)}>
                    Select
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/*Interactive Inline ISBN Sub-selector */}
        {bookWithPendingIsbnChoice && bookWithPendingIsbnChoice.availableIsbns && (
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Verify Your Print Copy</h3>
              <button type="button" style={{ fontSize: '11px' }} onClick={() => setBookWithPendingIsbnChoice(null)}>
                ← Back
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
              We found multiple ISBN prints for <strong>{bookWithPendingIsbnChoice.title}</strong> inside this registry record. Match the one on your copy:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '160px', overflowY: 'auto', padding: '2px' }}>
              {bookWithPendingIsbnChoice.availableIsbns.map((isbnCode) => (
                <button
                  key={isbnCode}
                  type="button"
                  onClick={() => handlePickSpecificIsbn(isbnCode)}
                  style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                >
                  📋 {isbnCode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SECTION: Target Form */}
      <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '40px' }}>
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