export interface Loan {
  loan_id: string
  book_id: string
  owner_id: string
  borrower_id: string
  status: 'Pending' | 'Active' | 'Completed' | 'Overdue' | 'Declined' | 'Cancelled' //Disable requests if on hold, otherwise not available. Can't deal with queues.
  due_at: string
  returned_at: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
  book_title?: string;
  book_image?: string;
  borrower_name?: string;
  owner_name?: string;
}
