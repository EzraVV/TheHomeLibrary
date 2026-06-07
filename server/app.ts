import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import users from './routes/users'
import booksRoutes from './routes/book'
import loanRoutes from './routes/loan'
import supportRoutes from './routes/support'

const app = express()
app.use(express.json())

app.use('/api/v1/books', booksRoutes)
app.use('/api/v1/users', users)
app.use('/api/v1/loans', loanRoutes)
app.use('/api/v1/support', supportRoutes)

export default app
