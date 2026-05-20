import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {seeds, userFields} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
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
            console.error(err);
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
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

    editSeed = async (req: Request, res: Response) => {

        try {

            const {id, title, price, availableLevel, xpOnCollect, collectionTime,takeEnergyCollect} = req.body;

            const tmpId = !isNaN(id) ? id : 0;


            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [seed] = await trx.select().from(seeds).where(eq(seeds.id, parseInt(tmpId)));


                if (seed?.id) {

                    let iconUrl = seed.icon;
                    let productImageUrl = seed.productImage;
                    let readyProductImageUrl = seed.readyProductImage;


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

                    if (productImage) {

                        const rootDir = process.cwd();

                        if (productImageUrl) {
                            await removeFile(path.join(rootDir, productImageUrl));
                        }

                        const uploadedProductImage = await uploadFile(productImage, 'seeds');
                        if (uploadedProductImage instanceof Error) {
                            throw uploadedProductImage;
                        }
                        productImageUrl = uploadedProductImage;
                    }


                    if (readyProductImage) {

                        const rootDir = process.cwd();

                        if (readyProductImageUrl) {
                            await removeFile(path.join(rootDir, readyProductImageUrl));
                        }

                        const uploadedReadyProductImage = await uploadFile(readyProductImage, 'seeds');
                        if (uploadedReadyProductImage instanceof Error) {
                            throw uploadedReadyProductImage;
                        }
                        readyProductImageUrl = uploadedReadyProductImage;
                    }

                    await trx.update(seeds).set({
                        title: title,
                        price: price,
                        availableLevel: Number(availableLevel),
                        xpOnCollect: Number(xpOnCollect),
                        collectionTime: Number(collectionTime),
                        takeEnergyCollect: Number(takeEnergyCollect),
                        icon: iconUrl,
                        productImage: productImageUrl,
                        readyProductImage: readyProductImageUrl
                    }).where(eq(seeds.id, seed.id));


                    return res.json({
                        seed: seed,
                    });

                } else {

                    const [tmpSeed] = await trx.insert(seeds).values({
                        title: title,
                        icon: "",
                        productImage: "",
                        readyProductImage: "",
                        price: Number(price),
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

                    if (productImage) {

                        const uploadedProductImage = await uploadFile(productImage, 'seeds');
                        if (uploadedProductImage instanceof Error) {
                            throw uploadedProductImage;
                        }
                        productImageUrl = uploadedProductImage;
                    }

                    if (readyProductImage) {

                        const uploadedReadyProductImage = await uploadFile(readyProductImage, 'seeds');
                        if (uploadedReadyProductImage instanceof Error) {
                            throw uploadedReadyProductImage;
                        }
                        readyProductImageUrl = uploadedReadyProductImage;
                    }

                    if (iconUrl || productImageUrl || readyProductImageUrl) {

                        await trx.update(seeds).set({
                            icon: iconUrl,
                            productImage: productImageUrl,
                            readyProductImage: readyProductImageUrl,
                        }).where(eq(seeds.id, insertId));
                    }


                    return res.json({
                        seed: tmpSeed,
                    });


                }

            }).catch((err: unknown) => {
                console.log(err)
                res.status(400).json({message: "Failed to create seed"});
            })


        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }


}
