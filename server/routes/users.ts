import express from 'express'
import * as db from '../db/users'

const router = express.Router()

// GET /api/v1/users
router.get('/', async (req, res) => {
  try {
    const users = await db.getAllUsers()
    res.json(users)
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
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// GET /api/v1/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// POST /api/v1/users
router.post('/', async (req, res) => {
  try {
    const lastId = await db.getLastUserId()
    const newId = db.generateNextUserId(lastId)
    const newUser = {
      ...req.body,
      user_id: newId,
    }
    const created = await db.createUser(newUser)
    res.status(201).json(created)
  } catch (err) {
    const error = err as { code?: string }
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Email already in use' })
    }

    console.error(err)
    res.sendStatus(500)
  }
})

// PATCH /api/v1/users/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await db.updateUser(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// DELETE /api/v1/users/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await db.softDeleteUser(req.params.id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
