export interface Loan {
  id: string
  book_id: string
  lender_id: string
  borrower_id: string
  status: 'Pending' | 'Active' | 'Completed' | 'Overdue' | 'Declined' | 'Cancelled' //Disable requests if on hold, otherwise not available. Can't deal with queues.
  due_at: string
  returned_at: string
  created_at: string
  updated_at: string
}


export interface LoanBook {
  id: string
  book_id: string
  book_title: string
  book_image: string
  lender_id: string
  borrower_id: string
  status: 'Pending' | 'Active' | 'Completed' | 'Overdue' | 'Declined' | 'Cancelled' //Disable requests if on hold, otherwise not available. Can't deal with queues.
  due_at: string
  returned_at: string
  created_at: string
  updated_at: string
}
