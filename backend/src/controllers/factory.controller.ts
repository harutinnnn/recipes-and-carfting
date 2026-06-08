import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {and, asc, eq} from "drizzle-orm";
import {
    factories,
    products,
    recipes,
    recipesIngredients,
} from "../db/schema";


export class FactoryController {


    constructor(private context: AppContext) {
    }


    index = async (_req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(factories).orderBy(asc(factories.id));

            res.json({items: items});
        } catch (_err) {
            console.error(_err);
            res.status(400).json({error: "Invalid token"});
        }
    }


    buyFactory = async (_req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(factories).orderBy(asc(factories.id));

            res.json({items: items});
        } catch (_err) {
            console.error(_err);
            res.status(400).json({error: "Invalid token"});
        }
    }


}
