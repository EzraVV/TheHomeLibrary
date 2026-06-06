import { normaliseAuthorName, prepareForHash } from '../../shared/utils/formatters';
import crypto from 'node:crypto'; // Use Node's built-in crypto

export function generateWorkId(title: string, author: string): string {
  if (!title) return 'wrk_unknown';

  const cleanTitle = prepareForHash(title);
  if (!cleanTitle) return 'wrk_unknown';

  const cleanAuthor = author ? normaliseAuthorName(author) : 'unknown';
  const hashAuthor = cleanAuthor.replace(/[^a-z0-9]/g, '');
  
  const signature = `${cleanTitle}|${hashAuthor}`;

  // Use Node's synchronous hashing
  const hashHex = crypto
    .createHash('sha256')
    .update(signature)
    .digest('hex');

  return `wrk_${hashHex.substring(0, 16)}`;
}

