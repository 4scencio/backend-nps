import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body

        const userRepository = getCustomRepository(UsersRepository)
        const surveyRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await userRepository.findOne({email})

        if(!user) {
            return response.status(400).json({
                error: 'User does not exists :('
            })
        }

        const survey = await surveyRepository.findOne({id: survey_id})

        if(!survey) {
            return response.status(400).json({
                error: 'Survey does not exists :('
            })
        }

        //Verificar se o survey_users já existe, se sim, encaminhar o e-mail para ele ao invés de criar um novo
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            //relations: ['user', 'survey']
        })

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: '',
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return response.json({surveyUserAlreadyExists})
        }

        //Salvar as informações na tabela surveys_users
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)

        //Enviar e-mail para o usuário
        variables.id = surveyUser.id
        
        await SendMailService.execute(email, survey.title, variables, npsPath)

        return response.json(surveyUser)
    }
}

export { SendMailController }