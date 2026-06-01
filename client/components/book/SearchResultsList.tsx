import { Book } from '../../models/books'

export const SearchResultsList = ({ 
  results = [], // Default value, safety first
  onSelect 
}: { 
  results?: Book[], 
  onSelect: (b: Book) => void 
}) => {
  if (!results || results.length === 0) {
    return <p className="text-sm p-4">No results found.</p>;
  }

  return (
    <ul className="divide-y border">
      {results.map((book) => (
        <li 
          key={book.work_id || book.id} // Ensure a fallback key exists
          className="p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(book)}
        >
          {book.title} - {book.creator}
        </li>
      ))}
    </ul>
  );
};