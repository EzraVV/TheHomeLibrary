import connection from './connection'
import type { Loan } from '../../models/loan'

const NOT_DELETED = { 'book.deleted_at': null}
const NOT_ARCHIVED = { 'loan.archived_at': null}

// services/dashboardService.ts
export const getAdminInventory = async () => {
  return connection('book')
    .leftJoin('loan', 'book.id', 'loan.book_id')
    .select('book.*', 'loan.status', 'loan.due_at')
    .where('book.deleted_at', null); 
};


export const getActiveLoans = async () => {
  return connection('loan')
    .join('book', 'loan.book_id', 'book.id')
    .where(NOT_DELETED)
    .andWhere(NOT_ARCHIVED); 
};

export async function searchBook(query: string) {
  return connection('book')
    .where('title', 'like', `%${query}%`)
    .orWhere('creator', 'like', `%${query}%`)
    .orWhere('isbn', 'like', `%${query}%`)
}

export async function getLoanById(id: string) {
  const loan = await connection('loan').where({ loan_id: id }).first()
  return loan || null
}

export async function createLoan(newUser: User): Promise<User> {
  const rows = await connection('user').insert(newUser).returning('*')

  return mapUser(rows[0])
}

export function generateNextUserId(lastId: string | null): string {
  if (!lastId) {
    return 'u_00001'
  }

  const num = parseInt(lastId.replace('u_', ''), 10)
  const next = num + 1

  return `u_${next.toString().padStart(5, '0')}`
}

export async function updateLoan(
  id: string,
  updates: Partial<Loan>,
): Promise<Loan> {
  await connection('loan')
    .where({ loan_id: id })
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })

  // Fetch
  const updatedLoan = await connection('loan').where({ loan_id: id }).first()

  return updatedLoan
}


//Admin access to view complete loan history (would you want to though?)
export async function getAllLoans() {
  const loans = await connection('loan')
  return loans
}


/*
export async function searchNotifications() {
  const notices = await connection('loan')
    .where('user_name', 'like', `%${query}%`)
    .orWhere('email', 'like', `%${query}%`)
    .orWhere('interests', 'like', `%${query}%`)
    .orWhere('postcode', 'like', `%${query}%`)
    .andWhere('is_deleted', false)

  return users.map(mapUser)
}*/