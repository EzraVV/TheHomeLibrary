import { SelectableBook } from '../../models/book'

type BookPayload = Record<string, unknown> & {
  volumeInfo?: {
    authors?: unknown
    imageLinks?: { thumbnail?: string; smallThumbnail?: string }
    industryIdentifiers?: unknown
    title?: string
  }
}

export function normaliseBookPayload(
  input: unknown,
  source: 'local' | 'openlibrary' | 'google' | 'worldcat' | 'none' | 'mixed',
): SelectableBook {
  const book: BookPayload =
    input && typeof input === 'object' ? (input as BookPayload) : {}
  const embeddedIsbns: string[] = []
  
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
    rawIsbnSource.forEach((code: unknown) => {
      if (code && typeof code === 'object' && 'identifier' in code) {
        embeddedIsbns.push(String(code.identifier).trim())
      } else if (code) {
        embeddedIsbns.push(String(code).trim());
      }
    });
  } else if (typeof rawIsbnSource === 'string' && rawIsbnSource.trim()) {
    embeddedIsbns.push(rawIsbnSource.trim());
  }

  const rawCoreIsbn = embeddedIsbns[0] || '';
  const cleanCoreIsbn = rawCoreIsbn.replace(/[^0-9X]/gi, '').trim();
  const coreIsbn = (cleanCoreIsbn.length === 10 || cleanCoreIsbn.length === 13) ? cleanCoreIsbn : '';

  let resolvedImage = typeof book.cover === 'string' ? book.cover : ''

  if (source === 'local') {
    resolvedImage = String(book.image || book.coverUrl || book.cover || '')
}

  if (source === 'openlibrary') {
    const coverId = book.cover_i || (Array.isArray(book.covers) && book.covers[0]) || book.cover_id;
    
    if (coverId) {
      resolvedImage = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    } 
    // If the record has no cover ID but has an ISBN, build an ISBN image path!
    else if (coreIsbn) {
      resolvedImage = `https://covers.openlibrary.org/b/isbn/${coreIsbn}-M.jpg`;
    }
  } else if (source === 'google' && book.volumeInfo?.imageLinks) {
    resolvedImage = book.volumeInfo.imageLinks.thumbnail || book.volumeInfo.imageLinks.smallThumbnail || '';
  }

  let resolvedCreator = 'Unknown';
  if (source === 'local' && book.creator) {
    resolvedCreator = String(book.creator)
  } else if (Array.isArray(book.author_name)) {
    resolvedCreator = book.author_name.join(', ');
  } else if (Array.isArray(book.volumeInfo?.authors)) {
    resolvedCreator = book.volumeInfo.authors.join(', ');
  } else if (typeof book.creator === 'string') {
    resolvedCreator = book.creator;
  }

  // If the book lacks an OpenLibrary work key, create a safe fallback string
  const cleanWorkId =
    typeof book.key === 'string'
      ? book.key.replace('/works/', '')
      : typeof book.work_id === 'string'
        ? book.work_id
        : undefined

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
    googleVolumeId: source === 'google' ? String(book.id || '') : undefined,
    availableIsbns: embeddedIsbns,
    title: String(book.title || book.volumeInfo?.title || 'Untitled Edition'),
    creator: String(resolvedCreator).trim(),
    isbn: coreIsbn,
    edition_name: String(book.edition_name || '').trim(),
    format: String(book.format || 'Paperback'),
    image: resolvedImage,
    redirectUrl: computedRedirectUrl
  };
}
