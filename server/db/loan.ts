import connection from './connection'
import { Loan } from '../../models/loan'

const userTable = process.env.NODE_ENV === 'test' ? 'user' : 'profiles'

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

export async function searchLoans(query: string, userId: string) {
  const q = query.trim()

  let queryBuilder = connection('loan')
    .select('loan.*', 'book.title as book_title', 'book.image as book_image', 'borrower.user_name as borrower_name',
      'owner.user_name as owner_name' )
    .leftJoin('book', 'loan.book_id', 'book.book_id')
    .leftJoin(`${userTable} as borrower`, 'loan.borrower_id', 'borrower.user_id')
    .leftJoin(`${userTable} as owner`, 'loan.owner_id', 'owner.user_id')
    .where('loan.is_deleted', false)
    .andWhere((builder) => {
      builder.where('loan.owner_id', userId).orWhere('loan.borrower_id', userId)
    })
      if (q.length > 0) {
        queryBuilder = queryBuilder.andWhere(builder => {
          builder.where('book.title', 'like', `%${q}%`)
             .orWhere('borrower.user_name', 'like', `%${q}%`)
             .orWhere('owner.user_name', 'like', `%${q}%`)
    })
  }
  return await queryBuilder
}

// Create loan
export async function createLoan(newLoanData: Omit<Loan, 'loan_id'>): Promise<Loan> {
  if (process.env.NODE_ENV !== 'test') {
    const rows = await connection('loan').insert(newLoanData).returning('*')
    return rows[0]
  }

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
export async function getAllLoans(userId: string) {
  const loans = await connection('loan')
    .select(
      'loan.*',
      'book.title as book_title',
      'book.image as book_image',
      'borrower.user_name as borrower_name',
      'owner.user_name as owner_name',
    )
    .leftJoin('book', 'loan.book_id', 'book.book_id')
    .leftJoin(`${userTable} as borrower`, 'loan.borrower_id', 'borrower.user_id')
    .leftJoin(`${userTable} as owner`, 'loan.owner_id', 'owner.user_id')
    .where('loan.is_deleted', false)
    .andWhere((builder) => {
      builder.where('loan.owner_id', userId).orWhere('loan.borrower_id', userId)
    })
  return loans
}
