export interface BookReview {
  id: string
  user_id: string
  work_id: string //Or book id if going to item level/not using generic work
  format: string
  rating: number
  comment: string
  created: string
  updated: string
}

export interface UserReview {
  id: string
  owner_id: string
  borrower_id: string
  loan_id: string //What kicked this all off?
  rating: number
  comment: string
  created: string
  updated: string

}
