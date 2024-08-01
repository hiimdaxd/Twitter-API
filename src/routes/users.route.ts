import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controller'
import { requestHandleWrapper } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, requestHandleWrapper(loginController))
usersRouter.post('/register', registerValidator, requestHandleWrapper(registerController))
// usersRouter.post('/logout', logoutValidator, requestHandleWrapper(logoutController))

export default usersRouter
