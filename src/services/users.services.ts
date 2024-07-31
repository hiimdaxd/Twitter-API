import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqbody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'

class UsersServices {
  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }

  async checkEmailExist(email: string) {
    const found = await databaseService.getUsersCollection.findOne({ email })
    return Boolean(found)
  }

  async register(payload: RegisterReqbody) {
    const result = await databaseService.getUsersCollection.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const userId = result.insertedId.toString()
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId)
    await databaseService.getRefreshTokensCollection.insertOne(
      new RefreshToken({
        user_id: new ObjectId(userId),
        token: refreshToken
      })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId)
    return {
      accessToken,
      refreshToken
    }
  }
}

const usersServices = new UsersServices()

export default usersServices
