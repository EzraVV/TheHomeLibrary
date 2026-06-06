import { LentList } from "./LentList"
import { BorrowedList }from "./BorrowedList"
import { Loan } from "../../../models/loan"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchLoans } from "../../hooks/useLoans"
import { useState, useMemo } from "react"
import { useUpdateLoan } from "../../hooks/useLoans"
import { useAuth } from '../../contexts/AuthContext'

//TO DO - expand from base book components pilfered from User - loan information, edit options, shortcuts to set lending parameters
//Due dates, recent reviews? Plus books near me to borrow?

export const BookDashboard = () => {
  const [ searchQuery, setSearchQuery] = useState('')
  const { data: allLoans, isLoading, error } = useSearchLoans(searchQuery, true)

  const { user } = useAuth()
  const currentUserId = user?.id

  const queryClient = useQueryClient();
  const updateLoanMutation = useUpdateLoan();

  const handleUpdate = async (loanId: string, fields: Partial<Loan>) => {
    updateLoanMutation.mutate({loan_id:loanId, fields, user_id: currentUserId!})
  }

  const sections = useMemo(() => {
  const loans = allLoans || [];
  
  return {
    // Lender actions
    incomingRequests: loans.filter(l => l.lender_id === currentUserId && l.status === 'Requested'),
    
    // Lent items
    lentOut: loans.filter(l => l.lender_id === currentUserId && l.status === 'Borrowed'),
    
    // Borrowing actions
    pendingApprovals: loans.filter(l => l.borrower_id === currentUserId && l.status === 'Requested'),
    
    // Currently borrowed
    activeBorrows: loans.filter(l => l.borrower_id === currentUserId && l.status === 'Borrowed'),
    
    // Terminal states
    history: loans.filter(l => ['Returned', 'Cancelled', 'Declined'].includes(l.status!))
  };
}, [allLoans, currentUserId]);
  const borrowed = useMemo(() => 
    allLoans?.filter((l) => l.borrower_id === currentUserId) || [], 
    [allLoans, currentUserId]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard.</div>;

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Owned books component */}
      <LentList loans = {sections.lentOut} onUpdate={handleUpdate}/> 
      
      {/* The borrowed books component */}
      <BorrowedList loans = {sections.activeBorrows} onUpdate={handleUpdate}/> 
    </div>
  )
}

/*
export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { loan_id: string; fields: Partial<Loan>; user_id: string }) => 
      updateLoan(args.loan_id, args.fields),
    
    // Invalidate inside the hook, not the component
    onSuccess: () => {
      // Ensure this key matches exactly what you use in useSearchLoans
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    }
  });
}
  
export const BookDashboard = () => {
  const { data: allLoans } = useSearchLoans(searchQuery, true);
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('mine');

  const filteredLoans = useMemo(() => {
    if (viewMode === 'all') return allLoans || [];
    
    // Role-based logic
    return (allLoans || []).filter(l => 
      l.lender_id === currentUserId || l.borrower_id === currentUserId
    );
  }, [allLoans, viewMode, currentUserId]);

  // Now categorize the resulting list by status
  const sections = {
    requested: filteredLoans.filter(l => l.status === 'Requested'),
    borrowed: filteredLoans.filter(l => l.status === 'Borrowed'),
    // ...
  };
  
  // ...
}

const filteredLoans = useMemo(() => {
  const loans = allLoans || [];
  
  return loans.filter(l => 
    l.lender_id === currentUserId || 
    l.borrower_id === currentUserId
  );
}, [allLoans, currentUserId]);
*/