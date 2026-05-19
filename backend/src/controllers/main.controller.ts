import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {seeds, userFields} from "../db/schema";
import {eq} from "drizzle-orm";

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


    seeds = async (req: Request, res: Response) => {
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

    fields = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userFields)
                        .where(eq(userFields.userId, req.user?.id))
                        .leftJoin(seeds, eq(seeds.id, userFields.seedId));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }


}