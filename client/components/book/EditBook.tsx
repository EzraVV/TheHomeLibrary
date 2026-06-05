import { useEditBook, useGetBookById } from '../../hooks/useBooks'
import BookForm from './BookForm' 
import { Book, BookFormData } from '../../../models/book'
import { useState } from 'react'
import { editSearchBooks } from '../../apis/books'
import { useParams } from 'react-router'
import { normaliseBookPayload } from '../../../shared/utils/normaliseBookPayload'


export function EditBook() {
  const { id } = useParams<{ id: string }>(); // Pulling ID from URL
  const { data: selectedBook, error, isLoading } = useGetBookById(id || '');


  const bookMutation = useEditBook();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<unknown[]>([]);
  const [stagedBook, setStagedBook] = useState<Book | null>(null);
  const currentFormData = stagedBook || selectedBook;

  const handleManualSearch = async () => {
  if (searchQuery.length < 3) return;
  
  try {
    // Call the service function directly, not the mutation hook
    const data = await editSearchBooks(searchQuery); 
    setResults(data);
  } catch (err) {
    console.error("Search failed", err);
  }
};

  const handleSelectCandidate = (book: Book) => {
      setStagedBook({ ...book, book_id: selectedBook?.book_id, owner_id: selectedBook?.owner_id });
    };

  const formSubmitHandler = async (formData: BookFormData) => {
  // Use the ID from the URL (useParams) as the definitive source
  const targetId = id || currentFormData?.book_id;

  if (!targetId || targetId === 'undefined') {
    console.error("❌ CRITICAL: Cannot save - no valid ID found.");
    return;
  }
    await bookMutation.mutateAsync({ 
      id: targetId, 
      payload: formData 
    });
  };


  if (isLoading) return <div>Loading book data...</div>;

  if (error) return <div>Error loading book.</div>;

  return (

    <div className="flex gap-8 items-start p-6">
  
  {/* LEFT COLUMN: Search & Results */}
  <div className="w-1/2 flex flex-col gap-4">
    <div className="bg-white p-4 border rounded shadow-sm">
      <h3 className="font-bold text-lg mb-2">Overlay Metadata</h3>
      <input 
        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        placeholder="Search by title, author or ISBN." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <button type="button" onClick={handleManualSearch}>
    Search Metadata
      </button>
    </div>

    {/* Scrollable area for results: Keeps the form from moving */}
    <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-3">
      {results.map((item, i) => {
        const book = normaliseBookPayload(item, 'openlibrary')

  return (
        <button
          type="button"
          key={book.isbn || i} 
          onClick={() => handleSelectCandidate(book as Book)}
          className="flex border p-3 rounded shadow-sm hover:bg-blue-50 cursor-pointer transition-colors w-full text-left"
        >
          {book.image ? (
            <img src={book.image} alt={book.title} className="w-16 h-24 object-cover mr-4" />
          ) : (
            <div className="w-16 h-24 bg-gray-200 mr-4 flex items-center justify-center text-xs text-gray-500">No Cover</div>
          )}
          
          <div>
            <h4 className="font-bold">{book.title}</h4>
            <p className="text-sm text-gray-600">
              Author: {book.creator || 'No Author Listed'}
            </p>
            <p className="text-sm text-gray-600">Edition: {book.edition_name || 'N/A'}</p>
            <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
          </div>
        </button>
      )
    })}
    </div>
  </div>

  {/* RIGHT COLUMN: The Form */}
  <div className="w-1/2">
    <div className="sticky top-4">
      <BookForm 
        key={currentFormData?.book_id || 'new'}
        initialValues={currentFormData} 
        onSubmit={formSubmitHandler}
        isSaving={bookMutation.isPending}
      />
    </div>
  </div>
</div>
  );
}
