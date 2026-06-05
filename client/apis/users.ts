import request from 'superagent'
import { User } from '../../models/user'
import { withAccessToken } from '../lib/authenticatedRequest'

const baseUrl = '/api/v1/users'

// GET all users
export async function getAllUsers() {
  const res = await request.get(baseUrl)
  return res.body
}

// GET one user by ID
export async function getUserById() {
  const res = await withAccessToken(request.get(`${baseUrl}/me`))
  return res.body
}

// SEARCH users
export async function searchUsers(query: string) {
  const res = await request.get(`${baseUrl}/search`).query({ query })
  return res.body
}

// CREATE user
export async function createUser(newUser: Partial<User>) {
  const res = await request.post(baseUrl).send(newUser)
  return res.body as User
}

// UPDATE user
export async function updateUser(id: string, updates: Partial<User>) {
  const res = await withAccessToken(request.patch(`${baseUrl}/${id}`).send(updates))
  return res.body
}

// DELETE (soft delete)
export async function deleteUser(id: string) {
  await withAccessToken(request.delete(`${baseUrl}/${id}`))
}
