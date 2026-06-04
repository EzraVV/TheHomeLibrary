import express from 'express'
import * as db from '../db/loan'
import { Loan } from '../../models/loan'

const router = express.Router()

// GET /api/v1/loan
router.get('/', async (req, res) => {
  try {
    const loans = await db.getAllLoans()
    res.json(loans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch loans' })
  }
})

// GET /api/v1/loans/search?query=foo
router.get('/search', async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const loans = await db.searchLoans(q)
    res.json(loans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})