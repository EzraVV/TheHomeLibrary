import connection from './connection'

export async function getAllUsers() {
  return connection('user').where('is_deleted', false).select()
}

export async function getUserById(userId: string) {
  return connection('user')
    .where({ user_id: userId, is_deleted: false })
    .first()
}

export async function searchUsers(query: string) {
  return connection('user')
    .where('user_name', 'like', `%${query}%`)
    .orWhere('email', 'like', `%${query}%`)
    .orWhere('interests', 'like', `%${query}%`)
    .orWhere('postcode', 'like', `%${query}%`)
    .andWhere('is_deleted', false)
}

export async function createUser(newUser: any) {
  return connection('user').insert(newUser).returning('*')
}

export async function updateUser(userId: string, updates: any) {
  return connection('user')
    .where({ user_id: userId })
    .update({ ...updates, updated_at: new Date().toISOString() })
    .returning('*')
}

export async function softDeleteUser(userId: string) {
  return connection('user').where({ user_id: userId }).update({
    is_deleted: true,
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
}
