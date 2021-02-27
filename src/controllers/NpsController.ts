import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

//Notas de 1 à 10; 
//0 - 6 = Detratores
//7 - 8 = Passivos
//9 - 10 = Promotores

//Lógica -> (Número de promotores - número de detratores) / (número de respondentes) x 100

class NpsController {
    async execute(request: Request, response: Response) {
        const { id } = request.params

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveyUser = await surveysUsersRepository.find({
            where: { survey_id: id, value: Not(IsNull()) }
        })

        //Detratores
        const detractor = surveyUser.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length

        //Passives
        const passive = surveyUser.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length

        //Promotores
        const promoter = surveyUser.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length

        const totalAnswers = surveyUser.length

        const calculate = Number(
            (((promoter - detractor) / totalAnswers) * 100).toFixed(2)
        )

        return response.json({
            detractor, 
            promoter, 
            passive, 
            totalAnswers, 
            nps: calculate
        })
    }
}

export { NpsController }