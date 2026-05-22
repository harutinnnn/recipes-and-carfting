import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {foods} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
import path from "node:path";
import {removeFile, uploadFile} from "../../helpers/file.helper";
import {DbTransaction} from "../../types/db.types";

export class AdminFoodsController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(foods).orderBy(
                asc(foods.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getFood = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(foods).where(eq(foods.id, Number(id)));

            res.json({
                item: item,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    editFood = async (req: Request, res: Response) => {

        try {

            const {
                id,
                title,
                price,
                energyPower
            } = req.body;

            const tmpId = !isNaN(id) ? id : 0;
            const titleValue = String(title);
            const priceValue = Number(price).toString();


            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [food] = await trx.select().from(foods).where(eq(foods.id, parseInt(tmpId)));


                if (food?.id) {

                    let iconUrl = food.icon;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    if (icon) {

                        const rootDir = process.cwd();
                        if (iconUrl) {
                            await removeFile(path.join(rootDir, iconUrl));
                        }

                        const uploadedIcon = await uploadFile(icon, 'foods');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    await trx.update(foods).set({
                        title: titleValue,
                        price: priceValue,
                        energyPower: energyPower,
                        icon: iconUrl,

                    }).where(eq(foods.id, food?.id));


                    return res.json({
                        food: food,
                    });

                } else {

                    const [tmpFood] = await trx.insert(foods).values({
                        title: titleValue,
                        icon: "",
                        energyPower: energyPower,
                        price: priceValue,


                    }).returning({id: foods.id});
                    const insertId = tmpFood?.id;


                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];
                    let iconUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'foods');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    if (iconUrl) {

                        await trx.update(foods).set({
                            icon: iconUrl,
                        }).where(eq(foods.id, insertId));
                    }


                    return res.json({
                        food: tmpFood,
                    });


                }

            }).catch((err: unknown) => {
                console.error(err);
                res.status(400).json({message: "Failed to create food"});
            })


        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

}
