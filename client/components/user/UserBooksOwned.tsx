import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useUserBooks } from '../../hooks/useUserBooks'
import { Book } from '../../../models/book'
import { BookMarked, Plus, BookOpen } from 'lucide-react'

export default function UserBooksOwned() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser()
  const { data: books, isLoading: isBooksLoading } = useUserBooks(user?.user_id || '')

  const isLoading = isUserLoading || isBooksLoading

  if (isLoading) {
    return (
      <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left animate-pulse">
        <div className="h-6 bg-background/80 rounded-sm w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-background/80 rounded-sm"></div>
          ))}
        </div>
      </section>
    )
  }

  // Get status pill color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'text-emerald-900 bg-emerald-100 border-emerald-300'
      case 'on loan':
      case 'borrowed':
        return 'text-amber-900 bg-amber-100 border-amber-300'
      default:
        return 'text-rose-900 bg-rose-100 border-rose-300'
    }
  }

  return (
    <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left w-full h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <h2 className="font-heading text-xl font-bold text-secondary flex items-center gap-2">
          <BookMarked className="w-5.5 h-5.5 text-primary" />
          My Books
        </h2>
        <span className="text-xs font-semibold text-text-muted bg-background px-2.5 py-0.5 rounded-sm">
          {books ? `${books.length} listed` : '0 listed'}
        </span>
      </div>

      {/* Empty State */}
      {(!books || books.length === 0) ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-10 border border-dashed border-border/60 rounded-sm bg-background/30 px-4">
          <BookOpen className="w-10 h-10 text-text-muted/30 mb-2" />
          <h3 className="text-sm font-bold text-secondary mb-0.5">No books uploaded yet</h3>
          <p className="text-xs text-text-muted mb-4 max-w-[200px]">
            Share your books with community members to unlock your home library!
          </p>
          <button className="min-h-9 flex items-center gap-1 text-xs rounded-sm bg-primary px-3.5 py-1.5 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90 active:scale-[0.98]">
            <Plus className="w-3.5 h-3.5" />
            Add First Book
          </button>
        </div>
      ) : (
        /* Grid catalog */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {books.map((b: Book) => (
            <div key={b.book_id} className="group rounded-sm border border-border/40 bg-background/30 p-2.5 transition-all hover:bg-background/60 hover:shadow-sm">
              <div className="aspect-[3/4] bg-background rounded-sm overflow-hidden border border-border/20 mb-2 shadow-sm">
                {b.image ? (
                  <img
                    src={b.image}
                    alt=""
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
              <h4 className="text-xs font-bold text-text-primary truncate" title={b.title}>
                {b.title}
              </h4>
              <div className={`inline-block text-[10px] font-bold border rounded-pill px-2 py-0.25 mt-1.5 select-none ${getStatusColor(b.status)}`}>
                {b.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
