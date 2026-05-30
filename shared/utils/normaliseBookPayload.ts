import { SelectableBook } from "../../models/book";

export function normaliseBookPayload(book: any, source: 'local' | 'openlibrary' | 'google' | 'worldcat' | 'none' | 'mixed'): SelectableBook {
  const embeddedIsbns: string[] = [];

  
  if (Array.isArray(book.ia)) {
    book.ia.forEach((tag: string) => {
      if (tag.startsWith('isbn_')) {
        const clean = tag.replace('isbn_', '').trim();
        if (clean && !embeddedIsbns.includes(clean)) embeddedIsbns.push(clean);
      }
    });
  }

  const rawIsbnSource = book.isbn || book.isbn_array || book.volumeInfo?.industryIdentifiers;
  if (Array.isArray(rawIsbnSource)) {
    rawIsbnSource.forEach((code: any) => {
      if (code && typeof code === 'object' && code.identifier) {
        embeddedIsbns.push(String(code.identifier).trim());
      } else if (code) {
        embeddedIsbns.push(String(code).trim());
      }
    });
  } else if (typeof rawIsbnSource === 'string' && rawIsbnSource.trim()) {
    embeddedIsbns.push(rawIsbnSource.trim());
  }

  let resolvedImage = book.image || '';
  const coreIsbn = embeddedIsbns[0] || '';

  if (source === 'openlibrary') {
    const coverId = book.cover_i || (Array.isArray(book.covers) && book.covers[0]) || book.cover_id;
    
    if (coverId) {
      resolvedImage = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    } 
    // If the record has no cover ID but has an ISBN, build an ISBN image path!
    else if (coreIsbn) {
      resolvedImage = `https://covers.openlibrary.org/b/isbn/${coreIsbn}-M.jpg?default=false`;
    }
  } else if (source === 'google' && book.volumeInfo?.imageLinks) {
    resolvedImage = book.volumeInfo.imageLinks.thumbnail || book.volumeInfo.imageLinks.smallThumbnail || '';
  }

  let resolvedCreator = 'Unknown';
  if (source === 'local' && book.creator) {
    resolvedCreator = book.creator;
  } else if (Array.isArray(book.author_name)) {
    resolvedCreator = book.author_name.join(', ');
  } else if (Array.isArray(book.volumeInfo?.authors)) {
    resolvedCreator = book.volumeInfo.authors.join(', ');
  } else if (typeof book.creator === 'string') {
    resolvedCreator = book.creator;
  }

  // If the book lacks an OpenLibrary work key, create a safe fallback string
  const cleanWorkId = book.key ? book.key.replace('/works/', '') : (book.work_id || undefined);

  let computedRedirectUrl = undefined;
  if (coreIsbn) {
    computedRedirectUrl = `https://www.worldcat.org/isbn/${coreIsbn}`;
  } else if (source === 'openlibrary' && cleanWorkId) {
    // If no ISBN exists, point to the OpenLibrary Work Page so they can browse editions!
    computedRedirectUrl = `https://openlibrary.org/works/${cleanWorkId}`;
  }

  return {
    ...book,
    work_id: cleanWorkId,
    source,
    isLocal: source === 'local',
    googleVolumeId: source === 'google' ? book.id : undefined,
    availableIsbns: embeddedIsbns,
    title: String(book.title || book.volumeInfo?.title || 'Untitled Edition'),
    creator: String(resolvedCreator).trim(),
    isbn: coreIsbn,
    edition_name: String(book.edition_name || '').trim(),
    format: book.format || 'Paperback',
    image: resolvedImage,
    redirectUrl: computedRedirectUrl
  };
}