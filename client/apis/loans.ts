import request from 'superagent'
import { Loan } from '../../models/loan'

const baseUrl = '/api/v1/loans'

export async function searchLoans(query: string): Promise<Loan[]> {
  const response = await request.get(`${baseUrl}/search`).query({ query })

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

export async function updateLoan(loan_id: string, updatedFields: Partial<Loan>, userId: string) {
  const response = await request.patch(`${baseUrl}/${loan_id}`)
  .set('x-user-id', userId)
  .send(updatedFields)
  return response.body
}

// ADD loan 
export async function createLoan(newLoan: Omit<Loan, 'loan_id' | 'owner_id'>, ownerUserId: string) {
  const response = await request
    .post(`${baseUrl}/add`)
    .set('x-user-id', ownerUserId)
    .send(newLoan)
  return response.body 
}
