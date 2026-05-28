import crypto from 'crypto';
import { normaliseAuthorName, prepareForHash,  } from '../../shared/utils/formatters';

export function generateWorkId(title: string, author: string) {
  if (!title) return 'wrk_unknown';

  const cleanTitle = prepareForHash(title)
  //Strips spaces, stops for hash match step
  const hashAuthor = normaliseAuthorName(author).replace(/[^a-z0-9]/g,``)

  if (!cleanTitle) return 'wrk_unknown'

  const signature = `${cleanTitle}|${hashAuthor}`
  const hash = crypto.createHash('sha256').update(signature).digest('hex');

  return `wrk_${hash.substring(0,16)}`
  }