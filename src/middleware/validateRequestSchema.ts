import {z} from "zod";
import {NextFunction, Request, RequestHandler, Response} from "express";

export function validateRequestSchema(schema: z.ZodType, isArray: boolean = false): RequestHandler<any> {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = isArray ?
            schema.array().safeParse(req.body) :
            schema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json(result.error);
        }
        req.body = result.data;
        next();
    }
}