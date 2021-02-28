import request from 'supertest'
import { getConnection } from 'typeorm'
import { app } from '../app'

import createConnection from '../database'

describe('Surveys', () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    //Resetar a tabela a cada test iniciado
    afterAll(async () => {
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    })

    it('Should be to able to create a new survey', async () => {
        const response = await request(app).post('/surveys').send({
            title: 'title example',
            description: 'description example'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
    })

    it('Should be to able to get all surveys', async () => {
        await request(app).post('/surveys').send({
            title: 'title example',
            description: 'description example'
        })

        const response = await request(app).get('/surveys')

        expect(response.body.length).toBe(2)
    })

})