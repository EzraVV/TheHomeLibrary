import connection from './connection'
import type { Book } from '../../models/book'

export async function getAllBooks(): Promise<Book[]> {
  return connection('book').select()
}

export async function getBookById(id: string): Promise<Book | undefined> {
  return connection('book').where({ id }).first()
}

export async function getBookByTitle(title: string): Promise<Book | undefined> {
  return connection('book').where({ title }).first()
}
