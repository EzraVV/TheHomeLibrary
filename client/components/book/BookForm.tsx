import React, { useState, useEffect } from 'react'
import { BookFormProps, Status } from '../../../models/book'
//Component just takes metadata and maps to state, then fires submission call back
 

export default function BookForm({initialValues, onSubmit, isSaving}: BookFormProps) {
  const fieldClass = 'min-h-11 w-full rounded-sm border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary'
  const labelClass = 'mb-1 block text-sm font-semibold text-text-primary'
//Set up state from variables, expand these to eventually work for book fully
  const [title, setTitle] = useState('')
  const [creator, setCreator] = useState('')//One day will be able to convey illustrator, editor etc
  const [isbn, setIsbn] = useState('')
  const [status, setStatus] = useState<Status>('Available')
  const [work_id, setWorkId] = useState('')
  const [edition_name, setEdition] = useState('')
  const [format, setFormat] = useState('')
  const [image, setImageUrls] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
if (initialValues) {
      setTitle(initialValues.title || '')
      setCreator(initialValues.creator || '')
      setEdition(initialValues.edition_name || '')
      setWorkId(initialValues.work_id || '')
      setFormat(initialValues.format || 'Paperback')
      setImageUrls(initialValues.image || '')
      setStatus(initialValues.status || 'Available')
      setDescription(initialValues.description || '')

      let incomingIsbn = ''
      if (Array.isArray(initialValues.isbn)) {
        incomingIsbn = String(initialValues.isbn[0] || '')
      } else {
        incomingIsbn = String(initialValues.isbn || '')
      }

      if (
        incomingIsbn === 'No ISBN determined' || 
        incomingIsbn === 'No ISBN' || 
        incomingIsbn.trim() === ''
      ) {
        setIsbn('')
      } else {
        setIsbn(incomingIsbn.trim())
      }
    }
  }, [initialValues])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({title, creator, isbn: isbn ||undefined, status, edition_name, work_id, format, image, description})
  }

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {image && (
        <div className="md:col-span-2">
          <img src={image} alt="Cover layout preview" className="h-44 rounded-sm object-cover shadow-card" />
        </div>
      )}
    <div>
    <label htmlFor="book-title" className={labelClass}>Book Title *</label>
    <input 
      id="book-title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className={fieldClass}
      required
      />
    </div>

      <div>
    <label htmlFor="book-creator" className={labelClass}>Author/Creator *</label>
    <input 
      id="book-creator"
      type="text"
      value={creator}
      onChange={(e) => setCreator(e.target.value)}
      className={fieldClass}
      required
      />
    </div>

    <div>
        <label htmlFor="book-isbn" className={labelClass}>ISBN</label>
    <input 
      id="book-isbn"
      type="text"
      value={isbn}
      onChange={(e) => setIsbn(e.target.value)}
      className={fieldClass}
      />
    </div>

    <div className="md:col-span-2">
      <label htmlFor="book-description" className={labelClass}>Description</label>
      <textarea
        id="book-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        className={fieldClass}
      />
    </div>
  

    <div>
      <label htmlFor="book-edition" className={labelClass}>Edition</label>
      <input 
        id="book-edition"
        type="text"
        placeholder="e.g. Deluxe, Standard, Abridged"
        value={edition_name}
        onChange={(e) => setEdition(e.target.value)}
        className={fieldClass}
        />
    </div>

    <div>
      <label htmlFor="book-format" className={labelClass}>Format</label>
      <select id="book-format" value={format} onChange={(e) => setFormat(e.target.value)} className={fieldClass}>
        <option value="Paperback">Paperback</option>
        <option value="Hardcover">Hardcover</option>
        <option value="Graphic Novel">Graphic Novel</option>
        <option value="Audiobook">Audiobook</option>
      </select>
    </div>  

    <div>
        <label htmlFor="book-status" className={labelClass}>Status</label>
        <select id="book-status" value={status} onChange={(e) => setStatus(e.target.value as Status)} className={fieldClass}>
          <option value="Available">Available</option>
          <option value="On loan">On loan</option>
          <option value="In transit">In transit</option>
          <option value="Reserved">Reserved</option>
        </select>
      </div>

      <div>
        <label htmlFor="book-image" className={labelClass}>Cover Image URL</label>
        <input 
          id="book-image"
          type="text"
          value={image}
          onChange={(e) => setImageUrls(e.target.value)}
          className={fieldClass}
        />
      </div>

    <button
      type="submit"
      disabled={isSaving}
      className="min-h-11 rounded-sm bg-primary px-4 py-2 font-semibold text-white hover:opacity-90 md:col-span-2"
      >
        {isSaving ? 'Saving to library...' : 'Save book to shelf'}
      </button>

    </form>
  )
}
