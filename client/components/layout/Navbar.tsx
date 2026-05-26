export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>Library App</h2>
      <input placeholder="Search..." />
      <div className="nav-actions">
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </nav>
  )
}
