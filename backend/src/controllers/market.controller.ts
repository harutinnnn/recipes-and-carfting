import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {and, asc, eq} from "drizzle-orm";
import {foods, seeds, userFoods, userProducts, users, userSeeds} from "../db/schema";
import {DbTransaction} from "../types/db.types";


export class MarketController {


    constructor(private context: AppContext) {
    }


    index = async (_req: Request, res: Response) => {
        try {

            const seedsData = await this.context.db.select().from(seeds).orderBy(asc(seeds.id));
            const foodsData = await this.context.db.select().from(foods).orderBy(asc(foods.id));

            res.json(
                {
                    items: {
                        seeds: seedsData,
                        food: foodsData
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

                    if (Number(seed.availableLevel) > Number(req.user?.level)) {
                        return res.status(200).json({error: `You can buy it from level ${req.user?.level}`});
                    }

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
                        gameMoney: (Number(req.user.gameMoney) - Number(seed.price)).toString(),
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

    buyFood = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            if (req.user?.id) {

                await this.context.db.transaction(async (trx: DbTransaction) => {

                    const [food] = await trx.select().from(foods).where(eq(foods.id, Number(id)));

                    if (!req.user || !req.user.gameMoney || (food && food.price && Number(req.user.gameMoney) < Number(food.price))) {
                        return res.status(200).json({error: "You dont have enough money!"});
                    }

                    const [userFoodData] = await trx.select().from(userFoods).where(
                        and(
                            eq(userFoods.userId, req.user.id),
                            eq(userFoods.foodId, Number(id))
                        )
                    );


                    if (userFoodData) {

                        await trx.update(userFoods).set({
                            count: Number(userFoodData.count) + 1,
                        }).where(eq(
                            userFoods.id, userFoodData.id
                        ))

                    } else {

                        await trx.insert(userFoods).values({
                            userId: req.user.id,
                            foodId: Number(id),
                            count: 1,
                        })
                    }

                    await trx.update(users).set({
                        gameMoney: (Number(req.user.gameMoney) - Number(food.price)).toString(),
                    })

                    res.json(
                        food
                    );

                }).catch((err: unknown) => {
                    console.log(err)

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

                    if (userProduct && Number(userProduct.count) <= 0) {
                        return res.status(200).json({error: "Dont have product for sell!"});
                    }

                    const [seed] = await trx.select().from(seeds).where(eq(seeds.id, Number(userProduct.seedId)));

                    await trx.update(userProducts).set({
                        count: Number(userProduct.count) - 1,
                    }).where(eq(userProducts.id, userProduct.id))


                    await trx.update(users).set({
                        gameMoney: (Number(req.user?.gameMoney) + Number(seed.minSellPrice)).toString(),
                    })

                    userProduct.count = Number(userProduct.count) - 1;

                    res.json(
                        userProduct
                    );

                }).catch((err: unknown) => {
                    console.log(err);

                    return res.status(400).json({error: "Failed to sell product!"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }

    }


    useFood = async (req: Request, res: Response) => {

        try {

            const {id} = req.params;
            if (req.user?.id) {

                await this.context.db.transaction(async (trx: DbTransaction) => {

                    const [userFood] = await trx.select().from(userFoods).where(
                        and(
                            eq(userFoods.id, Number(id)),
                            eq(userFoods.userId, Number(req.user?.id))
                        )
                    )

                    if (!userFood) {
                        return res.status(200).json({error: "The product does not exists!"});
                    }

                    if (userFood && Number(userFood.count) <= 0) {
                        return res.status(200).json({error: "Dont have product for sell!"});
                    }

                    const [food] = await trx.select().from(foods).where(eq(foods.id, Number(userFood.foodId)));

                    await trx.update(userFoods).set({
                        count: Number(userFood.count) - 1,
                    }).where(eq(userFoods.id, userFood.id))


                    await trx.update(users).set({
                        energy: (Number(req.user?.energy) + Number(food.energyPower)),
                    })

                    userFood.count = Number(userFood.count) - 1;

                    res.json(
                        userFood
                    );

                }).catch((err: unknown) => {
                    console.log(err);

                    return res.status(400).json({error: "Failed to sell product!"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }

    }

}
