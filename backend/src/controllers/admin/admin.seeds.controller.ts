import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {seeds, userSeeds} from "../../db/schema";

export class AdminSeedsController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(seeds);

            res.json({
                items: items,
            });

        } catch (err) {
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

}