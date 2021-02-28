import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export const Auth = async (request: Request, response: Response, _next: NextFunction) => {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError('Token is required', 401)
    }

    const [, token ] = authHeader.split(' ')

    try {
        await jwt.verify(token, process.env.APP_SECRET)
        _next()
    } catch (error) {
        throw new AppError('Token invalid', 401)
    }
}