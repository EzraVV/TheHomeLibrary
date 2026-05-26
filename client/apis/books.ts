import request from 'superagent'
import { Book } from '../../models/book' //Aspirations
import { CleanBookResult } from '../../models/book'

const baseUrl = '/api/v1/books'

// GET all books
export async function getAllBooks() {
  const res = await request.get(baseUrl)
  return res.body
}

// GET one book by ID
export async function getBookById(id: string) {
  const res = await request.get(`${baseUrl}/${id}`)
  return res.body
}

// SEARCH books
export async function searchBooks(query: string) {
  const res = await request.get(`${baseUrl}/search`).query({ query })
  return res.body
}

// GET books by owner
export async function getBooksByOwner(ownerId: string) {
  const res = await request.get(`${baseUrl}/owner/${ownerId}`)
  return res.body
}

//ADD book (draft, using short model cleanbookresult until i sort default vals,fallbacks etc.
export async function createLocalBook(newBook: CleanBookResult) {
  const response = await request.post('/api/v1/books').send(newBook)
  return response.body
}