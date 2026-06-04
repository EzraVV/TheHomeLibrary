import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 px-4 mt-auto">
      <div className="max-w-app mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        {/* Navigation/Links */}
        <div className="flex gap-6">
          <Link
            to="/about"
            className="hover:text-primary transition-colors font-medium"
          >
            About
          </Link>
          <Link
            to="/support"
            className="hover:text-primary transition-colors font-medium"
          >
            Support
          </Link>
        </div>

        {/* Brand Copyright */}
        <div className="font-medium">
          © {new Date().getFullYear()} The Home Library. All rights reserved.
        </div>

        {/* Extra Actions */}
        <div className="flex gap-4 opacity-80">
          <span>Terms</span>
        </div>
      </div>
    </footer>
  )
}
