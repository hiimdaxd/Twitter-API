import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'

config()

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@twitter-db.l3bh3md.mongodb.net/?retryWrites=true&w=majority&appName=Twitter-DB`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DATABASE_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      // await this.client.close()
    }
  }

  get getUsers(): Collection<User> {
    return this.db.collection(process.env.DATABASE_USERS_COLLECTION as string)
  }
}

// Create an object of DatabaseService
const databaseService = new DatabaseService()

export default databaseService
