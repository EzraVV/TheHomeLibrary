export interface Book {
  id: string
  owner_id: string
  title: string
  creator: string //Can include multiple names sep by comma, e.g. Divine comedy translated by Longfellow
  edition_name: string //Disambiguate, abridged, collectors etc
  work_id: string //All LoTR for example; hash for 'orphan' books where ISBN not pulled from dbs
  isbn?: string // Opt, but preferred. Not all books have. String cuz 0 starts
  format: string //Eg. hardcover, graphic novel
  condition?: string
  search_index?: string //Contat SQLite search vector = title+author+tags
  lending_terms?: string //User defined custom rules
  status: 'Available' | 'On loan' | 'In transit' | 'Reserved'
  image: string //Array of condition images? // agree but for now maybe just image
  created_at: string
  updated_at: string
}

export type BookFormData = Omit<Book, 'id' | 'owner_id' | 'work_id' | 'search_index' | 'created_at' | 'updated_at'>;

export interface BookFormProps {
  initialValues?: Partial<Book> | null
  onSubmit: (data: BookFormData) => void
  isSaving: boolean
}

export type Status = 'Available' | 'On loan' | 'In transit' | 'Reserved';