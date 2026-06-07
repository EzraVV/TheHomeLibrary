import connection from './connection'
import { User } from '../../models/user'
import {
  atomiseInterests,
  stringifyInterests,
} from '../../shared/utils/interestProcessing'

type UserRow = Omit<User, 'interests'> & {
  interests: string | string[] | null
  auth_user_id?: string | null
}

const userTable = process.env.NODE_ENV === 'test' ? 'user' : 'profiles'

// map for interests
function mapUser(row: UserRow): User {
  const publicRow = { ...row }
  delete publicRow.auth_user_id
  return {
    ...publicRow,
    interests: Array.isArray(row.interests)
      ? row.interests
      : atomiseInterests(row.interests),
  }
}

export async function getAllUsers() {
  const users = await connection(userTable)
  return users.map(mapUser)
}

export async function getUserById(id: string) {
  const user = await connection(userTable).where({ user_id: id }).first()
  return user ? mapUser(user) : null
}

export async function getUserByAuthId(authUserId: string) {
  if (process.env.NODE_ENV === 'test') return null
  const user = await connection(userTable)
    .where({ auth_user_id: authUserId })
    .first()
  return user ? mapUser(user) : null
}

export async function searchUsers(query: string) {
  const users = await connection(userTable)
    .where('user_name', 'like', `%${query}%`)
    .andWhere('is_deleted', false)

  return users.map(mapUser)
}

export async function createUser(newUser: User): Promise<User> {
  const interests =
    process.env.NODE_ENV === 'test'
      ? stringifyInterests(newUser.interests)
      : newUser.interests
  const rows = await connection(userTable)
    .insert({ ...newUser, interests })
    .returning('*')

  return mapUser(rows[0])
}

export async function getLastUserId(): Promise<string | null> {
  const row = await connection(userTable).orderBy('user_id', 'desc').first()

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
      ? {
          interests:
            process.env.NODE_ENV === 'test'
              ? stringifyInterests(updates.interests)
              : updates.interests,
        }
      : {}),
    updated_at: new Date().toISOString(),
  }

  await connection(userTable).where({ user_id: id }).update(storedUpdates)

  // Fetch
  const updated = await connection(userTable).where({ user_id: id }).first()

  return mapUser(updated)
}

export async function softDeleteUser(userId: string) {
  return connection(userTable).where({ user_id: userId }).update({
    is_deleted: true,
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
}
