import { useEffect, useRef, useState } from 'react'
import { useAddBookSearch, useAddBook, useBookEditions } from '../../hooks/useBooks'
import BookForm from './BookForm' 
import { Book, BookFormData, SelectableBook } from '../../../models/book'
import { generateWorkId } from '../../../server/utils/generateWorkId'
import { normaliseBookPayload } from '../../../shared/utils/normaliseBookPayload'
import { IngestionPayload } from '../../apis/books'

export function AddBook() {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<SelectableBook | null>(null)
  
  //Track a search map when multiple isbns to choose from, track selected work.
  const [bookWithPendingIsbnChoice, setBookWithPendingIsbnChoice] = useState<SelectableBook | null>(null)
  const [activeWorkId, setActiveWorkId] = useState<string | undefined>(undefined)

  //Join query and mutation hooks
  const { data: searchResult, isLoading: isSearching } = useAddBookSearch(searchQuery)
  const { data: harvestedIsbns, isLoading: isHarvesting } = useBookEditions(activeWorkId);
  const bookMutation = useAddBook()
  const isSaving = bookMutation.isPending
  
  //Debounce
  useEffect(() => {
    // If the input is too short, skip the API entirely
    if (inputValue.trim().length <= 2) {
      setSearchQuery('')
      return
    }

    // Single network window timer
    const handler = setTimeout(() => {
      setSearchQuery(inputValue.trim())
    }, 600) 

    // Clean-up before every single key strike
    return () => {
      clearTimeout(handler)
    }
  }, [inputValue])

  //Process lazy-harvested sub-editions
  useEffect(() => {
    if (activeWorkId && harvestedIsbns && bookWithPendingIsbnChoice) {
      if (harvestedIsbns.length > 0) {
        setBookWithPendingIsbnChoice(prev => {
          if (!prev) return null;
          return {
            ...prev, // carry over values please
            availableIsbns: harvestedIsbns,
            isbn: harvestedIsbns[0]
          };
        });
      } else {
        //No ISBN entries discovered, bypass sub menus and proceed to form
        setSelectedBook({
          ...bookWithPendingIsbnChoice,
          isbn: ''
        });
        setBookWithPendingIsbnChoice(null);
      }
      // Stop tracking the active work query once it has successfully compiled
      setActiveWorkId(undefined);
    }
  }, [harvestedIsbns, activeWorkId, bookWithPendingIsbnChoice]);

  const localMatches = Array.isArray(searchResult?.localData)
    ? searchResult.localData.map((b: any) => normaliseBookPayload(b, 'local'))
    : [];

  const externalMatches = Array.isArray(searchResult?.externalData)
    ? searchResult.externalData.map((b: any) => 
        normaliseBookPayload(b, searchResult?.externalSource || 'none')
      )
    : [];
    
  const lookupMatches: SelectableBook[] = [...localMatches, ...externalMatches];

  //Intercept list selections
  const handleSelectBookMatch = (book: SelectableBook) => {
    if (book.availableIsbns && book.availableIsbns.length > 1) {
      setBookWithPendingIsbnChoice(book)
    } else if (book.source === 'openlibrary' && book.work_id) {
        setBookWithPendingIsbnChoice(book);
        setActiveWorkId(book.work_id);
    } else {
      // Completely isolated custom record fallback
      setSelectedBook({
        ...book,
        isbn: book.isbn === 'No ISBN determined' ? '': book.isbn
      })
      setBookWithPendingIsbnChoice(null)
    }
  }
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
  const cleanIsbn = formData.isbn ? formData.isbn.trim() : ''
  const isMissingIsbn = !cleanIsbn || cleanIsbn === 'No ISBN determined' || cleanIsbn === 'No ISBN'
  
  if ((source ==='openlibrary' || source === 'google') && !formData.edition_name) {
    if (!isMissingIsbn) {
        return handleIngestRecord({ type: 'isbn', identifier: cleanIsbn })
      } else if (selectedBook?.work_id) {
        return handleIngestRecord({ type: 'openlibrary', identifier: selectedBook.work_id })
      } else if (source === 'google' && selectedBook?.googleVolumeId) {
        return handleIngestRecord({ type: 'google', identifier: selectedBook.googleVolumeId })
      }
    }
    return handleCreateRecord(formData)
  }

console.log("=== API CASCADE STREAM DEBUG ===", {
  rawSearchResult: searchResult,
  computedLookupMatches: lookupMatches,
  currentlySelectedBook: selectedBook
});

//Some badly formatted content, sorry!
return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
      <h2>Quick Lookup</h2>
      <p>Search by Title or ISBN to pull details from local database, OpenLibrary or Google Books.</p>
      
      <input 
        type="text"
        placeholder="Search registries..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {isSearching && <div>Crawling external APIs...</div>}

      {/*High-Level Search Results */}
        {lookupMatches.length > 0 && !bookWithPendingIsbnChoice && (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Matches Found ({searchResult?.source} strategy):</div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {lookupMatches.map((book: SelectableBook, i: number) => {
                const uniqueKeyId = `row-${book.source}-${book.work_id || book.googleVolumeId || 'idx'}-${i}`;

                return (
                <li key={uniqueKeyId} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                  
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
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold' }}>{book.title}</span>
                    
                    {/* Badge appears if the aggregated book lives in the local catalogue */}
                    {book.availableIsbns && book.availableIsbns.length > 0 && (book.source === 'local' || book.id) && (
                      <span style={{ 
                        fontSize: '9px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px', 
                        fontWeight: '8px', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f59e0b', // amber-500
                        color: '#fff' 
                      }}>
                        In Catalogue
                      </span>
                    )}
                  </div>
              </div>

               <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>by {book.creator}</div>

                  <button type="button" onClick={() => handleSelectBookMatch(book)}>
                    Select
                  </button>
                </li>
              )
            })}
            </ul>
          </div>
        )}

        {/*Interactive Sub-selector */}
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
            {/* THE BYPASS: Let users push basic data straight to fields without an ISBN selection */}
    <button
      type="button"
      onClick={() => {
        setSelectedBook({
          ...bookWithPendingIsbnChoice,
          isbn: '' // Clear ISBN so it safely forces local manual mode execution path
        })
        setBookWithPendingIsbnChoice(null)
      }}
      style={{ 
        width: '100%', 
        padding: '8px', 
        fontSize: '12px', 
        fontWeight: 'bold',
        backgroundColor: '#0284c7', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        marginBottom: '12px',
        cursor: 'pointer' 
      }}
    >
      ✨ Skip ISBN & Use General Work Details ({bookWithPendingIsbnChoice.creator})
    </button>

    <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
        Or pick a specific registry print edition:
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto', padding: '2px' }}>
        {bookWithPendingIsbnChoice.availableIsbns.map((isbnCode) => (
          <button
            key={isbnCode}
            type="button"
            onClick={() => {
              if (!bookWithPendingIsbnChoice) return;
              setSelectedBook({ ...bookWithPendingIsbnChoice, isbn: String(isbnCode).trim() });
              setBookWithPendingIsbnChoice(null);
            }}
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}
          >
            📋 {isbnCode}
          </button>
        ))}
      </div>
    </div>
  </div>
)}
</div>
{/* RIGHT SECTION: Target Form */}
  <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '40px' }}>
    <h2>Book Specifications</h2>
        <p>Verify before confirming your submission entry.</p>
        
        <BookForm 
          key={`${selectedBook?.source || 'empty'}-${selectedBook?.work_id || selectedBook?.googleVolumeId || 'form'}-${selectedBook?.isbn || 'no-isbn'}`}
          initialValues={selectedBook} 
          onSubmit={formSubmitHandler}
          isSaving={isSaving}
        />
    </div>

    </div>
  )
}