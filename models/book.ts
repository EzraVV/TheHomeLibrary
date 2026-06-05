export interface Book {
  book_id: string
  owner_id: string
  title: string
  creator: string //Can include multiple names sep by comma, e.g. Divine comedy translated by Longfellow
  edition_name: string //Disambiguate, abridged, collectors etc
  work_id: string //All LoTR for example; hash for 'orphan' books where ISBN not pulled from dbs
  isbn?: string // Opt, but preferred. Not all books have. String cuz 0 starts
  format: string //Eg. hardcover, graphic novel
  description?: string
  condition?: string
  search_index?: string //Contat SQLite search vector = title+author+tags
  lending_terms?: string //User defined custom rules
  status: 'Available' | 'On loan' | 'In transit' | 'Reserved'
  image: string //Array of condition images? // agree but for now maybe just image
  created_at: string
  updated_at: string
}

export type BookFormData = Omit<Book, 'book_id' | 'owner_id' | 'search_index' | 'created_at' | 'updated_at'>;

export interface BookFormProps {
  initialValues?: Partial<Book> | null
  onSubmit: (data: BookFormData) => void
  isSaving: boolean
}

export interface BookEditionMinimal {
  edition_name: string
  isbn:string
  image: string
  format: string
}

export type Status = 'Available' | 'On loan' | 'In transit' | 'Reserved';

export 
type SelectableBook = Partial<Book> & {
  source?: 'local' | 'openlibrary' | 'google' | 'worldcat' | 'none' | 'mixed'
  isLocal?: boolean,
  googleVolumeId?:string
  availableIsbns?: string[]
  redirectUrl?: string
}

export interface BookLoan {
  book_id: string
  owner_id: string
  title: string
  creator: string 
  edition_name: string
  work_id: string 
  isbn?: string 
  format: string
  condition?:string
  search_index?: string 
  lending_terms?: string
  status: 'Available' | 'On loan' | 'In transit' | 'Reserved'
  current_loan?: {
    due_at:string;
    borrower_name: string;
  }
  image: string 
  created_at: string
  updated_at: string
}
