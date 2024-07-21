import express, { Request, Response, NextFunction } from 'express'
import usersRouter from '~/routes/users.route'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
const port = 3000

// Middleware: Parse JSON to Javacript object
app.use(express.json())
// Initial and connect to DB
databaseService.connect()
// Initial routes
app.use('/users/', usersRouter)
// Error handler
app.use(defaultErrorHandler)

// Initial app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
