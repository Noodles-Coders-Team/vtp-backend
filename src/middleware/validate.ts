import {ZodSchema} from "zod";
import {NextFunction, Request, RequestHandler, Response} from "express";

export function validateRequest(schema: ZodSchema): RequestHandler<any> {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(result.error);
        }
        req.body = result.data;
        next();
    }
}