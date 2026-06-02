import UserBooksOwned from "../user/UserBooksOwned"
import UserBooksBorrowed from "../user/UserBooksBorrowed"

//TO DO - expand from base book components pilfered from User - loan information, edit options, shortcuts to set lending parameters
//Due dates, recent reviews? Plus books near me to borrow?
export default function BookDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Owned books component */}
      <UserBooksOwned /> 
      
      {/* The borrowed books component */}
      <UserBooksBorrowed /> 
    </div>
  )
}