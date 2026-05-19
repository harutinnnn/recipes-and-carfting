import {Request, Response, NextFunction} from "express";

export const checkIsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.isAdmin) {
        next()
    } else {
        return res.status(400).json({message: "Wrong user"});
    }
}