import connection from './connection'
import type { Book } from '../../models/book'
import generateWorkId from '../utils/generateWorkId'


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

export async function updateBook(book_id: string, userId: string, updatedFields: Partial<Book>): Promise<Book | null> {
  const manualUpdates = {
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
 
  const [bookData] = await connection('book')
  .where({book_id: id, owner_id: userId})
  .update(manualUpdates)
  .returning('*')
  if (!updatedBook) {
    throw new Error('Unauthorised or Book not found');
  }

  return updatedBook;
}


export async function addBook(newBookData: Omit<Book, 'book_id'>): Promise<Book> {
  const dataToInsert = {
    ...newBookData,
    work_id: newBookData.work_id || await generateWorkId(newBookData)
  };
  try {  
    const [newBook] = await connection('book')
    .insert(dataToInsert)
    .returning('*')
    return newBook
  } catch (err) {
    console.error('Database insertion error', err)
    throw err
  }
} 
