import express from 'express'
import usersRouter from '~/routes/users.route'
import databaseService from './services/database.services'
const app = express()
const port = 3000

app.use(express.json()) // Parse JSON to JavaScript object
app.use('/users/', usersRouter)
databaseService.connect() // Connect to DB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
