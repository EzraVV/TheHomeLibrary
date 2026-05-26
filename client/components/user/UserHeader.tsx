import { useCurrentUser } from '../../hooks/useCurrentUser'

export default function UserHeader() {
  const { data: user } = useCurrentUser()

  if (!user) return null

  return (
    <header className="user-header">
      <div className="avatar" />
      <div>
        <h1>{user.user_name}</h1>
        {user.prounouns && <p>{user.prounouns}</p>}
        <p>Status: {user.status}</p>
      </div>
    </header>
  )
}
