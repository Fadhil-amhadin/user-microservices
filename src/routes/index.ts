import { Request, Response, NextFunction, Router } from 'express'
import { userController } from '../controllers/userController'
import authentication from '../middlewares/authentication'
import authorization from '../middlewares/authorization'
import errorHandler from '../middlewares/errorHandler'
import httpLogger from '../middlewares/httpLogger'

const router = Router()

router.use(authentication)
router.use(httpLogger)
router.use(errorHandler)

router.post('/login', async (req: Request, res: Response, next: NextFunction) => userController.login(req, res, next))
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => userController.register(req, res, next))
router.patch('/patchUser', authorization, async (req: Request, res: Response, next: NextFunction) => userController.patchUser(req, res, next))
router.delete('/deleteUser', authorization, async (req: Request, res: Response, next: NextFunction) => userController.deleteUser(req, res, next))

export default router