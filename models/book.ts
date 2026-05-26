export interface Book {
  id: string
  owner_id: string
  title: string
  creator: string //Can include multiple names sep by comma, e.g. Divine comedy translated by Longfellow
  edition: string //Disambiguate, abridged, collectors etc
  work_id: string //All LoTR for example; hash for 'orphan' books where ISBN not pulled from dbs
  isbn?: string // Opt, but preferred. Not all books have. String cuz 0 starts
  format: string
  condition?: string
  search_index?: string
  lending_terms?: string
  status: 'Available' | 'On loan' | 'In transit' | 'Reserved'
  image_urls: string //Array of condition images? // agree but for now maybe just image
  created_at: string
  updated_at: string
}
