export function flattenText(text:string) {
  if (!text) return ''
  return text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, "");
}

export function prepareForHash(title: string, creator?: string | null): string {
  const semanticTitle = cleanBookTitle(title);
  const semanticCreator = cleanBookTitle(creator ?? '');

  const base = `${semanticTitle} ${semanticCreator}`;
   return flattenText(base).replace(/[^a-z0-9]/g, "");
}

export function prepareForSearchIndex(title: string, creator?: string | null, isbn?: string | null): string {
  const semanticTitle = cleanBookTitle(title);
  const semanticCreator = cleanBookTitle(creator ?? '');
  const cleanIsbn = isbn ?? '';

  const combined = `${semanticTitle} ${semanticCreator} ${cleanIsbn}`;
  
  return flattenText(combined)
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanBookTitle(title:string) {
  if(!title) return '';

  let cleanTitle = title

  const leadingPattern = /\b\d*(?:st|nd|rd|th)?\s*(paperback|hardcover|edition|volume|vol|copy)\b/gi;
  cleanTitle = cleanTitle.replace(leadingPattern, '');

  const trailingPattern = /\b(paperback|hardcover|edition|volume|vol|copy)\b\.?\s*(?:#?\s*\d+)?/gi;
  cleanTitle = cleanTitle.replace(trailingPattern, '');

  return cleanTitle.trim()
}

export function normaliseAuthorName(author:string) {
  if(!author) return ''

  let clean = author.trim().toLowerCase();

  if (clean.includes(',')) {
    const parts = clean.split(',').map(p => p.trim());
    clean =`${parts[1]} ${parts[0]}` //Fix Last, First ordering
  }

  return clean
    .replace(/\s+/g,' ')
    .replace(/[^a-z0-9. ]/g, ``) //Keep initials dots, remove other noise.
}

//Rough as - remove the main articles in English for sorting
//Could implement a sortTitle in the book table, but can also use on the fly in the front end on a small project.
//Sort in front-end component
export function generateSortTitle(title:string) {
  if (!title) return ''
  const cleanTitle = title.trim()

  const articleRegex = /^(The|a|An)\s+(.*)$/i
  const match = cleanTitle.match(articleRegex)

  if (match) {
    const [, article, restOfTitle] = match;
    return`${restOfTitle}, ${article}`
  }

  return cleanTitle
}
