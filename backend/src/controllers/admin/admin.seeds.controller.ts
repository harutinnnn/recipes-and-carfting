import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {seeds} from "../../db/schema";
import {eq} from "drizzle-orm";
import path from "node:path";
import {removeFile, uploadFile} from "../../helpers/file.helper";

export class AdminSeedsController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
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


        if (!req?.user?.isAdmin) {
            throw Error("Wrong user");
        }

        try {

            const {id, title, price, availableLevel, xpOnCollect} = req.body;

            const tmpId = !isNaN(id) ? id : 0;


            this.context.db.transaction(async (trx: any) => {

                const [seed] = await trx.select().from(seeds).where(eq(seeds.id, parseInt(tmpId)));


                if (seed?.id) {

                    let iconUrl = seed.icon;


                    if (req?.file) {

                        const rootDir = process.cwd();
                        await removeFile(path.join(rootDir, iconUrl));

                        iconUrl = await uploadFile(req.file, 'seeds');
                    }

                    await trx.update(seeds).set({
                        title: title,
                        price: price,
                        availableLevel: availableLevel,
                        xpOnCollect: xpOnCollect,
                        icon: iconUrl
                    }).where(eq(seeds.id, seed.id));


                    return res.json({
                        seed: seed,
                    });

                } else {

                    const [tmpSeed] = await trx.insert(seeds).values({
                        title: title,
                        icon: "",
                        price: Number(price),
                        availableLevel: Number(availableLevel),
                        xpOnCollect: Number(xpOnCollect),

                    }).returning({id: seeds.id});
                    const insertId = tmpSeed?.id;


                    if (req?.file) {

                        const fileUrl = await uploadFile(req.file, 'seeds')

                       const a = await trx.update(seeds).set({
                            icon: fileUrl,
                        }).where(eq(seeds.id, insertId));

                        console.log(a)

                    }


                    return res.json({
                        seed: tmpSeed,
                    });


                }

            }).catch((err: any) => {
                console.log(err)
                return new Error("Failed to register user")
            })


        } catch (err) {
            console.log(err);
            res.status(400).json({message: "Invalid token"});
        }
    }


}