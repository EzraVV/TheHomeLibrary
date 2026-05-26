import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import UserHeader from '../components/user/UserHeader'
import UserAbout from '../components/user/UserAbout'
import UserBooksOwned from '../components/user/UserBooksOwned'
import UserBooksBorrowed from '../components/user/UserBooksBorrowed'
import '../styles/user.css'

export default function UserProfilePage() {
  return (
    <div className="user-profile-page">
      <Navbar />
      <main>
        <UserHeader />
        <UserAbout />
        <div className="books-section">
          <UserBooksOwned />
          <UserBooksBorrowed />
        </div>
      </main>
      <Footer />
    </div>
  )
}
