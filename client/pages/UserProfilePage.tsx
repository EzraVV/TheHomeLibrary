import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import UserHeader from '../components/user/UserHeader'
import UserAbout from '../components/user/UserAbout'
import UserBooksOwned from '../components/user/UserBooksOwned'
import UserBooksBorrowed from '../components/user/UserBooksBorrowed'

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-app w-full mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col gap-8 text-left">
        {/* User profile header info */}
        <UserHeader />

        {/* User biographical info card */}
        <UserAbout />

        {/* Dynamic lists for user books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <UserBooksOwned />
          <UserBooksBorrowed />
        </div>
      </main>

      <Footer />
    </div>
  )
}
