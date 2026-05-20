import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {seeds, userFields, userProducts, users, userSeeds} from "../db/schema";
import {and, asc, eq} from "drizzle-orm";
import type {db} from "../db";
import {FieldStatusEnum} from "../enums/FieldStatusEnum";
import {IngredientTypesEnum} from "../enums/IngredientTypesEnum";
import {DbTransaction} from "../types/db.types";
import {UserService} from "../services/user.service";
import {number} from "zod";


export class MainController {


    constructor(private context: AppContext) {
    }


    index(_req: Request, res: Response) {
        try {


            res.json({
                message: 'Hello World',
            });

        } catch (_err) {
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
                        .leftJoin(seeds, eq(seeds.id, userFields.seedId)).orderBy(
                            asc(userFields.id)
                        );

                res.json({
                    items: items,
                });

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    userSeeds = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userSeeds)
                        .where(eq(userSeeds.userId, req.user?.id))
                        .leftJoin(seeds, eq(seeds.id, userSeeds.seedId));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    userProducts = async (req: Request, res: Response) => {
        try {

            if (req.user?.id) {

                const items =
                    await this.context.db.select()
                        .from(userProducts)
                        .where(eq(userProducts.userId, req.user?.id))
                        .leftJoin(seeds, eq(seeds.id, userProducts.seedId));

                res.json({
                    items: items,
                });
            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
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

                    if (!seed) {
                        return res.status(400).json({message: "Wrong seed!"});
                    }

                    const [userField] = await trx.select().from(userFields).where(
                        and(
                            eq(userFields.userId, Number(req.user?.id)),
                            eq(userFields.id, Number(fieldId)),
                            eq(userFields.status, FieldStatusEnum.pending),
                        )
                    );

                    if (!userField) {
                        return res.status(400).json({message: "Field already seeded!"});
                    }

                    const [userSeedsData] = await trx.select().from(userSeeds).where(
                        and(
                            eq(userSeeds.userId, Number(req.user?.id)),
                            eq(userSeeds.seedId, Number(seedId)),
                        )
                    );

                    if (!userSeedsData) {
                        return res.status(400).json({message: "You dont have enough seeds!"});
                    }

                    if (userSeedsData) {

                        if (Number(userSeedsData?.count) < 1) {
                            return res.status(400).json({message: "You dont have enough seeds!"});
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

                    res.json({
                        items: 1,
                    });

                }).catch((err: unknown) => {
                    res.status(400).json({message: "Failed to create seed"});
                })

            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {

            res.status(400).json({message: "Invalid token"});
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
                                return res.status(400).json({message: "Can not find seed from current field!"});
                            }

                            const [seed] = await trx.select().from(seeds).where(eq(
                                seeds.id, userField.seedId
                            ));

                            if (!seed) {
                                return res.status(400).json({message: "Can not find seed from current field!"});
                            }


                            if (req.user?.energy && seed?.takeEnergyCollect && req.user?.energy < seed?.takeEnergyCollect) {
                                return res.status(400).json({message: "You dont have enough energy please. restore energy!"});
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
                                return res.status(400).json({message: "The field not ready yet!"});
                            }


                            return res.json({
                                field: userField,
                            });

                        } else {

                            return res.status(400).json({message: "The field not ready yet!"});
                        }


                    } else {
                        return res.status(400).json({message: "Wrong field"});
                    }

                }).catch((err: unknown) => {

                    return res.status(400).json({message: "Failed to create seed"});
                })


            } else {
                return res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            return res.status(400).json({message: "Invalid token"});
        }
    }


}
