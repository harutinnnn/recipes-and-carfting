import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";

export class MainController {


    constructor(private context: AppContext) {
    }


    index(req: Request, res: Response) {
        try {


            res.json({
                message: 'Hello World',
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

}