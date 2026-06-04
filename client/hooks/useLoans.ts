import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import  { searchLoans, updateLoan, createLoan }  from '../apis/loans'
import { Loan } from '../../models/loan'

export function useSearchLoans(query: string) {
  const searchQuery = query.trim()

  return useQuery<Loan[]>({
    
    queryKey: ['loans', searchQuery],
    enabled: searchQuery.length > 2, 
    queryFn: () => searchLoans(searchQuery),
    staleTime: 1000 * 60,
  });
};

export function useUpdateLoan() {
  const queryClient = useQueryClient()

  return useMutation ({
    mutationFn: (variables: {loan_id: string; fields: Partial<Loan>, user_id: string }) => {
      return updateLoan(variables.loan_id, variables.fields, variables.user_id) 
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    }
  })
}



export function useAddLoan() {
  const queryClient = useQueryClient()

  return useMutation ({
    mutationFn: async (payload: Loan) => {

    return createLoan(payload) 
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['loan-search'] })
    }
  })
}


