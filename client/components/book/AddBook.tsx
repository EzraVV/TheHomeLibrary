import { useState } from 'react'
import { useAddBookSearch, useAddBook } from '../../hooks/useBooks'
import BookForm from './BookForm' 
import { CleanBookResult } from '../../../models/book'
//Manages search query state, cascading hook, display matches.
//Hopefully a user can click on a match and get those details.

export function AddBook() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<CleanBookResult | null>(null)

  //Join query and mutation
  const { data: searchResult, isLoading: isSearching } = useAddBookSearch(searchQuery)
  const { mutate: saveBookToDb, isPending: isSaving} = useAddBook() //Pending because mutation fn

  const lookupMatches = searchResult?.data || []
  const matchSource = searchResult?.source

  const handleCreateRecord = (formData: CleanBookResult) => {
    saveBookToDb(formData, {
      onSuccess: () => {
        alert('Book listed in library')
        setSelectedBook(null)
        setSearchQuery('')
      },
      onError: () => alert('Failed to save book.')
    })
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
            {lookupMatches.map((book:CleanBookResult, i:any) => (
              <li key={i}>
                <span><strong>{book.title}</strong> by {book.creator}</span>
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
        onSubmit={handleCreateRecord} 
        isSaving={isSaving}
      />
    </div>

    </div>
  )
}