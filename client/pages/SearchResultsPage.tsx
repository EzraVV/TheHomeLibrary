import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useBorrowBookSearch } from '../hooks/useBooks'
import { SelectableBook } from '../../models/book'
import { normaliseBookPayload } from '../../shared/utils/normaliseBookPayload'

function SafeBookCover({ src, alt }: { src?: string; alt: string }) {
  console.log("SafeBookCover received src:", src);
  const [hasError, setHasError] = useState(false);
  const defaultImage = '/assets/default-book-cover.png';

  useEffect(() => {
    setHasError(false);
  }, [src]);

    return (
    <div className="w-full h-full bg-background-muted flex items-center justify-center overflow-hidden">
      <img
        src={hasError || !src ? defaultImage : src}
        alt={alt || 'Book cover'}
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

interface SearchResultsData {
  localData: any[];
  externalData: any[];
  externalSource?: string
}

interface SearchResultsProps {
  data: SearchResultsData
}

export default function SearchResultsPage({ data }:  SearchResultsProps ) {
  
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query') || ''

  // Fire search cascade custom react-query hook
  const localMatches = (data?.localData || []).map(b => ({ ...normaliseBookPayload(b, 'local'), isLocal: true }));
  const externalMatches = (data?.externalData || []).map(b => ({ ...normaliseBookPayload(b, (data.externalSource as any )|| 'openlibrary'), isLocal: false }));

  //Default collapse external results if something matches locally
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
  return localMatches.length === 0 && externalMatches.length > 0;
});

  return (
    <div className="p-6 max-w-app mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-secondary">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-xs text-text-muted mt-1">
            Found {localMatches.length} local items and {externalMatches.length} global references.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-sm p-4">
        <div className="font-semibold mb-3">Available in your library ({localMatches.length}):</div>
          
          {localMatches.length > 0 ? (
            console.log("Local Data received in SearchResultsPage:", localMatches),
            <ul className="divide-y divide-border">
              {localMatches.map((book: SelectableBook) => (
                <li key={book.id} className="flex gap-4 py-3 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-background border border-border flex-shrink-0 rounded-sm overflow-hidden">
                      <SafeBookCover 
                        src={book.image ?? ''} 
                        alt={book.title ?? 'Untitled Book'} 
                      />
                    </div>
                  <div>
                    <a href={`/books/${book.id}`} className="font-bold text-sm text-secondary hover:underline">
                      {book.title ?? 'Untitled Book'}
                      </a>
                      <p className="text-xs text-text-muted">{book.creator ?? 'Unknown Author'}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                  {book.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
          <div className="text-sm text-text-muted py-2 italic">
            No copies currently hosted in your immediate network.
          </div>
        )}
      </div>

      {externalMatches.length > 0 && (
        <div className={`border rounded-sm p-4 transition-all duration-200 ${
          isExpanded ? 'bg-surface border-border' : 'bg-background-muted/40 border-border/60 opacity-70'
        }`}>
          {/* Header Accordion Toggle Button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between font-semibold text-sm text-text-muted hover:text-text-primary transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-2">
              Not what you were after? Search Global Registries 
              <span className="text-xs bg-background border px-1.5 py-0.5 rounded text-text-muted">
                {externalMatches.length} results
              </span>
            </span>
            <span className="transform transition-transform duration-200 text-lg font-mono">
              {isExpanded ? '−' : '+'}
            </span>
          </button>
        
        {/* Conditional Collapsible Container */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border/60 animate-fadeIn">
              <p className="text-xs text-text-muted mb-3 italic">
                These books are not yet in our system, but might be available in another library:
              </p>
              <ul className="divide-y divide-border opacity-90">
                {externalMatches.map((book: any, i: number) => {
                  const uniqueKey = book.isbn || book.work_id || `external-${i}`;
                  const itemLinkUrl = book.isbn 
                    ? `https://www.worldcat.org/isbn/${book.isbn}`
                    : null;

                  return (
                    <li key={uniqueKey} 
                        className="flex gap-4 py-3 items-center justify-between grayscale-[30%] hover:grayscale-0"
                        >
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-14 bg-background border border-border flex-shrink-0 rounded-sm overflow-hidden opacity-80">
                          <SafeBookCover src={book.image} alt={book.title} />
                        </div>
                        <div>
                          {itemLinkUrl ? (
                            <a href={itemLinkUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-text-primary hover:underline flex items-center gap-1">
                              {book.title} <span className="text-[10px]">↗</span>
                            </a>
                          ) : (
                          <p className="text-xs text-text-muted">{book.creator}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}