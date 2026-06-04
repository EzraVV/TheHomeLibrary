import { useCurrentUser } from '../hooks/useCurrentUser'
import { Sparkles, FileText, Heart } from 'lucide-react'

export default function UserAbout() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 animate-pulse space-y-4">
        <div className="h-6 bg-background/80 rounded-sm w-1/4"></div>
        <div className="h-4 bg-background/80 rounded-sm w-full"></div>
        <div className="h-4 bg-background/80 rounded-sm w-5/6"></div>
      </section>
    )
  }

  if (!user) return null

  return (
    <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left space-y-6">
      {/* Bio section */}
      <div>
        <h2 className="font-heading text-xl font-bold text-secondary mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          About Me
        </h2>
        <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
          {user.about ||
            "This member hasn't written a bio yet. Keep checking back for updates!"}
        </p>
      </div>

      {/* Divider */}
      {user.interests && user.interests.length > 0 && (
        <div className="border-t border-border/40 my-4"></div>
      )}

      {/* Interests badges */}
      {user.interests && user.interests.length > 0 && (
        <div>
          <h3 className="font-heading text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-accent stroke-[2.5]" />
            Reading Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest: string) => (
              <span
                key={interest}
                className="rounded-pill bg-accent/15 text-secondary border border-accent/25 px-3.5 py-1 text-xs font-semibold tracking-wide flex items-center gap-1 hover:bg-accent/20 transition-all cursor-default"
              >
                <Sparkles className="w-3 h-3 text-accent stroke-[2.5]" />
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
