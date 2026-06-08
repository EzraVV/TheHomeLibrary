import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import users from './routes/users.js'
import booksRoutes from './routes/book.js'
import loanRoutes from './routes/loan.js'
import supportRoutes from './routes/support.js'

const app = express()
app.use(express.json())

app.use('/api/v1/books', booksRoutes)
app.use('/api/v1/users', users)
app.use('/api/v1/loans', loanRoutes)
app.use('/api/v1/support', supportRoutes)

export default app
