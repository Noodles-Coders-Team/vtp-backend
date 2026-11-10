import {z} from "zod";
import {NextFunction, Request, RequestHandler, Response} from "express";

export function validateRequestSchema(schema: unknown): RequestHandler<any> {
    return (req: Request, res: Response, next: NextFunction) => {
        if (typeof schema != typeof z.ZodType)
            return res.status(400).send();
        const sch = schema as z.ZodType;
        const result = sch.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(result.error);
        }
        req.body = result.data;
        next();
    }
}