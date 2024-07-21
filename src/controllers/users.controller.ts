import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqbody } from '~/models/requests/User.request'
import usersServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Login successfully'
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqbody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersServices.register(req.body)
    return res.status(200).json({
      message: 'Register successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
