import express, { Request, Response, NextFunction } from 'express'
import { body, validationResult, ContextRunner } from 'express-validator'

// can be reused by many routes
// https://express-validator.github.io/docs/guides/manually-running
export const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.mapped() })
      }
    }
    next()
  }
}
