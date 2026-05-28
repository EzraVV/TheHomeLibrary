import connection from './connection'
import type { Book } from '../../models/book'

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

export async function updateBook(book_id: string, updatedFields: Partial<Book>): Promise<Book> {
  const bookData = await connection('book')
  .where({book_id})
  .update(updatedFields)
  .returning('*')
  return bookData[0] ?? null
 }

 export async function addBook(newBookData: Omit<Book, 'book_id'| 'book_id'>): Promise<string>{
  try {
    const [insertedId] = await connection('book')
    .insert(newBookData)
    return insertedId as unknown as string
  } catch (err) {
    console.error('Database insertion error', err)
    throw err
  }
 } 