import { LentList } from "./LentList"
import { BorrowedList }from "./BorrowedList"
import { Loan } from "../../../models/loan"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchLoans } from "../../hooks/useLoans"
import { useUpdateLoan } from "../../hooks/useLoans"
import { useCurrentUser } from "../../hooks/useCurrentUser"

export const BookDashboard = () => {
  const { data: allLoans, isLoading, error } = useSearchLoans('', true)
  const { data: currentUser } = useCurrentUser()

  const queryClient = useQueryClient()

  const updateLoanMutation = useUpdateLoan()

  const handleUpdate = async (loanId: string, fields: Partial<Loan>) => {
    updateLoanMutation.mutate({loan_id:loanId, fields})
    queryClient.invalidateQueries({queryKey:['loans']})
  }

  const lent = allLoans?.filter((l)=> l.owner_id === currentUser?.user_id) || [];
  const borrowed = allLoans?.filter((l)=> l.borrower_id === currentUser?.user_id) || [];
  
  if (isLoading) return <div className="p-6">Loading loans...</div>
  if (error) return <div role="alert" className="p-6">Error loading dashboard.</div>

    return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LentList loans = {lent} onUpdate={handleUpdate}/> 
      <BorrowedList loans = {borrowed} onUpdate={handleUpdate}/> 
    </section>
  )
}
