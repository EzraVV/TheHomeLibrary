import React, { useState, useEffect } from 'react'
import { CleanBookResult, BookFormProps } from '../../../models/book'
//Component jst takes metadata and maps to state, then fires submission call back

export default function BookForm({initialValues, onSubmit, isSaving}: BookFormProps) {
//Set up state from variables, expand these to eventually work for book fully
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')//One day will be able to convey illustrator, editor etc
  const [isbn, setIsbn] = useState('')

  useEffect(() => {
    if(initialValues) {
      setTitle(initialValues.title || '')
      setCreator(initialValues.creator || '')
      setIsbn(initialValues.isbn || '')
    }
  }, [initialValues])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({title, creator, isbn})
  }

  return (
    <form onSubmit={handleFormSubmit}>
    <div>
    <label>Book Title</label>
    <input 
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      />
    </div>

      <div>
    <label>Author/Creator</label>
    <input 
      type="text"
      value={creator}
      onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    <div>
        <label>ISBN</label>
    <input 
      type="text"
      value={isbn}
      onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    <button
      type="submit"
      disabled={isSaving}
      >
        {isSaving ? 'Saving to library...' : 'Save book to shelf'}
      </button>

    </form>
  )
}

