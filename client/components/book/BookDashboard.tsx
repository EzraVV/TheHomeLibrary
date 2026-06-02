import UserBooksOwned from "../user/UserBooksOwned"
import UserBooksBorrowed from "../user/UserBooksBorrowed"


export default function BookDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Your new Owned component */}
      <UserBooksOwned /> 
      
      {/* The existing borrowed component */}
      <UserBooksBorrowed /> 
    </div>
  )
}