import { useCurrentUser } from '../../hooks/useCurrentUser'
import { User, Sparkles } from 'lucide-react'

export default function UserHeader() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <header className="rounded-md bg-surface p-6 shadow-card border border-border/40 flex flex-col sm:flex-row items-center gap-6 animate-pulse">
        <div className="w-20 h-20 bg-background/80 rounded-pill"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-background/80 rounded-sm w-1/3"></div>
          <div className="h-4 bg-background/80 rounded-sm w-1/4"></div>
        </div>
      </header>
    )
  }

  if (!user) return null

  // Get first letter of username for avatar placeholder
  const initial = user.user_name ? user.user_name.charAt(0).toUpperCase() : 'U'

  return (
    <header className="rounded-md bg-surface p-6 shadow-card border border-border/40 flex flex-col sm:flex-row items-center gap-6 text-left w-full relative overflow-hidden">
      {/* Decorative subtle accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
      
      {/* Avatar Container */}
      <div className="w-20 h-20 rounded-pill bg-secondary text-white font-heading text-3xl font-bold flex items-center justify-center border-4 border-background shadow-sm select-none">
        {initial}
      </div>

      {/* User Information */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
          <h1 className="font-heading text-3xl font-bold text-secondary">
            {user.user_name}
          </h1>
          {user.prounouns && (
            <span className="inline-block text-xs font-semibold text-text-muted bg-background px-2.5 py-0.5 rounded-sm w-fit mx-auto sm:mx-0">
              {user.prounouns}
            </span>
          )}
        </div>
        
        {/* User Status pill */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-text-muted">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Status:</span>
          <span className="font-semibold text-success bg-success/10 px-2 py-0.5 rounded-pill text-xs">
            {user.status || 'Active Member'}
          </span>
        </div>
      </div>
    </header>
  )
}
