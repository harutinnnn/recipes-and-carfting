import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {recipes} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
import {DbTransaction} from "../../types/db.types";
import {removeFile, uploadFile} from "../../helpers/file.helper";
import path from "node:path";

export class AdminRecipesController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(recipes).orderBy(
                asc(recipes.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getRecipe = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(recipes).where(eq(recipes.id, Number(id)));

            res.json({
                item: item,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    editRecipe = async (req: Request, res: Response) => {


        try {

            const {
                id,
                title,
                price,
                factoryId,
                availableFromLevel,
                xpOnCollect,
                takeEnergyCollect
            } = req.body;

            const tmpId = !isNaN(id) ? id : 0;

            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [recipe] = await trx.select().from(recipes).where(eq(recipes.id, parseInt(tmpId)));


                if (recipe?.id) {

                    let iconUrl = recipe.icon;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    if (icon) {

                        const rootDir = process.cwd();
                        if (iconUrl) {
                            await removeFile(path.join(rootDir, iconUrl));
                        }

                        const uploadedIcon = await uploadFile(icon, 'recipes');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    await trx.update(recipes).set({
                        title: title,
                        price: Number(price),
                        factoryId: Number(factoryId),
                        availableFromLevel: Number(availableFromLevel),
                        xpOnCollect: Number(xpOnCollect),
                        takeEnergyCollect: Number(takeEnergyCollect),
                        icon: iconUrl
                    }).where(eq(recipes.id, recipe?.id));


                    return res.json({
                        recipe: recipe,
                    });

                } else {

                    const [tmpRecipe] = await trx.insert(recipes).values({
                        title: title,
                        price: Number(price),
                        factoryId: Number(factoryId),
                        availableFromLevel: Number(availableFromLevel),
                        xpOnCollect: Number(xpOnCollect),
                        takeEnergyCollect: Number(takeEnergyCollect),
                        icon: "",

                    }).returning({id: recipes.id});
                    const insertId = tmpRecipe?.id;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    let iconUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'recipes');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }

                    if (iconUrl) {

                        await trx.update(recipes).set({
                            icon: iconUrl,
                        }).where(eq(recipes.id, insertId));
                    }

                    return res.json({
                        recipe: tmpRecipe,
                    });

                }

            }).catch((err: unknown) => {
                console.error(err);
                res.status(400).json({message: "Failed to create recipe"});
            })


        } catch (err) {
            console.error(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

}
