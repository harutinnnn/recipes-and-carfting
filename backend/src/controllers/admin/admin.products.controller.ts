import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {products} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
import path from "node:path";
import {removeFile, uploadFile} from "../../helpers/file.helper";
import {DbTransaction} from "../../types/db.types";

export class AdminProductsController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(products).orderBy(
                asc(products.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            console.log(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

    byType = async (req: Request, res: Response) => {


        try {


            const {type} = req.params;
            console.log('type',type);

            const items = await this.context.db.select().from(products)
                .where(eq(products.userProductTypes, type.toString()))
                .orderBy(
                    asc(products.id)
                );

            res.json({
                items: items,
            });

        } catch (err) {
            console.log(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

    getFood = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(products).where(eq(products.id, Number(id)));

            res.json({
                item: item,
            });

        } catch (err) {
            console.log(err);
            res.status(400).json({message: "Invalid token"});
        }
    }

    editFood = async (req: Request, res: Response) => {

        try {

            const {
                id,
                title,
                userProductTypes
            } = req.body;

            const tmpId = !isNaN(id) ? id : 0;

            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [product] = await trx.select().from(products).where(eq(products.id, parseInt(tmpId)));


                if (product?.id) {

                    let iconUrl = product.icon;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    if (icon) {

                        const rootDir = process.cwd();
                        if (iconUrl) {
                            await removeFile(path.join(rootDir, iconUrl));
                        }

                        const uploadedIcon = await uploadFile(icon, 'products');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    await trx.update(products).set({
                        title: title,
                        userProductTypes: userProductTypes,
                        icon: iconUrl,

                    }).where(eq(products.id, product?.id));


                    return res.json({
                        food: product,
                    });

                } else {

                    const [tmpProduct] = await trx.insert(products).values({
                        title: title,
                        icon: "",
                        userProductTypes: userProductTypes,

                    }).returning({id: products.id});
                    const insertId = tmpProduct?.id;


                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];
                    let iconUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'products');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    if (iconUrl) {

                        await trx.update(products).set({
                            icon: iconUrl,
                        }).where(eq(products.id, insertId));
                    }


                    return res.json({
                        product: tmpProduct,
                    });


                }

            }).catch((err: unknown) => {
                console.error(err);
                res.status(400).json({message: "Failed to create product"});
            })


        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

}
