import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isString: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const found = await usersServices.checkEmailExist(value)
          if (found) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minUppercase: 1,
          minLowercase: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      custom: {
        options: (value, { req }) => {
          if (value != req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
