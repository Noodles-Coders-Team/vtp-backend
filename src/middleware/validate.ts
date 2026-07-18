import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateRequest(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(result.error);
        }
        req.body = result.data;
        next();
    }
};

export function validateSchema<T>(body: any, schema: ZodSchema): T{
    const result = schema.safeParse(body);
    if (!result.success) {
        throw new Error('Validation error ' + result.error + '\nFor body:\n' + JSON.stringify(body, null, 2));
    }
    return result.data as T;
}