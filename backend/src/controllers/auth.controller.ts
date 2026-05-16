import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";

export class AuthController {


    constructor(private context: AppContext) {
    }


    login(req: Request, res: Response) {
        try {


            res.json({
                message: 'Hello World',
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

}