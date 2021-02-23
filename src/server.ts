import 'reflect-metadata'
import express from 'express'
import './database'

const app = express()

app.post('/users', (request, response) => {
    return response.json({message: 'salve caralho'})
})

app.listen(3333, () => console.log('Server is Running :)'))