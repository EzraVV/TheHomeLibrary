import { BookMarked, BookOpen } from 'lucide-react'
import { acceptLoanRequest } from '../../apis/loans'
import { Loan } from '../../../models/loan'
import { returnLoan } from '../../apis/loans'
import { denyLoanRequest } from '../../apis/loans'
interface LentListProps {
  loans: Loan[]
  onUpdate: (id: string, fields: Partial<Loan>) => void
}

export function LentList({ loans }: LentListProps) {
  // Get status pill color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'text-success bg-success/15 border-success/20'
      case 'on loan':
      case 'borrowed':
        return 'text-warning bg-warning/15 border-warning/20'
      default:
        return 'text-accent bg-accent/15 border-accent/20'
    }
  }

  return (
    <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left w-full h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <h2 className="font-heading text-xl font-bold text-secondary flex items-center gap-2">
          <BookMarked className="w-5.5 h-5.5 text-primary" />
          Your bookshelf
        </h2>
        <span className="text-xs font-semibold text-text-muted bg-background px-2.5 py-0.5 rounded-sm"></span>
      </div>

      {/* Empty State */}
      {!loans || loans.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-10 border border-dashed border-border/60 rounded-sm bg-background/30 px-4">
          <BookOpen className="w-10 h-10 text-text-muted/30 mb-2" />
          <h3 className="text-sm font-bold text-secondary mb-0.5">
            No active loans
          </h3>
          <p className="text-xs text-text-muted mb-4 max-w-[200px]">
            No books currently loaned out
          </p>
        </div>
      ) : (
        /* Grid catalog */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loans
            .filter(
              (loan) =>
                loan.status.toLowerCase() !== 'denied' &&
                loan.status.toLowerCase() !== 'returned',
            )
            .map((loan: Loan) => (
              <div
                key={loan.loan_id}
                className="group rounded-sm border border-border/40 bg-background/30 p-2.5 transition-all hover:bg-background/60 hover:shadow-sm"
              >
                <div className="aspect-[3/4] bg-background rounded-sm overflow-hidden border border-border/20 mb-2 shadow-sm">
                  {loan.book_image ? (
                    <img
                      src={loan.book_image}
                      alt={loan.book_title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted opacity-40 text-xs">
                      <BookOpen className="w-6 h-6 mb-0.5" />
                      <span>No Cover</span>
                    </div>
                  )}
                </div>
                <h4
                  className="text-xs font-bold text-text-primary truncate"
                  title={loan.book_title}
                >
                  {loan.borrower_id}
                </h4>
                <p
                  className="text-xs font-bold text-text-primary truncate"
                  title={loan.borrower_id}
                >
                  {loan.due_at}
                </p>

                <div
                  className={`inline-block text-[10px] font-bold border rounded-pill px-2 py-0.25 mt-1.5 select-none ${getStatusColor(loan.status)}`}
                >
                  {loan.status}
                </div>
                {loan.status.toLowerCase() === 'pending' && (
                  <div className="mt-2 flex flex-col gap-1">
                    <button
                      onClick={async () => {
                        try {
                          const result = await acceptLoanRequest(loan.loan_id)
                          if (result.success) {
                            alert(
                              `Request accepted. Borrower email: ${result.borrowerEmail}, please contact then about arranging handover.`,
                            )
                          }
                        } catch (err) {
                          console.error(err)
                          alert('Error accepting request')
                        }
                      }}
                      className="w-full text-[10px] font-semibold bg-primary text-white py-1 rounded-sm hover:opacity-90 transition"
                    >
                      Accept Request
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await denyLoanRequest(loan.loan_id)
                          alert('Request denied')
                        } catch (err) {
                          console.error(err)
                          alert('Error denying request')
                        }
                      }}
                      className="w-full text-[10px] font-semibold bg-red-600 text-white py-1 rounded-sm hover:opacity-90 transition"
                    >
                      Deny Request
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </section>
  )
}
/*const LentList = ({ loans }: LentListProps) => {
  return (
    <div>
      {loans.map(loan => (
        <div key={loan.loan_id}>
          {loan.book_title} - Due: {loan.due_at}
          <button onClick={() => onUpdate(loan.loan_id, { status: 'returned' })}>
          Return Book
        </button>
        </div>
      ))}
    </div>
  )*/
