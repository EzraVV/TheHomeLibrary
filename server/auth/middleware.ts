import type { NextFunction, Request, Response } from 'express'
import { getUserByAuthId, getUserById } from '../db/users'
import { getServerSupabaseClient } from './supabase'

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (process.env.NODE_ENV === 'test') {
      const testUserId = req.header('x-test-user-id')
      if (testUserId) {
        const user = await getUserById(testUserId)
        if (user) {
          req.auth = { authUserId: `test:${testUserId}`, userId: testUserId }
          return next()
        }
      }
    }

    const authorization = req.header('authorization')
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : null

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { data, error } = await getServerSupabaseClient().auth.getClaims(token)
    const authUserId = data?.claims?.sub
    if (error || typeof authUserId !== 'string') {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    const profile = await getUserByAuthId(authUserId)
    if (!profile || profile.is_deleted) {
      return res.status(403).json({ error: 'User profile is unavailable' })
    }

    req.auth = { authUserId, userId: profile.user_id }
    return next()
  } catch (error) {
    return next(error)
  }
}
