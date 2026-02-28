import { Request, Response, NextFunction } from 'express';
import { AnyObjectSchema } from 'yup';

export const validate = (schema: AnyObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next(); 
    } catch (error: any) {
        return res.status(400).json({ 
            status: 'error',
            errors: error.errors 
        });
    }
};