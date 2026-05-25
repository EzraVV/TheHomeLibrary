export function calculateDueDate(loanWeeks: number, startDate: Date |string = new Date()) {
    const loanDate = new Date(startDate)

    const daysAdded = loanWeeks * 7

    loanDate.setDate(loanDate.getDate() + daysAdded)
    
    return loanDate.toISOString();
}