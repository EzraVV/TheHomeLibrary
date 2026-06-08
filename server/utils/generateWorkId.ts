import { normaliseAuthorName, prepareForHash,  } from '../../shared/utils/formatters.js';

export async function generateWorkId(title: string, author: string) {
  if (!title) return 'wrk_unknown';

  const cleanTitle = prepareForHash(title)
  if (!cleanTitle) return 'wrk_unknown'
  //Strips spaces, stops for hash match step

  const cleanAuthor = author ? normaliseAuthorName(author) : 'unknown';
  const hashAuthor = cleanAuthor.replace(/[^a-z0-9]/g, '');
  
  const signature = `${cleanTitle}|${hashAuthor}`
  const msgUint8 = new TextEncoder().encode(signature);

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return `wrk_${hashHex.substring(0, 16)}`;
}
