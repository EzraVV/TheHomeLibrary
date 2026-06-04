import request from 'superagent'
import { Loan } from '../../models/loan'

const baseUrl = '/api/v1/loans'

export async function searchLoans(query: string): Promise<Loan[]> {
  const response = await request.get(`/api/v1/loans?search=${encodeURIComponent(query)}`)

  if(!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data: Loan[] = await response.body
  return data
}

// GET all loans (Admin)
export async function getAllLoans(): Promise<Loan[]> {
  const response = await request.get(baseUrl)
  return response.body
}

// GET one loan by ID
export async function getLoanById(id: string): Promise<Loan> {
  const response = await request.get(`${baseUrl}/${id}`)
  return response.body
}


export async function updateLoan(loan_id: string, updatedFields: Partial<Loan>, userId: string) {
  //TODO: Replace hardcoded user id with one from Auth context
  const response = await request.patch(`/api/v1/loans/${loan_id}/update`)
  .set('x-user-id', userId)
  .send(updatedFields)
  return response.body
}

// ADD loan 
export async function createLoan(newLoan: Loan) {
  //TODO: Replace hardcoded user id with one from Auth context
  const ownerUserId = 'u_00001';
  const borrowerUserId = 'u_00002'
  const response = await request.post('/api/v1/loan').send(newLoan)
  return response.body 
}
