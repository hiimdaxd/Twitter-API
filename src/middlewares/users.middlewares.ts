import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const found = await usersServices.checkEmailExist(value)
          if (found) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minUppercase: 1,
          minLowercase: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      custom: {
        options: (value, { req }) => {
          if (value != req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD
      }
    },
    date_of_birth: {
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    }
  }),
  ['body']
)

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const found = await databaseService.getUsersCollection.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (found === null) {
            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          }
          // Add user field into req and pass it to loginController
          req.user = found
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      }
    }
  }),
  ['body']
)

export const accessTokenValidator = validate(
  checkSchema({
    authorization: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          const accessToken = value.split(' ')[1]
          if (!accessToken) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          // verify access token
          const decodedAuthorization = await verifyToken({ token: accessToken })
          req.decoded_authorization = decodedAuthorization
          return true
        }
      }
    }
  }),
  ['headers']
)

export const refreshTokenValidator = validate(
  checkSchema({
    refresh_token: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          const decodedRefreshToken = await verifyToken({ token: value })
        }
      }
    }
  }),
  ['body']
)
