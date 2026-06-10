import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {and, asc, eq} from "drizzle-orm";
import {
    factories,
    products,
    recipes,
    recipesIngredients, userFactories, users,
} from "../db/schema";
import {DbTransaction} from "../types/db.types";


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


    userFactories = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {
                const items = await this.context.db.select().from(userFactories)
                    .leftJoin(factories, eq(userFactories.factoryId, factories.id))
                    .where(eq(userFactories.userId, req.user.id))
                    .orderBy(asc(userFactories.factoryId));

                res.json({items: items});

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (_err) {
            console.error(_err);
            res.status(400).json({error: "Invalid token"});
        }
    }


    buyFactory = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            if (req.user?.id) {

                await this.context.db.transaction(async (trx: DbTransaction) => {

                    const [factory] = await trx.select().from(factories).where(eq(factories.id, Number(id)));

                    if (!req.user || !req.user.gameMoney || (factory && factory.price && Number(req.user.gameMoney) < Number(factory.price))) {
                        return res.status(200).json({error: "You dont have enough money!"});
                    }


                    await trx.insert(userFactories).values({
                        userId: req.user.id,
                        factoryId: Number(id),
                    })

                    await trx.update(users).set({
                        gameMoney: (Number(req.user.gameMoney) - Number(factory.price)).toString(),
                    })

                    res.json(
                        {item: factory}
                    );

                }).catch((err: unknown) => {
                    console.log(err)

                    return res.status(400).json({error: "Failed to buy factory!"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }
    }


}
