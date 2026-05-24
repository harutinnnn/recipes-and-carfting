import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {factories} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
import {DbTransaction} from "../../types/db.types";
import {removeFile, uploadFile} from "../../helpers/file.helper";
import path from "node:path";

export class AdminFactoriesController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(factories).orderBy(
                asc(factories.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getFactory = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(factories).where(eq(factories.id, Number(id)));

            res.json({
                item: item,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    editFactory = async (req: Request, res: Response) => {


        try {

            const {
                id,
                title,
                price,
                availableFromLevel
            } = req.body;

            const tmpId = !isNaN(id) ? id : 0;

            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [factory] = await trx.select().from(factories).where(eq(factories.id, parseInt(tmpId)));


                if (factory?.id) {

                    let iconUrl = factory.icon;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    if (icon) {

                        const rootDir = process.cwd();
                        if (iconUrl) {
                            await removeFile(path.join(rootDir, iconUrl));
                        }

                        const uploadedIcon = await uploadFile(icon, 'factories');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    await trx.update(factories).set({
                        title: title,
                        price: Number(price),
                        availableFromLevel: Number(availableFromLevel),
                        icon: iconUrl
                    }).where(eq(factories.id, factory?.id));


                    return res.json({
                        factory: factory,
                    });

                } else {

                    const [tmpfactory] = await trx.insert(factories).values({
                        title: title,
                        price: Number(price),
                        availableFromLevel: Number(availableFromLevel),
                        icon: "",

                    }).returning({id: factories.id});
                    const insertId = tmpfactory?.id;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    let iconUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'factories');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }

                    if (iconUrl) {

                        await trx.update(factories).set({
                            icon: iconUrl,
                        }).where(eq(factories.id, insertId));
                    }

                    return res.json({
                        factory: tmpfactory,
                    });

                }

            }).catch((err: unknown) => {
                console.error(err);
                res.status(400).json({message: "Failed to create factory"});
            })


        } catch (err) {
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

}
