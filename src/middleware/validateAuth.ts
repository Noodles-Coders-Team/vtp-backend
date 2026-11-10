import express from "express";
import {auth} from "../lib/auth";
import {fromNodeHeaders} from "better-auth/node";

export async function validateAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const session = await auth.api.getSession({headers: fromNodeHeaders(req.headers)});
    if (!session) return res.status(401).json({error: "Unauthorized"});
    next();
}