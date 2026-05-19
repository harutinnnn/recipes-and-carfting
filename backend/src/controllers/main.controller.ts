import {AppContext} from "../types/app.context.type";
import {Request, Response} from "express";
import {seeds, userFields, userSeeds} from "../db/schema";
import {and, eq} from "drizzle-orm";
import type {db} from "../db";
import {FieldStatusEnum} from "../enums/FieldStatusEnum";

type SeedsTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];


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
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

    setUserSeeds = async (req: Request, res: Response) => {
        try {

            const {fieldId, seedId} = req.body

            if (req.user?.id) {


                await this.context.db.transaction(async (trx: SeedsTransaction) => {


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


                    if (!userSeedsData || (userSeedsData.count && userSeedsData.count <= 0)) {
                        return res.status(400).json({message: "You dont have enough seeds!"});
                    }


                    //TODO some thing wrong with dates
                    const now = new Date();
                    const endDate = new Date(now.getSeconds() + Number(seed.collectionTime));

                    console.log(now)
                    console.log(endDate)

                    const seedUserField = await trx.update(userFields).set(
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

                    const discountUserSeed = await trx.update(userSeeds).set(
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
                    console.error(err);
                    res.status(400).json({message: "Failed to create seed"});
                })


            } else {
                res.status(500).json({error: "Failed fetch user"});
            }

        } catch (err) {
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }


}