import express from 'express'
import * as db from '../db/users.js'
import { requireAuth } from '../auth/middleware.js'

const router = express.Router()

function publicProfile(user: Awaited<ReturnType<typeof db.getUserById>>) {
  if (!user) return user
  const profile: Partial<typeof user> = { ...user }
  delete profile.email
  delete profile.postcode
  return profile
}

// GET /api/v1/users
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await db.getAllUsers()
    res.json(users.map((user) => publicProfile(user)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/v1/users/search?query=foo
router.get('/search', async (req, res) => {
  const q = (req.query.query as string) || ''
  try {
    const users = await db.searchUsers(q)
    res.json(users.map((user) => publicProfile(user)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await db.getUserById(req.auth!.userId)
  return res.json(user)
})

// GET /api/v1/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(publicProfile(user))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// POST /api/v1/users
// PATCH /api/v1/users/:id
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    if (req.params.id !== req.auth!.userId) {
      return res.status(403).json({ error: 'Access denied' })
    }
    const allowedFields = [
      'user_name',
      'pronouns',
      'postcode',
      'about',
      'interests',
      'status',
    ]
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
    )
    const updated = await db.updateUser(req.auth!.userId, updates)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// DELETE /api/v1/users/:id (soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (req.params.id !== req.auth!.userId) {
      return res.status(403).json({ error: 'Access denied' })
    }
    await db.softDeleteUser(req.auth!.userId)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
