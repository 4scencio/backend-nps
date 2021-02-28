import { Router } from 'express'
import { AnswerController } from './controllers/AnswerController'
import { NpsController } from './controllers/NpsController'
import { SendMailController } from './controllers/SendMailController'
import { SurveysController } from './controllers/SurveysController'
import { UserController } from './controllers/UserController'

import { Auth } from './middlewares/Auth'

const router = Router()

const userController = new UserController()
const surveysController = new SurveysController()
const sendMailController = new SendMailController()
const answerController = new AnswerController()
const npsController = new NpsController()

//Login e resposta sem auth
router.post('/session', userController.login)
router.get('/answers/:value', answerController.execute)

//Utilizar o middleware Auth nas rotas abaixo:
router.use(Auth)

router.post('/users', userController.create)
router.get('/users', userController.show)

router.post('/surveys', surveysController.create)
router.get('/surveys', surveysController.show)

router.post('/sendMail', sendMailController.execute)

router.get('/nps/:id', npsController.execute)


export { router }