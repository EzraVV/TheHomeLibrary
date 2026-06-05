import connection from './connection'
import { User } from '../../models/user'
import { atomiseInterests, stringifyInterests } from '../../shared/utils/interestProcessing'

type UserRow = Omit<User, 'interests'> & {
  interests: string | null
}

// map for interests
function mapUser(row: UserRow): User {
  return {
    ...row,
    interests: atomiseInterests(row.interests),
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
  const rows = await connection('user')
    .insert({ ...newUser, interests: stringifyInterests(newUser.interests) })
    .returning('*')

  return mapUser(rows[0])
}

export async function getLastUserId(): Promise<string | null> {
  const row = await connection('user').orderBy('user_id', 'desc').first()

  return row ? row.user_id : null
}

export function generateNextUserId(lastId: string | null): string {
  if (!lastId) {
    return 'u_00001'
  }

  const num = parseInt(lastId.replace('u_', ''), 10)
  const next = num + 1

  return `u_${next.toString().padStart(5, '0')}`
}

export async function updateUser(
  id: string,
  updates: Partial<User>,
): Promise<User> {
  // Update
  const storedUpdates = {
    ...updates,
    ...(updates.interests
      ? { interests: stringifyInterests(updates.interests) }
      : {}),
    updated_at: new Date().toISOString(),
  }

  await connection('user')
    .where({ user_id: id })
    .update(storedUpdates)

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
