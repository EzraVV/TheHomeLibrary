export interface User {
  id: string
  user_name: string
  pronouns?: string
  email: string
  postcode: number
  interests?: string[]
  status: 'Active' | 'Banned' | 'Inactive' | 'Deleted'
  //User manual toggle active, inactive on profile to cover holiday/unavailability. Use this to make their collection hidden
  //Deleted - make placeholder name and deets, retain archive
  borrowed_count?: number //Opt, number of books borrowed. Derive from loans.
  loaned_count?: number //Opt, number of books lent. Derived.
  rating?: number //Ratings
  created_at: string
  updated_at: string
}