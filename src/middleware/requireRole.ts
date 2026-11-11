import express from "express";


export function requireRole(roles: string[]) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const session = res.locals.session;
        const role = session.user.role;
        if (!role || !roles.includes(role)) return res.status(403).json({error: "Forbidden"});
        next();
    }
}