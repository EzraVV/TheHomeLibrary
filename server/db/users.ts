import connection from './connection'

// map for interests
function mapUser(row: any) {
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

export async function createUser(newUser: any) {
  const rows = await connection('user').insert(newUser).returning('*')

  return mapUser(rows[0])
}

export async function updateUser(userId: string, updates: any) {
  // Update
  await connection('user')
    .where({ user_id: userId })
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })

  // Fetch
  const updated = await connection('user').where({ user_id: userId }).first()

  return mapUser(updated)
}

export async function softDeleteUser(userId: string) {
  return connection('user').where({ user_id: userId }).update({
    is_deleted: true,
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
}
