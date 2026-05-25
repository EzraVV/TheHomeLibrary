import connection from './connection'
import { User } from '../../models/user'

type UserRow = Omit<User, 'interests'> & {
  interests: string | null
}

// map for interests
function mapUser(row: UserRow): User {
  return {
    ...row,
    interests: row.interests
      ? row.interests.split(',').map((s: string) => s.trim())
      : [],
  }
}

export async function getAllUsers() {
  const users = await connection('user')
  return users.map(mapUser)
}

export async function getUserById(id: string) {
  const user = await connection('user').where({ user_id: id }).first()
  return user ? mapUser(user) : null
}

export async function searchUsers(query: string) {
  const users = await connection('user')
    .where('user_name', 'like', `%${query}%`)
    .orWhere('email', 'like', `%${query}%`)
    .orWhere('interests', 'like', `%${query}%`)
    .orWhere('postcode', 'like', `%${query}%`)
    .andWhere('is_deleted', false)

  return users.map(mapUser)
}

export async function createUser(newUser: User): Promise<User> {
  const rows = await connection('user').insert(newUser).returning('*')

  return mapUser(rows[0])
}

export async function updateUser(
  id: string,
  updates: Partial<User>,
): Promise<User> {
  // Update
  await connection('user')
    .where({ user_id: id })
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })

  // Fetch
  const updated = await connection('user').where({ user_id: id }).first()

  return mapUser(updated)
}

export async function softDeleteUser(userId: string) {
  return connection('user').where({ user_id: userId }).update({
    is_deleted: true,
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
}
