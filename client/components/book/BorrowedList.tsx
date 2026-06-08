import { Link } from 'react-router-dom'
import { Loan } from '../../../models/loan'
import { BookOpen } from 'lucide-react'
import { returnLoan } from '../../apis/loans'

interface BorrowedListProps {
  loans: Loan[]
  onUpdate?: (id: string, fields: Partial<Loan>) => void
}

function formatDate(value?: string | null) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function BorrowedList({ loans }: BorrowedListProps) {
  return (
    <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left w-full h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <h2 className="font-heading text-xl font-bold text-secondary flex items-center gap-2">
          Your requests and loans
        </h2>
        <span className="text-xs font-semibold text-text-muted bg-background px-2.5 py-0.5 rounded-sm"></span>
      </div>

      {loans.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-10 border border-dashed border-border/60 rounded-sm bg-background/30 px-4">
          <h3 className="text-sm font-bold text-secondary mb-0.5">
            You haven&apos;t borrowed any books yet
          </h3>
          <p className="text-xs text-text-muted mb-4 max-w-[200px]">
            Explore and find books available in the neighborhood library.
          </p>
          <Link
            to="/books/search"
            className="min-h-9 inline-flex items-center gap-1 text-xs rounded-sm bg-primary px-3.5 py-1.5 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90 active:scale-[0.98]"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {loans
            .filter(
              (loan) =>
                loan.status.toLowerCase() !== 'denied' &&
                loan.status.toLowerCase() !== 'returned',
            )
            .map((loan) => (
              <li
                key={loan.loan_id}
                className="flex gap-3 rounded-sm border border-border/50 bg-background/30 p-3"
              >
                <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-sm border border-border/40 bg-background flex items-center justify-center">
                  {loan.book_image ? (
                    <img
                      src={loan.book_image}
                      alt={loan.book_title || 'Book cover'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-6 w-6 text-text-muted/50" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-secondary">
                        {loan.book_title || 'Untitled book'}
                      </h3>
                      <p className="text-xs text-text-muted">
                        Owner: {loan.owner_name || loan.owner_id}
                      </p>
                    </div>
                    <span className="rounded-pill bg-accent/15 px-2.5 py-1 text-xs font-semibold text-secondary">
                      {loan.status}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-1 gap-1 text-xs text-text-muted sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-secondary">
                        Requested
                      </dt>
                      <dd>{formatDate(loan.created_at)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-secondary">Due</dt>
                      <dd>{formatDate(loan.due_at)}</dd>
                    </div>
                  </dl>
                  {loan.status.toLowerCase() === 'active' && (
                    <button
                      onClick={async () => {
                        try {
                          const result = await returnLoan(loan.loan_id)

                          if (result.success) {
                            alert(
                              `Book returned! Contact the lender at: ${result.lenderEmail}`,
                            )
                          }
                        } catch (err) {
                          console.error(err)
                          alert('Error returning book')
                        }
                      }}
                      className="mt-3 w-full text-xs font-semibold bg-blue-600 text-white py-1.5 rounded-sm hover:opacity-90 transition"
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}
