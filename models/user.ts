export interface User {
  user_id: string
  user_name: string
  prounouns?: string
  email: string
  postcode: string | null
  about: string | null
  interests: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED'
  //User manual toggle active, inactive on profile to cover holiday/unavailability. Use this to make their collection hidden
  //Deleted - make placeholder name and deets, retain archive
  borrowed_count?: number //Opt, number of books borrowed. Derive from loans.
  loaned_count?: number //Opt, number of books lent. Derived.
  rating?: number //Ratings
  created_at: string
  updated_at: string
  is_deleted: boolean
  deleted_at: string | null
}
