import express, { Request, Response, NextFunction } from 'express'
import { body, ContextRunner, ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { ValidationError, ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

// can be reused by many routes
// https://express-validator.github.io/docs/guides/manually-running
export const validate = (validation: RunnableValidationChains<ValidationChain>, p0: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req)
    const errors = validationResult(req)
    // No errors exist
    if (errors.isEmpty()) {
      return next()
    }
    // Not 422 error
    const errorsObject = errors.mapped()
    const validationErrorObject = new ValidationError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      validationErrorObject.errors[key] = errorsObject[key]
    }
    // 422 error
    next(validationErrorObject)
  }
}
