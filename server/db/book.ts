import connection from './connection'
import type { Book } from '../../models/book'

function generateNextBookId(lastId: string | null): string {
  if (!lastId) {
    return 'bk_00001'
  }
  const num = parseInt(lastId.replace('bk_', ''), 10)
  const next = num + 1
  return `bk_${next.toString().padStart(5, '0')}`
}

export async function getAllBooks(): Promise<Book[]> {
  return connection('book').select()
}

export async function getBookById(book_id: string): Promise<Book | undefined> {
  return connection('book').where({ book_id }).first()
}

export async function searchBook(query: string) {
  return connection('book')
    .where('title', 'like', `%${query}%`)
    .orWhere('creator', 'like', `%${query}%`)
    .orWhere('isbn', 'like', `%${query}%`)
}

export async function getBooksByOwner(ownerId: string) {
  return connection('book').where({ owner_id: ownerId })
}

export async function getBookByTitle(title: string): Promise<Book | undefined> {
  return connection('book').where({ title }).first()
}

export async function updateBook(book_id: string, owner_id: string, updatedFields: Partial<Book>): Promise<Book | null> {
  const bookData = await connection('book')
  .where({book_id, owner_id})
  .update(updatedFields)
  .returning('*')
  return bookData[0] ?? null
 }

 export async function addBook(newBookData: Omit<Book, 'book_id'>): Promise<Book> {
  const lastBook = await connection('book').orderBy('book_id', 'desc').first()
  const lastId = lastBook ? lastBook.book_id : null

  const nextBookId = generateNextBookId(lastId)

  try {
    const bookWithId = {
      ...newBookData,
      book_id: nextBookId
    } 
    
    await connection('book').insert(bookWithId)
    return bookWithId
  } catch (err) {
    console.error('Database insertion error', err)
    throw err
  }
 }
