import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

    //http://localhost:3333/answers/10/?u=09ed2918-5208-42ab-a58d-51b38c85ce7d

    //Route Params => rota.get('/answers/:id')

    //Query Params => 
    async execute(request: Request, response: Response) {
        const { value } = request.params
        const { u } = request.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        })

        if(!surveyUser) {
            return response.status(400).json({
                error: 'Survey User does not exists :()'
            })
        }

        surveyUser.value = Number(value)

        await surveysUsersRepository.save(surveyUser)

        return response.json(surveyUser)
    }
}

export { AnswerController }