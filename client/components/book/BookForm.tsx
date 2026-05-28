import React, { useState, useEffect } from 'react'
import { Book, BookFormProps, Status } from '../../../models/book'
//Component jst takes metadata and maps to state, then fires submission call back
 

export default function BookForm({initialValues, onSubmit, isSaving}: BookFormProps) {
//Set up state from variables, expand these to eventually work for book fully
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')//One day will be able to convey illustrator, editor etc
  const [isbn, setIsbn] = useState('')
  const [status, setStatus] = useState<Status>('Available')
  const [edition, setEdition] = useState('')
  const [format, setFormat] = useState('')
  const [image_urls, setImageUrls] = useState('')

  useEffect(() => {
    if(initialValues) {
      setTitle(initialValues.title || '')
      setCreator(initialValues.creator || '')
      setIsbn(initialValues.isbn || '')
      setStatus(initialValues.status || 'Available')
      setEdition(initialValues.edition || '')
      setFormat(initialValues.format || 'Paperback')
      setImageUrls(initialValues.image_urls || '')
    }
  }, [initialValues])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({title, creator, isbn: isbn ||undefined, status, edition, format, image_urls})
  }

  return (
    <form onSubmit={handleFormSubmit} className="book-form-layout">
      {image_urls && (
        <div className="form-image-preview">
          <img src={image_urls} alt="Cover layout preview" style={{ maxWidth: '100px', borderRadius: '4px' }} />
        </div>
      )}
    <div>
    <label>Book Title *</label>
    <input 
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      />
    </div>

      <div>
    <label>Author/Creator *</label>
    <input 
      type="text"
      value={creator}
      onChange={(e) => setCreator(e.target.value)}
      />
    </div>

    <div>
        <label>ISBN</label>
    <input 
      type="text"
      value={isbn}
      onChange={(e) => setIsbn(e.target.value)}
      />
    </div>

    <div>
      <label>Edition</label>
      <input 
        type="text"
        placeholder="e.g. Deluxe, Standard, Abridged"
        value={edition}
        onChange={(e) => setEdition(e.target.value)}
        />
    </div>

    <div>
      <label>Format</label>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="Paperback">Paperback</option>
        <option value="Hardcover">Hardcover</option>
        <option value="Graphic Novel">Graphic Novel</option>
        <option value="Audiobook">Audiobook</option>
      </select>
    </div>  

    <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value="Available">Available</option>
          <option value="On loan">On loan</option>
          <option value="In transit">In transit</option>
          <option value="Reserved">Reserved</option>
        </select>
      </div>

      <div>
        <label>Cover Image URL</label>
        <input 
          type="text"
          value={image_urls}
          onChange={(e) => setImageUrls(e.target.value)}
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

