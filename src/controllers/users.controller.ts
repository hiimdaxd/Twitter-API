import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqbody } from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import usersServices from '~/services/users.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
  const result = await usersServices.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const userId = user._id as ObjectId
  const result = await usersServices.login(userId.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
