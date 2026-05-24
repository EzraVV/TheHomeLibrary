export function normaliseTitle(title:string) {
  if(!title) return '';
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\b(paperback|hardcover|edition|volume|vol|copy)\b/g,'')
    .trim()
    .replace(/\s+/g,` `) //Collapse spacing
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
  let cleanTitle = title.trim()

  const articleRegex = /^(The|a|An)\s+(.*)$/i
  const match = cleanTitle.match(articleRegex)

  if (match) {
    const [_,article, restOfTitle] = match;
    return`${restOfTitle}, ${article}`
  }

  return cleanTitle
}