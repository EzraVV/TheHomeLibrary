import { Outlet } from 'react-router-dom'
import Navbar from './Navbar' 
import Footer from './Footer' 

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <Navbar />

      {/* Dynamic Middle Section (Swaps sub-pages) */}
      <main className="flex-1 w-full max-w-app mx-auto px-4 py-6 md:px-6">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}