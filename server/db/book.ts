import connection from './connection'
import type { Book } from '../../models/book'

export async function getAllBooks(): Promise<Book[]> {
  return connection('book').select()
}

export async function getBookById(book_id: string): Promise<Book | undefined> {
  return connection('book').where({ book_id }).first()
}

export async function getBookByTitle(title: string): Promise<Book | undefined> {
  return connection('book').where({ title }).first()
}
