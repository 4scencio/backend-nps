import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError'

class UserController {
    async login(request: Request, response: Response) {
        const { email, password } = request.body

        const userRepository = getCustomRepository(UsersRepository)

        const user = await userRepository.find({
            where: {
                email
            }
        })

        if(user.length >= 1) {
            if(await bcrypt.compare(password, user[0].password)) {
                const token = jwt.sign( { id: user[0].id}, process.env.APP_SECRET, {
                    expiresIn: '1d'
                })

                const data = {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    token
                }

                return response.json(data)

            } else {
                throw new AppError('User not found')
            }
        } else {
            throw new AppError('User not found')
        }

    }

    async create(request: Request, response: Response) {
        const { name, email, password } = request.body

        //Yup Validation
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required()
        })

        try {
            await schema.validate(request.body, { abortEarly: false })
        } catch (error) {
            throw new AppError(error)
        }
        
        const userRepository = getCustomRepository(UsersRepository)

        //SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await userRepository.findOne({
            email
        })

        //SE FOR TRUE, CAIA NESTE CAMPO
        if(userAlreadyExists) {
            throw new AppError('User already exists!')
        }

        //HASH DA SENHA C/ BCRYPT
        const hashPassword = await bcrypt.hash(password, 8)

        //SE NÃO, CRIE O USUÁRIO
        const user = userRepository.create({
            name,
            email,
            password: hashPassword
        })

        await userRepository.save(user)
        return response.status(201).json(user)
    }

    async show (request: Request, response: Response) {
        const userRepository = getCustomRepository(UsersRepository)

        const users = await userRepository.find()

        return response.json(users)
    }

}

export { UserController }
