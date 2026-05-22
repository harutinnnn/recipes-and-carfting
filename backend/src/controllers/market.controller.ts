import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {and, asc, eq} from "drizzle-orm";
import {seeds, userProducts, users, userSeeds} from "../db/schema";
import {DbTransaction} from "../types/db.types";


export class MarketController {


    constructor(private context: AppContext) {
    }


    index = async (_req: Request, res: Response) => {
        try {


            const seedsData = await this.context.db.select().from(seeds).orderBy(asc(seeds.id));


            res.json(
                {
                    items: {
                        seeds: seedsData
                    }
                }
            );

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    buySeed = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            if (req.user?.id) {

                await this.context.db.transaction(async (trx: DbTransaction) => {

                    const [seed] = await trx.select().from(seeds).where(eq(seeds.id, Number(id)));

                    if (!req.user || !req.user.gameMoney || (seed && seed.price && Number(req.user.gameMoney) < Number(seed.price))) {
                        return res.status(200).json({error: "You dont have enough money!"});
                    }

                    const [userSeedsData] = await trx.select().from(userSeeds).where(
                        and(
                            eq(userSeeds.userId, req.user.id),
                            eq(userSeeds.seedId, Number(id))
                        )
                    );

                    if (userSeedsData) {

                        await trx.update(userSeeds).set({
                            count: Number(userSeedsData.count) + 1,
                        }).where(eq(
                            userSeeds.id, userSeedsData.id
                        ))

                    } else {

                        await trx.insert(userSeeds).values({
                            userId: req.user.id,
                            seedId: Number(id),
                            count: 1,
                        })
                    }

                    await trx.update(users).set({
                        gameMoney: (Number(req.user.gameMoney) - Number(seed.price)),
                    })

                    res.json(
                        seed
                    );

                }).catch((err: unknown) => {

                    return res.status(400).json({error: "Failed to buy seed!"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }
    }


    sellProduct = async (req: Request, res: Response) => {

        try {

            const {id} = req.params;
            if (req.user?.id) {

                await this.context.db.transaction(async (trx: DbTransaction) => {

                    const [userProduct] = await trx.select().from(userProducts).where(
                        and(
                            eq(userProducts.id, Number(id)),
                            eq(userProducts.userId, Number(req.user?.id))
                        )
                    )

                    if (!userProduct) {
                        return res.status(200).json({error: "The product does not exists!"});
                    }

                    if(userProduct && Number(userProduct.count) <= 0){
                        return res.status(200).json({error: "Dont have product for sell!"});
                    }

                    const [seed] = await trx.select().from(seeds).where(eq(seeds.id, Number(userProduct.seedId)));

                    await trx.update(userProducts).set({
                        count: Number(userProduct.count) - 1,
                    }).where(eq(userProducts.id, userProduct.id))


                    await trx.update(users).set({
                        gameMoney: (Number(req.user?.gameMoney) + Number(seed.price)),
                    })

                    userProduct.count = Number(userProduct.count) - 1;

                    res.json(
                        userProduct
                    );

                }).catch((err: unknown) => {
                    console.log(err);

                    return res.status(400).json({error: "Failed to sell roduct!"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }

    }

}
