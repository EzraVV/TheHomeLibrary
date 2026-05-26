import { useCurrentUser } from '../../hooks/useCurrentUser'

export default function UserAbout() {
  const { data: user } = useCurrentUser()

  if (!user) return null

  return (
    <section className="user-about">
      <h2>About Me</h2>
      <p>{user.about || 'No bio yet.'}</p>

      <h3>Interests</h3>
      <ul>
        {user.interests?.map((i: string) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  )
}
