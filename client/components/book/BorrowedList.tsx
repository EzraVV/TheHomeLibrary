import { Link } from 'react-router-dom'
import { Loan } from '../../../models/loan'

interface BorrowedListProps {
  loans: Loan[];
  onUpdate: (id: string, fields: Partial<Loan>) => void
}

// 1. Extracted the Empty State into a sub-component for clarity
function EmptyBorrowedState() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center py-10 border border-dashed border-border/60 rounded-sm bg-background/30 px-4">
      <h3 className="text-sm font-bold text-secondary mb-0.5">You haven’t borrowed any books yet</h3>
      <p className="text-xs text-text-muted mb-4 max-w-[200px]">
        Explore and find books available in the neighborhood library!
      </p>
      <Link
        to="/books/search"
        className="min-h-9 inline-flex items-center gap-1 text-xs rounded-sm bg-primary px-3.5 py-1.5 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90 active:scale-[0.98]"
      >
        Browse Catalog
      </Link>
    </div>
  )
}

export function BorrowedList({ loans, onUpdate }: BorrowedListProps) {
  return (
    <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left w-full h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <h2 className="font-heading text-xl font-bold text-secondary flex items-center gap-2">
          Your requests and loans
        </h2>
        <span className="text-xs font-semibold text-text-muted bg-background px-2.5 py-0.5 rounded-sm">
          {loans.length} {loans.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {loans.length === 0 ? (
        <EmptyBorrowedState />
      ) : (
        <ul className="space-y-3">
          {loans.map((loan) => (
            <LoanItem key={loan.loan_id} loan={loan} onUpdate={onUpdate} />
          ))}
        </ul>
      )}
    </section>
  )
}

// 2. Placeholder for your LoanItem (implement this next!)
function LoanItem({ loan, onUpdate }: { loan: Loan; onUpdate: BorrowedListProps['onUpdate'] }) {
  return (
    <li className="p-3 bg-background rounded-sm border border-border/40 flex justify-between items-center">
      <span>{loan.title}</span>
      <span className="text-xs">{loan.status}</span>
    </li>
  )
}