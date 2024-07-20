import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqbody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'

class UsersServices {
  async register(payload: RegisterReqbody) {
    const result = await databaseService.getUsersCollection.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    return result
  }

  async checkEmailExist(email: string) {
    const found = await databaseService.getUsersCollection.findOne({ email })
    return Boolean(found)
  }
}

const usersServices = new UsersServices()

export default usersServices
