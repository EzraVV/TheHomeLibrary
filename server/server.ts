import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import * as Path from 'node:path'
import express from 'express'
import users from './routes/users'
import booksRoutes from './routes/book'
import loanRoutes from './routes/loan'
import supportRoutes from './routes/support'

const server = express()
server.use(express.json())

// ADD YOUR API ROUTES HERE
server.use('/api/v1/books', booksRoutes)
server.use('/api/v1/users', users)
server.use('/api/v1/loans', loanRoutes)
server.use('/api/v1/support', supportRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
