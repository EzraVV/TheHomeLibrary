export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8 px-4 mt-auto">
      <div className="max-w-app mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        {/* Navigation/Links */}
        <div className="flex gap-6">
          <a href="#about" className="hover:text-primary transition-colors font-medium">About</a>
          <a href="#help" className="hover:text-primary transition-colors font-medium">Help</a>
          <a href="#support" className="hover:text-primary transition-colors font-medium">Support</a>
        </div>

        {/* Brand Copyright */}
        <div className="font-medium">
          © {new Date().getFullYear()} The Home Library. All rights reserved.
        </div>

        {/* Extra Actions */}
        <div className="flex gap-4 opacity-80">
          <span>Report Issue</span>
          <span>•</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  )
}
