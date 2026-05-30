import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useBorrowBookSearch } from '../hooks/useBooks'
import { SelectableBook } from '../../models/book'
import { normaliseBookPayload } from '../../shared/utils/normaliseBookPayload'

function SafeBookCover({ src, alt }: { src?: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState<string>('/assets/default-book-cover.png')
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (!src) {
      setImageSrc('/assets/default-book-cover.png')
      setIsLoaded(true)
      return
    }

    // Pre-flight check the image asset in the background container
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
    img.onerror = () => {
      setImageSrc('/assets/default-book-cover.png')
      setIsLoaded(true)
    }
  }, [src])

  return (
    <div className={`w-full h-full bg-background-muted flex items-center justify-center transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-40'}`}>
      <img 
        src={imageSrc} 
        alt={alt} 
        className="w-full h-full object-cover" 
      />
    </div>
  )
}

export default function SearchResultsPage() {
  
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query') || ''

  // Fire search cascade custom react-query hook
  const { data: searchResult, isLoading: isSearching } = useBorrowBookSearch(searchQuery)

 /* useEffect(() => {
    const hasLocalRecords = searchResult?.localData && searchResult.localData.length > 0;
    
    // ONLY allow the window redirect to execute if the source says worldcat AND local data is verified empty!
    if (searchResult?.source === 'worldcat' && searchResult?.redirectUrl && !hasLocalRecords) {
      console.log(`No local matches found. Safe to forward outward: ${searchResult.redirectUrl}`)
      window.location.href = searchResult.redirectUrl
    }
  }, [searchResult])*/

  const localMatches = Array.isArray(searchResult?.localData)
    ? searchResult.localData.map((b: any) => {
        const normalised = normaliseBookPayload(b, 'local');
        return {
          ...normalised,
          isLocal: true, // 🛡️ Absolute hard-override flag
          source: 'local'
        };
      })
    : [];

  const externalMatches = Array.isArray(searchResult?.externalData)
    ? searchResult.externalData.map((b: any) => {
        const normalised = normaliseBookPayload(b, searchResult.externalSource || 'openlibrary');
        return {
          ...normalised,
          isLocal: false,
          source: 'external'
        };
      })
    : [];


  const lookupMatches: any[] = [...localMatches, ...externalMatches]

  if (isSearching) {
    return <div className="p-6 max-w-app mx-auto text-text-muted">Searching the library inventories...</div>
  }

  return (
    <div className="p-6 max-w-app mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-secondary">
        Search Results for "{searchQuery}"
      </h1>

      {lookupMatches.length > 0 ? (
        <div className="bg-surface border border-border rounded-sm p-4">
          <div className="font-semibold mb-3">Matches Found ({lookupMatches.length}):</div>
          <ul className="divide-y divide-border">
            {lookupMatches.map((book: SelectableBook, i: number) => {
              const uniqueKeyId = `row-${book.source}-${book.work_id || 'idx'}-${i}`;

              const itemLinkUrl = book.isLocal && (book.id || book.work_id)
                ? `/books/item/${book.id || book.work_id}` // Internal App route
                : book.isbn 
                  ? `https://www.worldcat.org/isbn/${book.isbn}` // External WorldCat Fallback
                  : book.work_id 
                    ? `https://openlibrary.org/works/${book.work_id}`
                    : null;

              return (
                
                <li key={uniqueKeyId} className="flex gap-4 py-3 items-center">
                  <div className="w-12 h-16 bg-background border border-border flex items-center justify-center flex-shrink-0 rounded-sm overflow-hidden">
                    {book.image ? (
                      <SafeBookCover 
                        src={book.image} 
                        alt={`${book.title} cover`} 
                      />
                    ) : (
                      <span className="text-[10px] text-text-muted">No Cover</span>
                    )}
                  </div>
                  <div>
                    {itemLinkUrl ? (
                        <a 
                          href={itemLinkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-bold text-sm text-secondary hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {book.title}
                          <span className="text-[10px] text-text-muted font-normal">↗</span>
                        </a>
                      ) : (
                        <h3 className="font-bold text-sm text-text-primary">{book.title}</h3>
                      )}
                    <p className="text-xs text-text-muted">{book.creator}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className="text-text-muted">No catalog matching results found. Try a different term.</div>
      )}
    </div>
  )
}