import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useUserBooks } from '../../hooks/useUserBooks'

export default function UserBooksOwned() {
  const { data: user } = useCurrentUser()
  const { data: books } = useUserBooks(user?.user_id)

  if (!books) return null

  return (
    <section className="books-owned">
      <h2>My Books</h2>
      <div className="book-grid">
        {books.map((b: any) => (
          <div key={b.book_id} className="book-card">
            <img src={b.image} alt={b.title} />
            <p>{b.title}</p>
            <small>{b.status}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
