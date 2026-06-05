import { Book } from '../../../models/book'


export const SearchResultsList = ({ 

  results = [], // Default value, safety first
  onSelect 
}: { 
  results?: Book[], 
  onSelect?: (b: Book) => void 
}) => {
  if (!results || results.length === 0) {
    return <p className="text-sm p-4">No results found.</p>;
  }

  return (
    <ul className="divide-y border">
      {results.map((book) => (
        <li key={book.work_id || book.book_id}>
          <button
            type="button"
            className="p-2 cursor-pointer hover:bg-gray-100 w-full text-left"
            onClick={() => onSelect?.(book)}
          >
            {book.title} - {book.creator}
          </button>
        </li>
      ))}
    </ul>
  );
};
