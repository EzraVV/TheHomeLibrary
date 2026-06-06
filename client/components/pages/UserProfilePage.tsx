import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import UserHeader from '../../components/user/UserHeader'
import UserAbout from '../../components/user/UserAbout'
import UserBooksOwned from '../../components/user/UserBooksOwned'
import UserBooksBorrowed from '../../components/user/UserBooksBorrowed'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

export default function UserProfilePage() {
  const { data: user, isLoading } = useCurrentUser()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
        {/* <Navbar /> */}
        <main className="flex-grow max-w-app w-full mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-text-muted text-sm font-semibold">
              Loading profile...
            </p>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
        {/* <Navbar /> */}
        <main className="flex-grow max-w-app w-full mx-auto px-4 py-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="p-8 bg-surface rounded-md shadow-card border border-border/40 max-w-md w-full py-12">
            <LogIn className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
            <h2 className="font-heading text-2xl font-bold text-secondary mb-1">
              Profile is private
            </h2>
            <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
              Please sign up or log in to view your cozy home library profile,
              track your books, and manage borrowed collections.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="min-h-11 rounded-sm bg-primary px-6 py-2.5 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90 active:scale-[0.98]"
            >
              Sign Up / Login
            </button>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
      {/* <Navbar /> */}

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

      {/* <Footer /> */}
    </div>
  )
}
