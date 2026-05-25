import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {seeds, seedsProgressImages, userFields} from "../../db/schema";
import {and, asc, eq} from "drizzle-orm";
import path from "node:path";
import {removeFile, uploadFile} from "../../helpers/file.helper";
import {DbTransaction} from "../../types/db.types";

export class AdminSeedsController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(seeds).orderBy(
                asc(seeds.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getSeed = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(seeds).where(eq(seeds.id, Number(id)));

            res.json({
                item: item,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    editSeed = async (req: Request, res: Response) => {

        try {

            const {
                id,
                productId,
                title,
                price,
                minSellPrice,
                availableLevel,
                xpOnCollect,
                collectionTime,
                takeEnergyCollect
            } = req.body;

            console.log('productId',productId)

            const tmpId = !isNaN(id) ? id : 0;
            const titleValue = String(title);
            const priceValue = Number(price).toString();
            const minSellPriceValue = Number(minSellPrice).toString();


            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [seed] = await trx.select().from(seeds).where(eq(seeds.id, parseInt(tmpId)));


                if (seed?.id) {

                    let iconUrl = seed.icon;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];
                    const productImage = files?.productImage?.[0];
                    const readyProductImage = files?.readyProductImage?.[0];

                    if (icon) {

                        const rootDir = process.cwd();
                        if (iconUrl) {
                            await removeFile(path.join(rootDir, iconUrl));
                        }

                        const uploadedIcon = await uploadFile(icon, 'seeds');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }

                    await trx.update(seeds).set({
                        productId: productId,
                        title: titleValue,
                        price: priceValue,
                        minSellPrice: minSellPriceValue,
                        availableLevel: Number(availableLevel),
                        xpOnCollect: Number(xpOnCollect),
                        collectionTime: Number(collectionTime),
                        takeEnergyCollect: Number(takeEnergyCollect),
                        icon: iconUrl
                    }).where(eq(seeds.id, seed.id));


                    return res.json({
                        seed: seed,
                    });

                } else {

                    const [tmpSeed] = await trx.insert(seeds).values({
                        productId: productId,
                        title: titleValue,
                        icon: "",
                        price: priceValue,
                        minSellPrice: minSellPriceValue,
                        availableLevel: Number(availableLevel),
                        xpOnCollect: Number(xpOnCollect),
                        collectionTime: Number(collectionTime),
                        takeEnergyCollect: Number(takeEnergyCollect),

                    }).returning({id: seeds.id});
                    const insertId = tmpSeed?.id;


                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];
                    const productImage = files?.productImage?.[0];
                    const readyProductImage = files?.readyProductImage?.[0];
                    let iconUrl = "";
                    let productImageUrl = "";
                    let readyProductImageUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'seeds');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }

                    if (iconUrl || productImageUrl || readyProductImageUrl) {

                        await trx.update(seeds).set({
                            icon: iconUrl,
                        }).where(eq(seeds.id, insertId));
                    }

                    return res.json({
                        seed: tmpSeed,
                    });
                }

            }).catch((err: unknown) => {
                console.error(err);
                res.status(400).json({message: "Failed to create seed"});
            })


        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }


    uploadSeedProgressFile = async (req: Request, res: Response) => {

        try {

            const {seedId, pos} = req.body;
            const seedIdValue = Number(seedId);
            const posValue = Number(pos);


            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [seed] = await trx.select().from(seeds).where(eq(seeds.id, seedIdValue));

                if (seed?.id) {

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];
                    let iconUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'seeds');

                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    if (iconUrl) {
                        const [progressImage] = await trx.select().from(seedsProgressImages).where(
                            and(
                                eq(seedsProgressImages.seedId, seedIdValue),
                                eq(seedsProgressImages.pos, posValue)
                            )
                        );

                        if (progressImage?.icon) {
                            await removeFile(path.join(process.cwd(), progressImage.icon));
                        }

                        const [seedsProgressImagesData] = progressImage?.id
                            ? await trx.update(seedsProgressImages).set({
                                icon: iconUrl,
                            }).where(eq(seedsProgressImages.id, progressImage.id)).returning()
                            : await trx.insert(seedsProgressImages).values({
                                icon: iconUrl,
                                seedId: seedIdValue,
                                pos: posValue
                            }).returning();


                        return res.json({
                            seedsProgressImages: seedsProgressImagesData,
                        });

                    } else {
                        return res.status(200).json({message: "Filed to upload seed progress image"});
                    }


                } else {

                    return res.status(200).json({message: "Filed to upload seed progress image"});

                }

            }).catch((err: unknown) => {
                return res.status(400).json({message: "Failed to create seed"});
            })


        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getSeedProgressImages = async (req: Request, res: Response) => {
        try {


            const {id} = req.params;
            const items = await this.context.db.select().from(seedsProgressImages).orderBy(
                asc(seedsProgressImages.pos)
            ).where(
                eq(
                    seedsProgressImages.seedId, Number(id)
                )
            );

            res.json({
                items: items,
            });

        } catch (err) {
            console.log(err)
            res.status(400).json({message: "Invalid token"});
        }
    }


}
