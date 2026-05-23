import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {settings} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
import {DbTransaction} from "../../types/db.types";

export class AdminSettingsController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(settings).orderBy(
                asc(settings.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getSetting = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(settings).where(eq(settings.id, Number(id)));

            res.json({
                item: item,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    editSetting = async (req: Request, res: Response) => {


        try {

            const {
                id,
                title,
                key,
                value
            } = req.body;

            const tmpId = !isNaN(id) ? id : 0;

            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [setting] = await trx.select().from(settings).where(eq(settings.id, parseInt(tmpId)));


                if (setting?.id) {


                    await trx.update(settings).set({
                        title: title,
                        key: key,
                        value: value,
                    }).where(eq(settings.id, setting?.id));


                    return res.json({
                        setting: setting,
                    });

                } else {

                    const [tmpSetting] = await trx.insert(settings).values({
                        title: title,
                        key: key,
                        value: value,

                    }).returning({id: settings.id});
                    const insertId = tmpSetting?.id;


                    return res.json({
                        setting: tmpSetting,
                    });

                }

            }).catch((err: unknown) => {
                console.error(err);
                res.status(400).json({message: "Failed to create settings"});
            })


        } catch (err) {
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

}
