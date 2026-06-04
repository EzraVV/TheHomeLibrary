import { LentList } from "./LentList"
import { BorrowedList }from "./BorrowedList"
import { Loan } from "../../../models/loan"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchLoans } from "../../hooks/useLoans"
import { useState } from "react"
import { useUpdateLoan } from "../../hooks/useLoans"

//TO DO - expand from base book components pilfered from User - loan information, edit options, shortcuts to set lending parameters
//Due dates, recent reviews? Plus books near me to borrow?

export const BookDashboard = () => {
  const [ searchQuery, setSearchQuery] = useState('')
  const { data: allLoans, isLoading, error } = useSearchLoans(searchQuery)

  const queryClient = useQueryClient()

  const currentUserId = 'u_00001'
  const updateLoanMutation = useUpdateLoan()

  const handleUpdate = async (loanId: string, fields: Partial<Loan>) => {
    updateLoanMutation.mutate({loan_id:loanId, fields, user_id: currentUserId})
    queryClient.invalidateQueries({queryKey:['loans']})
  }

  const lent = allLoans?.filter((l)=> l.lender_id === currentUserId) || [];
  const borrowed = allLoans?.filter((l)=> l.borrower_id === currentUserId) || [];
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard.</div>;

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Owned books component */}
      <LentList loans = {lent} onUpdate={handleUpdate}/> 
      
      {/* The borrowed books component */}
      <BorrowedList loans = {borrowed} onUpdate={handleUpdate}/> 
    </div>
  )
}

/*
const updateMutation = useUpdateLoan();

// Inside button click or event handler
updateMutation.mutate({ 
  loan_id: 'l_123', 
  fields: { status: 'returned', returned_at: new Date().toISOString() } 
});*/