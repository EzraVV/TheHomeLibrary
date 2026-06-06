import connection from './connection'
import { Loan } from '../../models/loan'

console.log('--- Loading loan.ts ---');
const userTable = 'profiles';
const loanTable = 'loan';
console.log('loanTable defined as:', loanTable);

export async function searchLoans(query: string, userId: string) {
  const q = query.trim()
  

let queryBuilder = connection('loan')
    .select(
      'loan.*', 
      'book.title', 
      'book.image', 
      'borrower.user_name as borrower_name',
      'owner.user_name as owner_name'
    )
    .leftJoin('book', 'loan.book_id', 'book.book_id')
    .leftJoin(`${userTable} as borrower`, 'loan.borrower_id', 'borrower.user_id')
    .leftJoin(`${userTable} as owner`, 'loan.owner_id', 'owner.user_id')
    .where('loan.is_deleted', false)
    .andWhere((builder) => {
      builder.where('loan.owner_id', userId).orWhere('loan.borrower_id', userId)
    })

  // Add search filter
  if (q.length > 0) {
    queryBuilder = queryBuilder.andWhere((builder) => {
      builder.where('book.title', 'like', `%${q}%`)
             .orWhere('borrower.user_name', 'like', `%${q}%`)
             .orWhere('owner.user_name', 'like', `%${q}%`)
    })
  }
  return await queryBuilder
}

// Create loan
export async function createLoan(newLoanData: any): Promise<Loan> {
  const [createdLoan] = await connection(loanTable)
    .insert(newLoanData)
    .returning('*');
  return createdLoan;
}

// Update loan
export async function updateLoan(
  id: string,
  updates: Partial<Loan>,
  userId: string,
): Promise<Loan> {
    const [updatedLoan] = await connection(loanTable)
      .where({ loan_id: id, owner_id: userId }) // Only update if owner_id matches!
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      });

 if (!updatedLoan) {
    throw new Error('Unauthorised or Loan not found');
  }

  return updatedLoan;
}


//Admin access to view complete loan history (could limit).
export async function getAllLoans(userId: string) {
  const loans = await connection(loanTable)
    .where({ owner_id: userId })
    .orWhere({ borrower_id: userId })
  return loans
}
