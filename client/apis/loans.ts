import request from 'superagent'
import { Loan } from '../../models/loan'
import { withAccessToken } from '../lib/authenticatedRequest'

const baseUrl = '/api/v1/loans'

export async function searchLoans(query: string): Promise<Loan[]> {
  const response = await withAccessToken(request.get(`${baseUrl}/search`).query({ query }))

  if(!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data: Loan[] = await response.body
  return data
}

// GET all loans (Admin)
export async function getAllLoans(): Promise<Loan[]> {
  const response = await withAccessToken(request.get(baseUrl))
  return response.body
}

export async function updateLoan(loan_id: string, updatedFields: Partial<Loan>) {
  const response = await withAccessToken(request.patch(`${baseUrl}/${loan_id}`).send(updatedFields))
  return response.body
}

export interface CreateLoanRequest {
  book_id: string
  due_at?: string
}

// ADD loan
export async function createLoan(newLoan: CreateLoanRequest) {
  const response = await withAccessToken(request.post(`${baseUrl}/add`).send(newLoan))
  return response.body 
}
