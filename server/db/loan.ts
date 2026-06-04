import connection from './connection'
import { Loan } from '../../models/loan'
import { updateWithTimestamp } from '../utils/updateWithTimestamp'

const activeOnly = (query: any) => query.where('is_deleted', false);

function generateNextLoanId(lastId: string | null): string {
  if (!lastId) {
    return 'ln_00001'
  }
  const num = parseInt(lastId.replace('ln_', ''), 10)
  const next = num + 1
  return `bk_${next.toString().padStart(5, '0')}`
}


//Admin only
export async function getAllLoans() {
  const loans = await connection('loan')
  return loans
}

export async function getLoanById(id: string) {
  const loan = await connection('loan').where({ loan_id: id }).first()
  return loan 
}

export async function searchLoans(query: string) {
  return await connection('loan')
    .select('loan.*', 'book.title', 'book.image', 'borrower.user_name as borrower_name',
      'owner.user_name as owner_name' )
    .leftJoin('book', 'loan.book_id', 'book.book_id')
    .leftJoin('user', 'loan.borrower_id', 'user.user_id')
    .where(builder => {
      builder.where('book.title', 'like', `%${query}%`)
       .orWhere('borrower.user_name', 'like', `%${query}%`)
       .orWhere('owner.user_name', 'like', `%${query}%`);
    })
  .where(activeOnly)
}

export async function createLoan(newLoan: Loan): Promise<Loan[]> {
  const loan = await connection('loan').insert(newLoan).returning('*')
  return loan
}

export async function updateLoan(
  id: string,
  updates: Partial<Loan>,
): Promise<Loan> {
  // Update
  await connection('loan')
    .where({ loan_id: id })
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })

  // Fetch
  const updated = await connection('user').where({ loan_id: id }).first()
  return updated
}

