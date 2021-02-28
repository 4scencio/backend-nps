import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        //Yup Validation
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        try {
            await schema.validate(request.body, { abortEarly: false })
        } catch (error) {
            return response.status(400).json({error: error})
        }
        
        const userRepository = getCustomRepository(UsersRepository)

        //SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await userRepository.findOne({
            email
        })

        //SE FOR TRUE, CAIA NESTE CAMPO
        if(userAlreadyExists) {
            return response.status(400).json({
                error: 'User already exists!'
            })
        }

        //SE NÃO, CRIE O USUÁRIO
        const user = userRepository.create({
            name,
            email
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
