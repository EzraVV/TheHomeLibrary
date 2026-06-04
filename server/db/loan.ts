import connection from './connection'
import { Loan } from '../../models/loan'
import { updateWithTimestamp } from '../utils/updateWithTimestamp'
import { loadEnv } from 'vite';

const activeOnly = (query: any) => query.where('is_deleted', false);
const notArchived = { 'loan.archived_at': null}

function generateNextLoanId(lastId: string | null): string {
  if (!lastId) {
    return 'ln_00001'
  }
  const num = parseInt(lastId.replace('ln_', ''), 10)
  const next = num + 1
  return `ln_${next.toString().padStart(5, '0')}`
}

export async function getLastLoanId(): Promise<string | null> {
  const row = await connection('loan').orderBy('loan_id', 'desc').first()

  return row ? row.loan_id : null
}

export async function searchLoans(query: string) {
  const q = query.trim()

  let queryBuilder = connection('loan')
    .select('loan.*', 'book.title', 'book.image', 'borrower.user_name as borrower_name',
      'owner.user_name as owner_name' )
    .leftJoin('book', 'loan.book_id', 'book.book_id')
    .leftJoin('user as borrower', 'loan.borrower_id', 'borrower.user_id')
    .leftJoin('user as owner', 'loan.owner_id', 'owner.user_id')
    .where(activeOnly)
      if (q.length > 0) {
        queryBuilder = queryBuilder.andWhere(builder => {
          builder.where('book.title', 'like', `%${q}%`)
             .orWhere('borrower.user_name', 'like', `%${q}%`)
             .orWhere('owner.user_name', 'like', `%${q}%`)
    })
  }
  return await queryBuilder
}

// services/dashboardService.ts
export const getAdminInventory = async () => {
  return connection('book')
    .leftJoin('loan', 'book.id', 'loan.book_id')
    .select('book.*', 'loan.status', 'loan.due_at')
    .where('book.deleted_at', null); 
};

// Loans activity
export const getActiveLoans = async () => {
  return connection('loan')
    .join('book', 'loan.book_id', 'book.id')
    .where(activeOnly)
    .andWhere(notArchived); 
};

export async function getLoanById(id: string): Promise<Loan> {
  const loan = await connection('loan').where({ loan_id: id }).first()
  return loan || null
}

// Create loan
export async function createLoan(newLoanData: Omit<Loan, 'loan_id'>): Promise<Loan> {
  return await connection.transaction(async (loan) => {
    const lastRow = await loan('loan').orderBy('loan_id', 'desc').first();
    const lastId = lastRow ? lastRow.loan_id : null;

    const nextId = generateNextLoanId(lastId);
    
    const newLoan = { ...newLoanData, loan_id: nextId };
    await loan('loan').insert(newLoan);
    
    return newLoan;
  });
}

// Update loan
export async function updateLoan(
  id: string,
  updates: Partial<Loan>,
  userId: string,
): Promise<Loan> {
    const count = await connection('loan')
      .where({ loan_id: id, owner_id: userId }) // Only update if owner_id matches!
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      });

    if (count === 0) {
      throw new Error('Unauthorised or Loan not found');
    }
  const updatedLoan = await connection('loan').where({ loan_id: id }).first()
  return updatedLoan
}


//Admin access to view complete loan history (could limit).
export async function getAllLoans() {
  const loans = await connection('loan')
  return loans
}

