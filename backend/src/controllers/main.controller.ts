import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {
    factories,
    foods, recipes,
    seeds,
    seedsProgressImages,
    settings, userFactories,
    userFields,
    userFoods,
    userProducts,
    users,
    userSeeds
} from "../db/schema";
import {and, asc, eq} from "drizzle-orm";
import {FieldStatusEnum} from "../enums/FieldStatusEnum";
import {IngredientTypesEnum} from "../enums/IngredientTypesEnum";
import {DbTransaction} from "../types/db.types";
import {UserService} from "../services/user.service";
import * as wasi from "node:wasi";
import {SettingEnums} from "../enums/SettingEnums";

type UserFieldWithSeed = {
    userFields: typeof userFields.$inferSelect;
    seeds: typeof seeds.$inferSelect | null;
};


export class MainController {


    constructor(private context: AppContext) {
    }


    index(_req: Request, res: Response) {
        try {


            res.json({
                error: 'Hello World',
            });

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }
    }


    fieldPrice = async (_req: Request, res: Response) => {
        try {


            const [fieldPrice] = await this.context.db.select().from(settings).where(
                eq(
                    settings.key, SettingEnums.FIELD_PRICE
                )
            );

            if (!fieldPrice.value) {
                return res.status(200).json({error: "Cant get field price"});
            }

            return res.json(Number(fieldPrice.value));


        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    buyNewField = async (req: Request, res: Response) => {
        try {

            await this.context.db.transaction(async (trx: DbTransaction) => {
                const [fieldPrice] = await trx.select().from(settings).where(
                    eq(
                        settings.key, SettingEnums.FIELD_PRICE
                    )
                );

                if (!fieldPrice.value) {
                    return res.status(200).json({error: "Cant get field price"});
                }

                if (req.user?.id) {

                    if (req.user.gameMoney && Number(req.user.gameMoney) >= Number(fieldPrice.value)) {

                        await trx.insert(userFields).values({
                            userId: Number(req.user?.id),
                        })


                        await trx.update(users).set({
                            gameMoney: (Number(req.user.gameMoney) - Number(fieldPrice.value)).toString(),
                        })

                        return res.json({success: true});


                    } else {
                        res.status(200).json({error: "Dont have enough money!"});
                    }

                } else {
                    res.status(200).json({error: "Failed fetch user"});
                }

            }).catch((err: unknown) => {
                res.status(400).json({error: "Failed to buy field"});
            })

        } catch (_err) {
            res.status(400).json({error: "Invalid token"});
        }
    }


    seeds = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(seeds).orderBy(asc(seeds.id));

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    fields = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userFields)
                        .where(eq(userFields.userId, req.user?.id))
                        .leftJoin(seeds, eq(seeds.id, userFields.seedId)).orderBy(
                            asc(userFields.id)
                        );


                const itemsRes = await Promise.all(items.map(async (item: UserFieldWithSeed) => ({
                    ...item,
                    seedsProgressImage: item.seeds
                        ? await this.context.db.select()
                            .from(seedsProgressImages)
                            .where(eq(seedsProgressImages.seedId, item.seeds.id)).orderBy(
                                asc(seedsProgressImages.pos)
                            )
                        : [],
                })));

                res.json({
                    items: itemsRes,
                });

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            console.log(err);
            res.status(400).json({error: "Invalid token"});
        }
    }

    userSeeds = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userSeeds)
                        .where(eq(userSeeds.userId, req.user?.id))
                        .leftJoin(seeds, eq(seeds.id, userSeeds.seedId)).orderBy(asc(userSeeds.seedId));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    userFactories = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userFactories)
                        .where(eq(userFactories.userId, req.user?.id))
                        .leftJoin(factories, eq(factories.id, userFactories.factoryId))
                        .leftJoin(recipes, eq(recipes.id, userFactories.recipeId)).orderBy(asc(userFactories.factoryId));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    userProducts = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userProducts)
                        .where(eq(userProducts.userId, req.user?.id))
                        .leftJoin(seeds, eq(seeds.id, userProducts.seedId))
                        .orderBy(asc(userProducts.id));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    userFoods = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userFoods)
                        .where(eq(userFoods.userId, req.user?.id))
                        .leftJoin(foods, eq(foods.id, userFoods.foodId))
                        .orderBy(asc(foods.id));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({error: "Invalid token"});
        }
    }

    setUserSeeds = async (req: Request, res: Response) => {
        try {

            const {fieldId, seedId} = req.body

            if (req.user?.id) {


                await this.context.db.transaction(async (trx: DbTransaction) => {


                    const [seed] = await trx.select().from(seeds).where(eq(
                        seeds.id, seedId
                    ));


                    if (Number(req.user?.energy) && seed?.takeEnergyCollect && Number(seed?.takeEnergyCollect) > Number(req.user?.energy)) {
                        return res.status(200).json({error: "You dont have enough energy please. restore energy!"});
                    }


                    if (!seed) {
                        return res.status(200).json({error: "Wrong seed!"});
                    }

                    const [userField] = await trx.select().from(userFields).where(
                        and(
                            eq(userFields.userId, Number(req.user?.id)),
                            eq(userFields.id, Number(fieldId)),
                            eq(userFields.status, FieldStatusEnum.pending),
                        )
                    );

                    if (!userField) {
                        return res.status(200).json({error: "Field already seeded!"});
                    }

                    const [userSeedsData] = await trx.select().from(userSeeds).where(
                        and(
                            eq(userSeeds.userId, Number(req.user?.id)),
                            eq(userSeeds.seedId, Number(seedId)),
                        )
                    );

                    if (!userSeedsData) {
                        return res.status(200).json({error: "You dont have enough seeds!"});
                    }

                    if (userSeedsData) {

                        if (Number(userSeedsData?.count) < 1) {
                            return res.status(200).json({error: "You dont have enough seeds!"});
                        }
                    }


                    const now = new Date();
                    const endDate = new Date(Date.now() + Number(seed.collectionTime) * 1000);

                    await trx.update(userFields).set(
                        {
                            seedId: seedId,
                            status: FieldStatusEnum.in_progress,
                            startedAt: now,
                            finishedAt: endDate,
                        }
                    ).where(
                        and(
                            eq(userFields.userId, Number(req.user?.id)),
                            eq(userFields.id, Number(fieldId)),
                        )
                    )

                    await trx.update(userSeeds).set(
                        {
                            count: Number(userSeedsData.count) - 1,
                        }
                    ).where(
                        and(
                            eq(userSeeds.userId, Number(req.user?.id)),
                            eq(userSeeds.id, Number(userSeedsData.id)),
                        )
                    )

                    await trx.update(users).set({
                        energy: Number(req.user?.energy) - Number(seed.takeEnergyCollect),
                    }).where(
                        eq(users.id, Number(req.user?.id))
                    )

                    res.json({
                        items: 1,
                    });

                }).catch((err: unknown) => {
                    res.status(400).json({error: "Failed to create seed"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {

            res.status(400).json({error: "Invalid token"});
        }
    }

    collectUserField = async (req: Request, res: Response) => {
        try {

            const {id} = req.params

            if (req.user?.id) {

                await this.context.db.transaction(async (trx: DbTransaction) => {

                    const [userField] = await trx.select().from(userFields).where(
                        and(
                            eq(userFields.id, Number(id)),
                            eq(userFields.userId, Number(req.user?.id)))
                    )

                    if (userField) {

                        if (userField.status === FieldStatusEnum.in_progress) {
                            if (userField.seedId === null) {
                                return res.status(200).json({error: "Can not find seed from current field!"});
                            }

                            const [seed] = await trx.select().from(seeds).where(eq(
                                seeds.id, userField.seedId
                            ));

                            if (!seed) {
                                return res.status(200).json({error: "Can not find seed from current field!"});
                            }


                            if (Number(req.user?.energy) && seed?.takeEnergyCollect && Number(req.user?.energy) < Number(seed?.takeEnergyCollect)) {
                                return res.status(200).json({error: "You dont have enough energy please. restore energy!"});
                            }

                            const now = new Date();

                            //TODO check after
                            if (userField.finishedAt !== null && ((userField.finishedAt.getTime() - now.getTime()) / 1000) <= 0) {

                                await trx.update(userFields).set(
                                    {
                                        seedId: null,
                                        status: FieldStatusEnum.pending,
                                        startedAt: null,
                                        finishedAt: null,
                                    }
                                ).where(
                                    and(
                                        eq(userFields.userId, Number(req.user?.id)),
                                        eq(userFields.id, Number(id)),
                                    )
                                );

                                const userService = new UserService();

                                let xpAdd = Number(req.user?.xp) + Number(seed.xpOnCollect);
                                const tmpNewLevel = Number(req.user?.level) + 1;
                                const nextLevelXp = userService.userUpToNextLvlByPercent(Number(req.user?.level))
                                let newNextLevelXp = nextLevelXp;

                                let newLevel: number = Number(req.user?.level);

                                if (xpAdd >= nextLevelXp) {
                                    xpAdd = 0;
                                    newLevel = tmpNewLevel;
                                    newNextLevelXp = userService.userUpToNextLvlByPercent(Number(req.user?.level) + 1);
                                }

                                await trx.update(users).set({
                                    xp: xpAdd,
                                    level: newLevel,
                                    nextLevelXP: newNextLevelXp,
                                    energy: Number(req.user?.energy) - Number(seed.takeEnergyCollect),
                                }).where(
                                    eq(users.id, Number(req.user?.id))
                                )

                                const [userProduct] = await trx.select().from(userProducts).where(and(
                                    eq(userProducts.userId, Number(req.user?.id)),
                                    eq(userProducts.seedId, Number(seed.id)),
                                ))

                                if (userProduct) {

                                    await trx.update(userProducts).set(
                                        {
                                            count: Number(userProduct.count) + 1,
                                        }
                                    ).where(
                                        eq(userProducts.id, Number(userProduct.id)),
                                    )

                                } else {

                                    await trx.insert(userProducts).values({
                                        userId: Number(req.user?.id),
                                        seedId: Number(seed.id),
                                        count: 1,
                                        userProductTypes: IngredientTypesEnum.VEGETABLE
                                    })
                                }


                            } else {
                                return res.status(200).json({error: "The field not ready yet!"});
                            }


                            return res.json({
                                field: userField,
                            });

                        } else {

                            return res.status(200).json({error: "The field not ready yet!"});
                        }


                    } else {
                        return res.status(200).json({error: "Wrong field"});
                    }

                }).catch((err: unknown) => {

                    return res.status(400).json({error: "Failed to create seed"});
                })


            } else {
                return res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            return res.status(400).json({error: "Invalid token"});
        }
    }


}
