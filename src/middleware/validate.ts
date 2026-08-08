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